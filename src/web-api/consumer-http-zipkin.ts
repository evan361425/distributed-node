/**
 * Distributed Request Tracing with Zipkin
 * ---
 * 1. docker run -p 9411:9411 -it --name zipkin openzipkin/zipkin-slim
 * 2. npx ts-node src/web-api/consumer-http-zipkin.ts
 * 3. npx ts-node src/recipe-api/producer-http-zipkin.ts
 */
import express from 'express';
import got, { Got, Options } from 'got';
import {
  BatchRecorder,
  ExplicitContext,
  Instrumentation,
  jsonEncoder,
  sampler,
  TraceId,
  Tracer,
} from 'zipkin';
import { expressMiddleware } from 'zipkin-instrumentation-express';
import { HttpLogger } from 'zipkin-transport-http';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const TARGET = process.env.TARGET || 'localhost:4000';
const ZIPKIN = process.env.ZIPKIN || 'http://localhost:9411/api/v2/spans';

const app = express();
const tracer = createTracer();

const recipeInstance: Got = wrapGot({
  tracer,
  remoteServiceName: 'recipe-api',
});

// Add the Zipkin middleware
app.use(expressMiddleware({ tracer }));

app.get('/', async (_req, res) => {
  await tracer.local<Promise<void>>(
    'do_some_task',
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 100);
      }),
  );
  const producer_data = await tracer.local('get_recipe', () =>
    recipeInstance(`http://${TARGET}/recipes/42`).json(),
  );

  res.json({
    consumer_pid: process.pid,
    producer_data,
    trace: tracer.id,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});

function createTracer() {
  const ctxImpl = new ExplicitContext();
  const logger = new HttpLogger({
    endpoint: ZIPKIN,
    jsonEncoder: jsonEncoder.JSON_V2,
  });
  const recorder = new BatchRecorder({ logger });

  return new Tracer({
    ctxImpl,
    recorder,
    localServiceName: 'web-api',
    sampler: new sampler.CountingSampler(1),
  });
}

function wrapGot(options: { tracer: Tracer; remoteServiceName: string }) {
  const instrumentation = new Instrumentation.HttpClient({
    tracer: options.tracer,
    remoteServiceName: options.remoteServiceName,
  });

  function getZipkinContext(
    opts: GotOptionWithZipkin,
  ): ZipkinContext | Partial<ZipkinContext> {
    if (opts._zipkin === undefined) {
      opts._zipkin = {};
    }

    return opts._zipkin;
  }

  return got.extend({
    hooks: {
      init: [
        (opts) => {
          const zipkin = getZipkinContext(opts);
          zipkin.parentId = tracer.id;
        },
      ],
      beforeRequest: [
        (opts) => {
          const url = opts.url.href;
          const method = opts.method || 'GET';
          const zipkin = getZipkinContext(opts) as ZipkinContext;

          tracer.letId(zipkin.parentId, () => {
            instrumentation.recordRequest(opts, url, method);
            zipkin.traceId = tracer.id;
          });
        },
      ],
      afterResponse: [
        (res) => {
          const zipkin = getZipkinContext(res.request.options) as ZipkinContext;

          tracer.scoped(() => {
            instrumentation.recordResponse(zipkin.traceId, `${res.statusCode}`);
          });
          return res;
        },
      ],
      beforeError: [
        (err) => {
          if (!err.options) return err;

          const zipkin = getZipkinContext(err.options) as ZipkinContext;

          tracer.scoped(() => {
            instrumentation.recordError(zipkin.traceId, err);
          });
          return err;
        },
      ],
    },
  });
}

type Merge<t1, t2> = Except<t1, Extract<keyof t1, keyof t2>> & t2;
type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>;

type ZipkinContext = {
  traceId: TraceId;
  parentId: TraceId;
};
type GotOptionWithZipkin = Merge<
  Options,
  {
    _zipkin?: ZipkinContext | Partial<ZipkinContext>;
  }
>;
