import express from 'express';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT || '4000', 10);

console.log(`worker pid=${process.pid}`);

const app = express();
app.get('sync/:limit', (req, res) => {
  res.send(fibonacciSync(Number(req.params.limit)));
});
app.get('async/:limit', async (req, res) => {
  res.send(await fibonacciAsync(Number(req.params.limit)));
});

app.listen(PORT, HOST, () => {
  console.log(`Producer running at http://${HOST}:${PORT}`);
});

async function fibonacciAsync(limit: number): Promise<string> {
  let prev = 1n,
    next = 0n,
    swap: bigint;

  while (limit--) {
    await fibonacci();
  }

  return prev.toString();

  async function fibonacci(): Promise<void> {
    swap = prev;
    prev = prev + next;
    next = swap;
  }
}

function fibonacciSync(limit: number): string {
  let prev = 1n,
    next = 0n,
    swap: bigint;

  while (limit--) {
    swap = prev;
    prev = prev + next;
    next = swap;
  }

  return next.toString();
}
