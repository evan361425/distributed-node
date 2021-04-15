import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT ?? '4000', 10);

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(),
    graphiql: true, // build playground in browser for debug
  }),
);

app.listen(PORT, HOST, () =>
  console.log(`Producer running at http://${HOST}:${PORT}/graphql`),
);

function buildSchema(): GraphQLSchema {
  const resolvers = {
    RecipeRoot: {
      pid: () => process.pid,
      recipe: async (
        _source: unknown, // parent values
        { id }: { [key: string]: string },
      ): Promise<Partial<Recipe>> => {
        if (!id || id !== '42') throw new Error(`recipe ${id} not found`);

        return {
          id,
          name: 'Chicken Tikka Masala',
          steps: 'Throw it in a pot...',
        };
      },
    },
    Recipe: {
      ingredients: async (source: Recipe): Promise<Ingredient[]> => {
        return source.id !== '42'
          ? []
          : [
              { id: '1', name: 'Chicken', quantity: '1 lb' },
              { id: '2', name: 'Sauce', quantity: '2 cups' },
            ];
      },
    },
  };

  const ingredientQuery = new GraphQLObjectType({
    name: 'Ingredient',
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      quantity: { type: GraphQLString },
    },
  });

  const recipeQuery = new GraphQLObjectType({
    name: 'Recipe',
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      steps: { type: GraphQLString },
      ingredients: {
        type: new GraphQLList(ingredientQuery),
        resolve: resolvers.Recipe.ingredients,
      },
    },
  });

  const rootQuery = new GraphQLObjectType({
    name: 'RecipeRoot',
    fields: {
      pid: {
        type: GraphQLInt,
        resolve: resolvers.RecipeRoot.pid,
      },
      recipe: {
        type: recipeQuery,
        args: { id: { type: GraphQLID } },
        resolve: resolvers.RecipeRoot.recipe,
      },
    },
  });

  return new GraphQLSchema({
    query: rootQuery,
  });

  type Recipe = {
    id: string;
    name: string;
    steps: string;
    ingredients: Ingredient[];
  };

  type Ingredient = {
    id: string;
    name: string;
    quantity: string;
  };
}
