/**
 * Useful on multiple task
 * 1. proxy - HA proxy - compression, tls
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

app.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
