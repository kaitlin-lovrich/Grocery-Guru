set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "Users" (
  "userId" serial PRIMARY KEY,
  "userAvatar" text,
  "username" text,
  "password" text,
  "createdAt" timestamptz
);

CREATE TABLE "Recipes" (
  "recipeId" serial PRIMARY KEY,
  "userId" integer,
  "title" text,
  "description" text,
  "recipeImage" text,
  "instructions" text,
  "createdAt" timestamptz
);

CREATE TABLE "GroceryLists" (
  "groceryListId" serial PRIMARY KEY,
  "userId" integer
);

CREATE TABLE "Ingredients" (
  "ingredientId" serial PRIMARY KEY,
  "name" text,
  "measurement" text,
  "packageType" text
);

CREATE TABLE "RecipeIngredients" (
  "recipeIngredientsId" serial PRIMARY KEY,
  "recipeId" integer,
  "ingredientId" integer,
  "quantity" text
);

CREATE TABLE "GroceryItems" (
  "groceryItemsId" serial PRIMARY KEY,
  "groceryListId" integer,
  "ingredientId" integer,
  "quantity" text
);

COMMENT ON COLUMN "Recipes"."description" IS 'Recipe description';

ALTER TABLE "Recipes" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "GroceryLists" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "RecipeIngredients" ADD FOREIGN KEY ("recipeId") REFERENCES "Recipes" ("recipeId");

ALTER TABLE "RecipeIngredients" ADD FOREIGN KEY ("ingredientId") REFERENCES "Ingredients" ("ingredientId");

ALTER TABLE "GroceryItems" ADD FOREIGN KEY ("groceryListId") REFERENCES "GroceryLists" ("groceryListId");

ALTER TABLE "GroceryItems" ADD FOREIGN KEY ("ingredientId") REFERENCES "Ingredients" ("ingredientId");
