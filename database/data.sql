-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "Recipes" ("recipeId", "title", "description", "recipeImage", "instructions")
  values
    (
      '1',
      'PBJ Sandwich',
      'A delicious peanut butter & jelly sandwich spread jelly on top of peanut butter and assemble sandwich spread jelly on top of peanut butter and assemble sandwich.',
      '/images/grilled-peanut-butter-jelly-sandwich.jpg',
      '
      1. Toast 2 slices of bread.\n
      2. Spread peanut butter on each slice.\n
      3. Spread jelly on top of peanut butter and assemble sandwich.\n
      '
    ),
    (
      '2',
      'Peanut Butter Sandwich',
      'A delicious peanut butter sandwich a delicious peanut butter sandwich a delicious peanut butter sandwich a delicious peanut butter sandwich.',
      '/images/peanut-butter-sandwich',
      '
      1. Toast 2 slices of bread.\n
      2. Spread peanut butter on each slice.\n
      3. Assemble sandwich.\n
      '
    ),
    (
      '3',
      'Tangy Turkey Sandwich',
      'A delicious and tangy turkey sandwich a delicious and tangy turkey sandwich a delicious and tangy turkey sandwich a delicious and tangy turkey sandwich a delicious and tangy turkey sandwich.',
      '/images/tangy-turkey-sandwich',
      '
      1. Toast 2 slices of bread.\n
      2. Spread mayo and mustard of choice on each slice.\n
      3. Add arugula on one slice.\n
      4. Place a slice of provolone cheese ontop of the arugula.\n
      5. Place about 5 pepperochini rings ontop of the cheese.\n
      6. Place 4 slices of deli sliced turkey breast ontop of peppers.\n
      7. Place another slice of cheese ontop of the turkey.\n
      8. Sprinkle remaining bread with fresh cracked black pepper, oregano and himalayan pink salt.\n
      3. Assemble sandwich.\n
      '
    ),
    (
      '4',
      'Eggplant Parmesean',
      'Eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends.',
      '/images/eggplant-parmesan',
      '
      1. Slice eggplant into 1/4 inch slices.\n
      2. Heavily salt each slice and place on a cloth so draw water out of the eggplant. Let sit 30 mins.\n
      3. In a bowl, combine flour and seaonings.\n
      '
    );

insert into "Ingredients" ("ingredientId", "name", "measurement", "packageType")
  values
    -- seasonings
    ('1', 'black pepper', 'ounce', 'seasoning'),
    ('2', 'himalyan salt', 'ounce', 'seasoning'),
    ('3', 'dried oregano', 'ounce', 'seasoning'),
    -- condiments
    ('4', 'peanut butter', 'ounce', 'jar'),
    ('5', 'jelly', 'ounce', 'jar'),
    ('6', 'mayo', 'ounce', 'jar'),
    ('7', 'mustard', 'ounce', 'bottle'),
    -- deli
    ('8', 'provolone cheese', 'slice', 'package'),
    ('9', 'bread', 'slice', 'loaf'),
    ('10', 'turkey', 'slice', 'package'),
    -- canned goods
    ('11', 'pepperoncini peppers', '', 'jar'),
    ('12', 'marinara', 'ounce', 'jar'),
    -- dried goods
    ('13', 'flour', 'ounce', 'package'),
    ('14', 'bread crumbs', 'ounce', 'package'),
    -- produce
    ('15', 'eggplant', '', ''),
    ('16', 'arugula', 'ounce', 'package');

insert into "RecipeIngredients" ("recipeId", "ingredientId", "quantity")
  values
    -- PBJ Sandwich
    ('1', '9', '2'), -- bread
    ('1', '4', '1'), -- peanut butter
    ('1', '5', '1'), -- jelly
    -- Peanut Butter Sandwich
    ('2', '9', '2'), -- bread
    ('2', '4', '1'), -- peanut butter
    -- Tangy Turkey Sandwich
    ('3', '9', '2'), -- bread
    ('3', '6', '1'), -- mayo
    ('3', '7', '1'), -- mustard
    ('3', '8', '2'), -- provolone cheese
    ('3', '10', '4'), -- turkey
    ('3', '1', '1'), -- black pepper
    ('3', '2', '1'), -- himalayan salt
    ('3', '3', '1'), -- dried oregano
    ('3', '11', '5'), -- pepperoncini peppers
    ('3', '16', '1'), -- arugula
    -- Eggplant Parmesean
    ('4', '15', '1'), -- eggplant
    ('4', '2', '1'), -- himalyan salt
    ('4', '13', '5'); -- flour

-- For Ingredients table:
-- packageTypes: 'seasoning', 'jar', 'bottle', 'package', 'loaf', 'null'
-- measurment: 'ounce', 'slice', ''
-- if (RecipeIngredients.ingredientId.measurent === 'ounce') {if }
-- Make measurments all oz for now to make it easier and then do conversions later
-- Add a "category" column later

-- Run this code into the terminal to grab a specific table:
-- psql -d GroceryGuru -c "\\d \"Recipes\""
