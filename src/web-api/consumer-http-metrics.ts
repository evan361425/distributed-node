/**
 * Observability - Metrics
 *
 * Bash:
 * 1. npx ts-node web-api/consumer-http-metrics.ts
 * 2. npx ts-node recipe-api/producer-http-basic.ts
 * 3. autocannon -d 300 -R 5 -c 1 http://localhost:3000
 * 4. watch -n1 curl http://localhost:3000/error
 *
 * Grafana:
 * 1. Incoming Status Codes : stats_counts,web-api,inbound,response_code : aliasByNode
 * 2. Outbound Service Timing : stats.timers.web-api.outbound.*.request-time.upper_90 : aliasByNode : Axes -> Left Y -> Unit -> Time -> ms
 * 3. Outbound Request Count : stats_counts.web-api.outbound.*.request-count
 */
import express from 'express';
import fs from 'fs';
import got from 'got';
import StatsDClient from 'statsd-client';
import v8 from 'v8';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const TARGET = process.env.TARGET || 'localhost:4000';

const client = new StatsDClient({
  host: 'localhost',
  port: 8125,
  prefix: 'web-api',
});

const app = express();
app.use(client.helpers.getExpressMiddleware('inbound', { timeByUrl: true }));
app.get('/', async (_req, res) => {
  const begin = new Date();
  const producer_data = await got(`http://${TARGET}/recipes/42`).json();
  client.timing('outbound.recipe-api.request-time', begin);
  client.increment('outbound.recipe-api.request-count');

  res.json({
    consumer_pid: process.pid,
    producer_data,
  });
});
app.get('/error', (_req, res) => {
  res.status(500).send('oh no');
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});

setInterval(() => {
  client.gauge('server.conn', server.connections);

  const m = process.memoryUsage();
  client.gauge('server.memory.used', m.heapUsed);
  client.gauge('server.memory.total', m.heapTotal);

  const h = v8.getHeapStatistics();
  client.gauge('server.heap.size', h.used_heap_size);
  client.gauge('server.heap.limit', h.heap_size_limit);

  // try to mock memory heap
  fs.readdir(__dirname, (err, list) => {
    if (err) return;
    client.gauge('server.descriptors', list.length);
  });

  const begin = new Date();
  setTimeout(() => {
    client.timing('event_lag', begin);
  }, 0);
}, 10_000);
