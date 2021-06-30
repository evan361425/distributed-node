import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { ProtoGrpcType } from '../shared/grpc-recipe';
import { RecipeServiceHandlers } from '../shared/recipe/RecipeService';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const packageDefinition = loadSync(__dirname + '/../shared/grpc-recipe.proto');
// type generate by: npm run task-build-grpc-type
const proto = loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const recipeHandlers: RecipeServiceHandlers = {
  GetMetaData: (_call, cb) => {
    cb(null, {
      pid: process.pid,
    });
  },
  GetRecipe: (call, cb) => {
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`));
    }
    cb(null, {
      id: 42,
      name: 'Chicken Tikka Masala',
      steps: 'Throw it in a pot...',
      ingredients: [
        { id: 1, name: 'Chicken', quantity: '1 lb' },
        { id: 2, name: 'Sauce', quantity: '2 cups' },
      ],
    });
  },
  GetRecipeFirstIngredient: (call, cb) => {
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`));
    }
    cb(null, { id: 1, name: 'Chicken', quantity: '1 lb' });
  },
};

const server = new Server();
server.addService(proto.recipe.RecipeService.service as never, recipeHandlers);

server.bindAsync(
  `${HOST}:${PORT}`,
  ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    server.start();
    console.log(`Producer running at http://${HOST}:${port}/`);
  },
);
