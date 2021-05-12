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
const ZIPKIN = process.env.ZIPKIN || 'http://localhost:9411';

const app = express();
const ctxImpl = new ExplicitContext();
const logger = new HttpLogger({
  endpoint: ZIPKIN,
  jsonEncoder: jsonEncoder.JSON_V2,
});
const recorder = new BatchRecorder({ logger });
const serviceName = 'web-api';
const remoteServiceName = 'recipe-api';
const tracer = new Tracer({
  ctxImpl,
  recorder,
  localServiceName: serviceName,
  sampler: new sampler.CountingSampler(1),
});
const recipeInstance: Got = wrapGot({
  tracer,
  serviceName,
  remoteServiceName,
});

// Add the Zipkin middleware
app.use(expressMiddleware({ tracer }));

app.get('/', async (_req, res) => {
  const producer_data = await tracer.local('get_root', () => {
    return recipeInstance(`http://${TARGET}/recipes/42`).json();
  });

  res.json({
    consumer_pid: process.pid,
    producer_data,
    trace: tracer.id,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});

function wrapGot(options: {
  tracer: Tracer;
  serviceName: string;
  remoteServiceName: string;
}) {
  const instrumentation = new Instrumentation.HttpClient({
    tracer: options.tracer,
    serviceName: options.serviceName,
    remoteServiceName: options.remoteServiceName,
  });

  return got.extend({
    hooks: {
      init: [
        (opts) => {
          const ctx = getZipkinContext(opts);
          ctx.parentId = tracer.id;
        },
      ],
      beforeRequest: [
        (opts) => {
          const url = opts.url.href;
          const method = opts.method || 'GET';
          const ctx = getZipkinContext(opts);
          tracer.letId(ctx.parentId, () => {
            instrumentation.recordRequest(opts, url, method);
            ctx.traceId = tracer.id;
          });
        },
      ],
      afterResponse: [
        (res) => {
          const ctx = getZipkinContext(res.request.options);
          tracer.scoped(() => {
            instrumentation.recordResponse(ctx.traceId, `${res.statusCode}`);
          });
          return res;
        },
      ],
      beforeError: [
        (err) => {
          if (!err.options) return err;
          const ctx = getZipkinContext(err.options);
          tracer.scoped(() => {
            instrumentation.recordError(ctx.traceId, err);
          });
          return err;
        },
      ],
    },
  });
}

function getZipkinContext(opts: GotJsonOptionWithZipkin): {
  traceId: TraceId;
  parentId: TraceId;
} {
  if (!opts._zipkin) {
    Object.assign(opts, { _zipkin: {} });
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return opts._zipkin!;
}

type Merge<t1, t2> = Except<t1, Extract<keyof t1, keyof t2>> & t2;
type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>;
export type GotJsonOptionWithZipkin = Merge<
  Options,
  {
    _zipkin?: {
      traceId: TraceId;
      parentId: TraceId;
    };
  }
>;
