/**
 * Distributed Request Tracing with Zipkin
 * ---
 * 1. docker run -p 9411:9411 -it --name zipkin openzipkin/zipkin-slim
 * 2. npx ts-node src/web-api/consumer-http-zipkin.ts
 * 3. npx ts-node src/recipe-api/producer-http-zipkin.ts
 */
import express from 'express';
import {
  BatchRecorder,
  ExplicitContext,
  jsonEncoder,
  sampler,
  Tracer,
} from 'zipkin';
import { expressMiddleware } from 'zipkin-instrumentation-express';
import { HttpLogger } from 'zipkin-transport-http';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT || '4000');
const ZIPKIN = process.env.ZIPKIN || 'http://localhost:9411/api/v2/spans';

const app = express();
const tracer = createTracer();

// Add the Zipkin middleware
app.use(expressMiddleware({ tracer }));

app.get('/recipes/:id', async (req, res) => {
  const id = Number(req.params.id);
  await tracer.local<Promise<void>>(
    'fetch_db',
    () => new Promise((resolve) => setTimeout(resolve, 20)),
  );

  if (id !== 42) {
    res.status(404).send({ error: 'not_found' });
  }
  res.send({
    producer_pid: process.pid,
    recipe: {
      id,
      name: 'Chicken Tikka Masala',
      steps: 'Throw it in a pot...',
      ingredients: [
        { id: 1, name: 'Chicken', quantity: '1 lb' },
        { id: 2, name: 'Sauce', quantity: '2 cups' },
      ],
    },
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Producer running at http://${HOST}:${PORT}`);
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
    localServiceName: 'recipe-api',
    sampler: new sampler.CountingSampler(1),
  });
}
