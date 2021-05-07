/**
 * Useful on multiple task
 * 1. Observability - ELK
 */
import dgram from 'dgram';
import express, { NextFunction, Request, Response } from 'express';
import got from 'got';
import pino from 'pino';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const TARGET = process.env.TARGET || 'localhost:4000';
const LOGSTASH = (process.env.LOGSTASH || 'localhost:9200').split(':');
const LS_PORT = Number(LOGSTASH[1]);
const LS_HOST = LOGSTASH[0];

const client = dgram.createSocket('udp4');
const stream = {
  write: (msg: string) => {
    client.send(msg, LS_PORT, LS_HOST);
  },
};
const logger = pino({ level: 'trace' }, stream);

const app = express();
app.use((req, _res, next) => {
  logger.info(
    {
      path: req.url,
      method: req.method,
      ip: req.ip,
      ua: req.headers['user-agent'] || null,
    },
    'request-incoming',
  );
  next();
});
app.get('/', async (_req, res) => {
  const url = `http://${TARGET}/recipes/42`;
  logger.info({ url, svc: 'recipe-api' }, 'request-outgoing');

  const producer_data = await got(url).json();
  res.json({
    consumer_pid: process.pid,
    producer_data,
  });
});
app.get('/error', () => {
  throw new Error('oh no');
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(
    { stack: err.stack, path: req.url, method: req.method },
    'request-failure',
  );
  res.status(400).send(err.message);
});

app.listen(PORT, HOST, () => {
  logger.debug({ host: HOST, port: PORT }, 'listen');
});
