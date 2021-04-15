import express from 'express';
import got from 'got';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';

const query = `query kitchenSink ($id:ID) {
  recipe(id: $id) {
    id name
    ingredients {
      name quantity
    }
  }
  pid
}`;
const variables = { id: '42' };

const app = express();
app.get('/', async (_req, res) => {
  try {
    const payload = await got(`http://${TARGET}/graphql`, {
      method: 'POST',
      json: { query, variables },
    }).json<Response>();

    res.send({
      consumer_pid: process.pid,
      producer_data: payload,
    });
  } catch (error) {
    res.send(error.stack);
  }
});

app.listen(PORT, HOST, () =>
  console.log(`Consumer running at http://${HOST}:${PORT}`),
);

type Response = {
  data: Partial<{
    pid: string;
    recipe: Recipe;
  }>;
};
type Recipe = Partial<{
  id: string;
  name: string;
  steps: string;
  ingredients: Ingredient[];
}>;

type Ingredient = Partial<{
  id: string;
  name: string;
  quantity: string;
}>;
