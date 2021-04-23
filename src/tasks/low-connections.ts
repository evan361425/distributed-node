import express from 'express';

const app = express();
app.use((req, res) => {
  server.getConnections((err, count) =>
    console.log('current connection', count),
  );
  setTimeout(() => res.send('ok'), 10_000);
});

const server = app.listen(3001, 'localhost');
server.maxConnections = 2;
