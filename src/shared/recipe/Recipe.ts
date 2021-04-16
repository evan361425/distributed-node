// Original file: src/shared/grpc-recipe.proto

import type { Ingredient as _recipe_Ingredient, Ingredient__Output as _recipe_Ingredient__Output } from '../recipe/Ingredient';

export interface Recipe {
  'id'?: (number);
  'name'?: (string);
  'steps'?: (string);
  'ingredients'?: (_recipe_Ingredient)[];
}

export interface Recipe__Output {
  'id'?: (number);
  'name'?: (string);
  'steps'?: (string);
  'ingredients'?: (_recipe_Ingredient__Output)[];
}
