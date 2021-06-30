// Original file: src/shared/grpc-recipe.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _recipe_Empty, Empty__Output as _recipe_Empty__Output } from '../recipe/Empty';
import type { Ingredient as _recipe_Ingredient, Ingredient__Output as _recipe_Ingredient__Output } from '../recipe/Ingredient';
import type { Meta as _recipe_Meta, Meta__Output as _recipe_Meta__Output } from '../recipe/Meta';
import type { Recipe as _recipe_Recipe, Recipe__Output as _recipe_Recipe__Output } from '../recipe/Recipe';
import type { RecipeRequest as _recipe_RecipeRequest, RecipeRequest__Output as _recipe_RecipeRequest__Output } from '../recipe/RecipeRequest';

export interface RecipeServiceClient extends grpc.Client {
  GetMetaData(argument: _recipe_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  GetMetaData(argument: _recipe_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  GetMetaData(argument: _recipe_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  GetMetaData(argument: _recipe_Empty, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  getMetaData(argument: _recipe_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  getMetaData(argument: _recipe_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  getMetaData(argument: _recipe_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  getMetaData(argument: _recipe_Empty, callback: (error?: grpc.ServiceError, result?: _recipe_Meta__Output) => void): grpc.ClientUnaryCall;
  
  GetRecipe(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  GetRecipe(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  GetRecipe(argument: _recipe_RecipeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  GetRecipe(argument: _recipe_RecipeRequest, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  getRecipe(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  getRecipe(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  getRecipe(argument: _recipe_RecipeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  getRecipe(argument: _recipe_RecipeRequest, callback: (error?: grpc.ServiceError, result?: _recipe_Recipe__Output) => void): grpc.ClientUnaryCall;
  
  GetRecipeFirstIngredient(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  GetRecipeFirstIngredient(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  GetRecipeFirstIngredient(argument: _recipe_RecipeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  GetRecipeFirstIngredient(argument: _recipe_RecipeRequest, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  getRecipeFirstIngredient(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  getRecipeFirstIngredient(argument: _recipe_RecipeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  getRecipeFirstIngredient(argument: _recipe_RecipeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  getRecipeFirstIngredient(argument: _recipe_RecipeRequest, callback: (error?: grpc.ServiceError, result?: _recipe_Ingredient__Output) => void): grpc.ClientUnaryCall;
  
}

export interface RecipeServiceHandlers extends grpc.UntypedServiceImplementation {
  GetMetaData: grpc.handleUnaryCall<_recipe_Empty__Output, _recipe_Meta>;
  
  GetRecipe: grpc.handleUnaryCall<_recipe_RecipeRequest__Output, _recipe_Recipe>;
  
  GetRecipeFirstIngredient: grpc.handleUnaryCall<_recipe_RecipeRequest__Output, _recipe_Ingredient>;
  
}

export interface RecipeServiceDefinition {
  GetMetaData: MethodDefinition<_recipe_Empty, _recipe_Meta, _recipe_Empty__Output, _recipe_Meta__Output>
  GetRecipe: MethodDefinition<_recipe_RecipeRequest, _recipe_Recipe, _recipe_RecipeRequest__Output, _recipe_Recipe__Output>
  GetRecipeFirstIngredient: MethodDefinition<_recipe_RecipeRequest, _recipe_Ingredient, _recipe_RecipeRequest__Output, _recipe_Ingredient__Output>
}
