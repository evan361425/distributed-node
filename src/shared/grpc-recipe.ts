import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { RecipeServiceClient as _recipe_RecipeServiceClient, RecipeServiceDefinition as _recipe_RecipeServiceDefinition } from './recipe/RecipeService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  recipe: {
    Empty: MessageTypeDefinition
    Ingredient: MessageTypeDefinition
    Meta: MessageTypeDefinition
    Recipe: MessageTypeDefinition
    RecipeRequest: MessageTypeDefinition
    RecipeService: SubtypeConstructor<typeof grpc.Client, _recipe_RecipeServiceClient> & { service: _recipe_RecipeServiceDefinition }
  }
}

