/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  type Recipe,
  ClientError,
  errorMiddleware,
  Ingredient,
} from './lib/index.js';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

app.get('/api/browse-recipes', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "Recipes"
    `;
    const response = await db.query<Recipe>(sql);
    res.json(response.rows);
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
    const response = await db.query<Recipe>(sql, [recipeId]);
    if (!response.rows[0])
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
    const response2 = await db.query<Ingredient>(sql2, [recipeId]);
    response.rows[0].ingredients = response2.rows;
    res.json(response.rows[0]);
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
