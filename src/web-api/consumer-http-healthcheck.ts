/**
 * Provision:
 * 1. Start up consumers -
 *   1. PORT=3001 npx ts-node src/web-api/consumer-http-healthcheck.ts
 *   2. PORT=3002 npx ts-node src/web-api/consumer-http-healthcheck.ts
 * 2. Start up provider - npx ts-node src/recipe-api/producer-cluster-fork.ts
 * 3. Start up HA Proxy - haproxy -f haproxy/load-balance.cfg
 *
 * Testing:
 * 1. Visit http://localhost:3000/admin?stats as HA Proxy stats page
 * 2. Visit http://localhost:3000 multiple times to see different consumer_pid
 * 3. Ctrl+C on one consumer
 * 4. Refresh HA Proxy stats page
 * 5. Rebuild the consumer you terminated
 * 6. Refresh HA Proxy stats page
 */
import express from 'express';
import got from 'got';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const TARGET = process.env.TARGET || 'localhost:4000';

const app = express();
app.get('/', async (_req, res) => {
  const producer_data = await got(`http://${TARGET}/recipes/42`).json();

  res.json({
    consumer_pid: process.pid,
    producer_data,
  });
});
app.get('/health', (_req, res) => {
  console.log('health check');
  return res.send('OK');
});

app.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
