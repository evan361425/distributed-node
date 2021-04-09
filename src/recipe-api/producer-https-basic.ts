/**
 * First generate certificate:
 * openssl req -nodes -new -x509 \
 *   -keyout recipe-api/tls/basic-private-key.key \
 *   -out shared/tls/basic-certificate.cert
 */

import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 4000;
const CERT_KEY = readFileSync(__dirname + '/tls/basic-private-key.key');
const CERT = readFileSync(__dirname + '/../shared/tls/basic-certificate.cert');

const app = express();
app.get('/recipes/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (id !== 42) return res.status(404).send('not_found');

  res.json({
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

const server = createServer({ key: CERT_KEY, cert: CERT }, app);
server.listen(PORT, HOST, () =>
  console.log(`Producer running at https://${HOST}:${PORT}`),
);
