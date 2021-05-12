/**
 * Distributed Request Tracing with Zipkin
 * ---
 * 1. docker run -p 9411:9411 -it --name zipkin openzipkin/zipkin-slim
 * 2. npx ts-node src/web-api/consumer-http-zipkin.ts
 * 3. npx ts-node src/recipe-api/producer-http-zipkin.ts
 */
import express from 'express';
import got from 'got';
import {
  BatchRecorder,
  ExplicitContext,
  jsonEncoder,
  sampler,
  Tracer,
} from 'zipkin';
import { expressMiddleware } from 'zipkin-instrumentation-express';
import wrapGot from 'zipkin-instrumentation-gotjs';
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
wrapGot(got, { tracer, serviceName, remoteServiceName });

// Add the Zipkin middleware
app.use(expressMiddleware({ tracer }));

app.get('/', async (_req, res) => {
  const producer_data = await tracer.local('get_root', () => {
    return got(`http://${TARGET}/recipes/42`).json();
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
