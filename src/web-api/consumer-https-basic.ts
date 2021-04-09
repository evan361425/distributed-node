/**
 * First generate certificate:
 * openssl req -nodes -new -x509 \
 *   -keyout recipe-api/tls/basic-private-key.key \
 *   -out shared/tls/basic-certificate.cert
 */

import express from 'express';
import { readFileSync } from 'fs';
import got from 'got';
import { Agent, createServer } from 'https';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';
const agent = new Agent({
  ca: readFileSync(__dirname + '/../shared/tls/basic-certificate.cert'),
});

const app = express();
app.get('/', async () => {
  const payload = await got<string>(`https://${TARGET}/recipes/42`, {
    agent: { https: agent },
  }).json();

  return {
    consumer_pid: process.pid,
    producer_data: payload,
  };
});

const server = createServer(app);
server.listen(PORT, HOST, () =>
  console.log(`Consumer running at https://${HOST}:${PORT}`),
);
