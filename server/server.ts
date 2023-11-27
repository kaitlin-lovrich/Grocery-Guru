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
} from './lib/index.js';
import { nextTick } from 'node:process';

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
    const sql2 = `
      insert into "GroceryLists" ("userId")
        values ($1)
        returning *
    `;
    const groceryListRes = await db.query<GroceryList>(sql2, [user.userId]);
    const { groceryListId } = groceryListRes.rows[0];
    // const userGroceryList = [...[user, ...[groceryListId]]];
    userRes.rows[0].groceryListId = groceryListId;
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
    const userRes = await db.query<User>(sql, [username]);
    const [user] = userRes.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
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
    const ingredientRes = await db.query<Ingredient>(sql2, [recipeId]);
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

      const sql2 = `
      select *
        from "Ingredients"
        join "GroceryItems" using ("ingredientId")
        where "groceryListId" = $1
    `;
      console.log('groceryListId', groceryListId);
      console.log('userId', req.user?.userId);
      const groceryItemsRes = await db.query<GroceryItems>(sql2, [
        groceryListId,
      ]);
      console.log('groceryItemRes.rows', groceryItemsRes.rows);
      console.log('groceryListRes.rows', groceryListRes.rows);
      groceryListRes.rows[0].groceryItems = groceryItemsRes.rows;

      res.json(groceryListRes.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/grocery-list', authMiddleware, async (req, res, next) => {
  try {
    const { groceryListId, ingredientId, quantity } = req.body;
    if (
      !groceryListId ||
      Number.isNaN(ingredientId) ||
      Number.isNaN(quantity)
    ) {
      throw new ClientError(400, `Invalid property`);
    }
    const sql2 = `
        insert into "GroceryItems" ("groceryListId", "ingredientId", "quantity")
          values ($1, $2, $3)
          returning*;
      `;
    const groceryItemsRes = await db.query<GroceryItems>(sql2, [
      groceryListId,
      ingredientId,
      quantity,
    ]);
    console.log(groceryItemsRes.rows);
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
    console.log('addIngredientRes', addIngredientRes.rows[0]);
    res.json(addIngredientRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

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
