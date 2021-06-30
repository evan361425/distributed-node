import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import express from 'express';
import { promisify } from 'util';
import { ProtoGrpcType } from '../shared/grpc-recipe';

const HOST = '127.0.0.1';
const PORT = parseInt(process.env.PORT || '3000', 10);
const TARGET = process.env.TARGET || 'localhost:4000';
const packageDefinition = loadSync(__dirname + '/../shared/grpc-recipe.proto');
const proto = loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const client = new proto.recipe.RecipeService(
  TARGET,
  credentials.createInsecure(),
);
const getMetaData = promisify(client.getMetaData.bind(client));
const getRecipe = promisify(client.getRecipe.bind(client));
const getRecipeFirstIngredient = promisify(
  client.getRecipeFirstIngredient.bind(client),
);

const app = express();
app.get('/', async (_req, res) => {
  try {
    const [meta, recipe, firstIngredient] = await Promise.all([
      getMetaData({}),
      getRecipe({ id: 42 }),
      getRecipeFirstIngredient({ id: 42 }),
    ]);
    res.json({
      consumer_pid: process.pid,
      producer_data: meta,
      recipe,
      firstIngredient,
    });
  } catch (error) {
    return res.send('error');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
