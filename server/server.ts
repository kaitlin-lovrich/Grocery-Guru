/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {
  type Recipe,
  ClientError,
  errorMiddleware,
  authMiddleware,
  Ingredient,
  GroceryList,
  GroceryItems,
  Login,
  User,
  UserGroceryList,
  ClickedRecipeRef,
  RecipeIngredient,
  SavedRecipeItems,
  SavedRecipesList,
} from './lib/index.js';
import { nextTick } from 'node:process';
import { log } from 'node:console';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Login>;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "Users" ("username", "hashedPassword")
      values ($1, $2)
      returning *
    `;
    const userRes = await db.query<UserGroceryList>(sql, [
      username,
      hashedPassword,
    ]);
    const [user] = userRes.rows;
    if (!user) throw new ClientError(401, 'Invalid user');
    const sql2 = `
      insert into "GroceryLists" ("userId")
        values ($1)
        returning *
    `;
    const groceryListRes = await db.query<GroceryList>(sql2, [user.userId]);
    const { groceryListId } = groceryListRes.rows[0];
    if (!groceryListId)
      throw new ClientError(404, `Invalid user ID: ${user.userId} `);
    const sql3 = `
      insert into "SavedRecipesLists" ("userId")
        values ($1)
        returning *
    `;
    const savedRecipesListRes = await db.query<SavedRecipesList>(sql3, [
      user.userId,
    ]);
    const { savedRecipesListId } = savedRecipesListRes.rows[0];
    console.log('savedRecipesListRes.rows[0]:', savedRecipesListRes.rows[0]);
    console.log('savedRecipesListId', !savedRecipesListId);
    if (!savedRecipesListId)
      throw new ClientError(404, `Invalid ID: ${savedRecipesListId} `);
    userRes.rows[0].groceryListId = groceryListId;
    userRes.rows[0].savedRecipesListId = savedRecipesListId;
    res.json(userRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Login>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "hashedPassword"
      from "Users"
      where "username" = $1
    `;
    const userRes = await db.query<UserGroceryList>(sql, [username]);
    const [user] = userRes.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const sql2 = `
      select * from "GroceryLists"
        where "userId" = $1
    `;
    const groceryListRes = await db.query<GroceryList>(sql2, [userId]);
    if (!groceryListRes.rows[0])
      throw new ClientError(404, `User ID not found: ${userId}`);
    const groceryListId = groceryListRes.rows[0].groceryListId;
    const sql3 = `
      select * from "SavedRecipesLists"
        where "userId" = $1
    `;
    const savedRecipesListRes = await db.query<SavedRecipesList>(sql3, [
      userId,
    ]);
    const savedRecipesListId = savedRecipesListRes.rows[0].savedRecipesListId;
    const payload = { userId, username, groceryListId, savedRecipesListId };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.get('/api/browse-recipes', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "Recipes"
    `;
    const recipesRes = await db.query<Recipe>(sql);
    if (!recipesRes.rows) throw new ClientError(401, 'Invalid recipe request');
    res.json(recipesRes.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/recipes/:recipeId', async (req, res, next) => {
  try {
    const recipeId = Number(req.params.recipeId);
    if (!recipeId)
      throw new ClientError(400, 'productId must be a positive integer');
    const sql = `
      select *
        from "Recipes"
        where "recipeId" = $1
    `;
    const recipeRes = await db.query<Recipe>(sql, [recipeId]);
    if (!recipeRes.rows[0])
      throw new ClientError(
        404,
        `cannot find recipe with recipeId ${recipeId}`
      );
    const sql2 = `
      select *
        from "Ingredients"
        join "RecipeIngredients" using ("ingredientId")
        where "recipeId" = $1
    `;
    const ingredientRes = await db.query<RecipeIngredient>(sql2, [recipeId]);
    if (!ingredientRes.rows)
      throw new ClientError(
        404,
        `cannot find ingredients with recipeId ${recipeId}`
      );
    recipeRes.rows[0].ingredients = ingredientRes.rows;
    res.json(recipeRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/grocery-list/:groceryListId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const groceryListId = Number(req.params.groceryListId);
      const sql = `
        select *
          from "GroceryLists"
          where "groceryListId" = $1 and "userId" = $2
      `;
      const groceryListRes = await db.query<GroceryList>(sql, [
        groceryListId,
        req.user?.userId,
      ]);
      if (!groceryListRes.rows[0])
        throw new ClientError(
          404,
          `Invalid Grocery list ID: ${groceryListId} or userd ID: ${req.user?.userId}`
        );
      const sql2 = `
        select *
          from "Ingredients"
          join "GroceryItems" using ("ingredientId")
          where "groceryListId" = $1
      `;
      const groceryItemsRes = await db.query<GroceryItems>(sql2, [
        groceryListId,
      ]);
      groceryListRes.rows[0].groceryItems = groceryItemsRes.rows;
      res.json(groceryListRes.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/grocery-list', authMiddleware, async (req, res, next) => {
  try {
    const { recipeId, groceryListId, ingredientId, quantity } = req.body;
    if (
      !groceryListId ||
      Number.isNaN(ingredientId) ||
      Number.isNaN(quantity)
    ) {
      throw new ClientError(400, `Invalid property`);
    }
    const sql2 = `
        insert into "GroceryItems" ("recipeId", "groceryListId", "ingredientId", "quantity")
          values ($1, $2, $3, $4)
          returning*;
      `;
    const groceryItemsRes = await db.query<GroceryItems>(sql2, [
      recipeId,
      groceryListId,
      ingredientId,
      quantity,
    ]);
    res.json(groceryItemsRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/add-ingredient', authMiddleware, async (req, res, next) => {
  try {
    const { name, measurement, packageType } = req.body;
    const sql = `
      insert into "Ingredients" ("name", "measurement", "packageType")
        values ($1, $2, $3)
        returning *;
    `;
    const addIngredientRes = await db.query<Ingredient>(sql, [
      name,
      measurement,
      packageType,
    ]);
    res.json(addIngredientRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/clicked-recipe-refs', authMiddleware, async (req, res, next) => {
  try {
    const { recipeIngredientsId } = req.body;
    const sql = `
      select *
        from "Recipes"
        join "RecipeIngredients" using ("recipeId")
        where "recipeIngredientsId" = $1
      `;
    const clickedRecipesRes = await db.query<ClickedRecipeRef>(sql, [
      recipeIngredientsId,
    ]);
    res.json(clickedRecipesRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/clicked-recipe-refs/:groceryListId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { groceryListId } = req.params;
      const sql = `
        select distinct "recipeId", "title", "recipeImage"
          from "Recipes"
          join "RecipeIngredients" using ("recipeId")
          join "GroceryItems" using ("recipeId")
          where "groceryListId" = $1
      `;
      const clickedRecipesRes = await db.query<ClickedRecipeRef>(sql, [
        groceryListId,
      ]);
      res.json(clickedRecipesRes.rows);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/remove-grocery-items',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { ingredientIds, groceryListId } = req.body;
      for (let i = 0; i < ingredientIds.length; i++) {
        const sql = `
          delete
            from "GroceryItems"
            where "ingredientId" = $1 and "groceryListId" = $2
            returning *;
        `;
        await db.query<Ingredient>(sql, [ingredientIds[i], groceryListId]);
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/remove-by-recipeId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { recipeId, groceryListId } = req.body;
      const sql = `
        delete
          from "GroceryItems"
          where "recipeId" = $1 and "groceryListId" = $2
      `;
      await db.query<Ingredient>(sql, [recipeId, groceryListId]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/remove-by-recipeIngredientsId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { recipeId, ingredientId, groceryListId } = req.body;
      const sql = `
        delete
          from "GroceryItems"
          where "recipeId" = $1 and "ingredientId" = $2 and "groceryListId" = $3
      `;
      await db.query<Ingredient>(sql, [recipeId, ingredientId, groceryListId]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/saved-recipes/:savedRecipesListId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const savedRecipesListId = Number(req.params.savedRecipesListId);
      const sql1 = `
        select *
          from "SavedRecipesLists"
          where "savedRecipesListId" = $1 and "userId" = $2
      `;
      const savedRecipesListRes = await db.query<SavedRecipesList>(sql1, [
        savedRecipesListId,
        req.user?.userId,
      ]);
      if (!savedRecipesListRes.rows[0])
        throw new ClientError(
          404,
          `Invalid SavedRecipesLists ID: ${savedRecipesListId} or user ID: ${req.user?.userId}`
        );
      const sql2 = `
        select *
          from "Recipes"
          join "SavedRecipeItems" using ("recipeId")
          where "savedRecipesListId" = $1
      `;
      const savedRecipeItemsRes = await db.query<SavedRecipeItems>(sql2, [
        savedRecipesListId,
      ]);
      savedRecipesListRes.rows[0].savedRecipeItems = savedRecipeItemsRes.rows;
      res.json(savedRecipesListRes.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/saved-recipes', authMiddleware, async (req, res, next) => {
  try {
    const { recipeId, savedRecipesListId } = req.body;
    if (!savedRecipesListId) {
      throw new ClientError(400, `Invalid property`);
    }
    const sql2 = `
        insert into "SavedRecipeItems" ("recipeId", "savedRecipesListId")
          values ($1, $2)
          returning *
      `;
    const savedRecipeItemsRes = await db.query<SavedRecipeItems>(sql2, [
      recipeId,
      savedRecipesListId,
    ]);
    res.json(savedRecipeItemsRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete(
  '/api/remove-saved-recipe',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { recipeId, savedRecipesListId } = req.body;
      const sql = `
        delete
          from "SavedRecipeItems"
          where "recipeId" = $1 and "savedRecipesListId" = $2
      `;
      await db.query<Ingredient>(sql, [recipeId, savedRecipesListId]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Vite server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
