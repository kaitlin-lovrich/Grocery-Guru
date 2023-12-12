set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "Users" (
  "userId" serial PRIMARY KEY,
  "userAvatar" text,
  "username" text,
  "hashedPassword" text,
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
  "quantity" integer
);

CREATE TABLE "GroceryItems" (
  "groceryItemsId" serial PRIMARY KEY,
  "groceryListId" integer,
  "ingredientId" integer,
  "recipeId" integer,
  "quantity" integer
);

CREATE TABLE "SavedRecipesLists" (
  "savedRecipesListId" serial PRIMARY KEY,
  "userId" integer
);

CREATE TABLE "SavedRecipeItems" (
  "savedRecipeItems" serial PRIMARY KEY,
  "savedRecipesListId" integer,
  "recipeId" integer
);

COMMENT ON COLUMN "Recipes"."description" IS 'Recipe description';

ALTER TABLE "Recipes" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "GroceryLists" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "RecipeIngredients" ADD FOREIGN KEY ("recipeId") REFERENCES "Recipes" ("recipeId");

ALTER TABLE "RecipeIngredients" ADD FOREIGN KEY ("ingredientId") REFERENCES "Ingredients" ("ingredientId");

ALTER TABLE "GroceryItems" ADD FOREIGN KEY ("groceryListId") REFERENCES "GroceryLists" ("groceryListId");

ALTER TABLE "GroceryItems" ADD FOREIGN KEY ("ingredientId") REFERENCES "Ingredients" ("ingredientId");

ALTER TABLE "GroceryItems" ADD FOREIGN KEY ("recipeId") REFERENCES "Recipes" ("recipeId");

ALTER TABLE "SavedRecipesLists" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "SavedRecipeItems" ADD FOREIGN KEY ("savedRecipesListId") REFERENCES "SavedRecipesLists" ("savedRecipesListId");

ALTER TABLE "SavedRecipeItems" ADD FOREIGN KEY ("recipeId") REFERENCES "Recipes" ("recipeId");
