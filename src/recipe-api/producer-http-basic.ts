/**
 * Useful on multiple task
 * 1. proxy - cluster module
 * 2. proxy - HA proxy
 */
import express from 'express';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT || '4000');

console.log(`worker pid=${process.pid}`);

const app = express();
app.get('/recipes/:id', async (req, res) => {
  console.log(`worker request pid=${process.pid}`);
  const id = Number(req.params.id);
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
