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
      'Toast 2 slices of bread.
      Spread peanut butter on each slice.
      Spread jelly on top of peanut butter and assemble sandwich.'
    ),
    (
      '2',
      'Peanut Butter Sandwich',
      'A delicious peanut butter sandwich a delicious peanut butter sandwich a delicious peanut butter sandwich a delicious peanut butter sandwich.',
      '/images/peanut-butter-sandwich.jpg',
      'Toast 2 slices of bread.
      Spread peanut butter on each slice.
      Assemble sandwich.'
    ),
    (
      '3',
      'Tangy Turkey Sandwich',
      'A delicious and tangy turkey sandwich a delicious and tangy turkey sandwich a delicious and tangy turkey sandwich a delicious and tangy turkey sandwich a delicious and tangy turkey sandwich.',
      '/images/tangy-turkey-sandwich.jpg',
      'Toast 2 slices of bread.
      Spread mayo and mustard of choice on each slice.
      Add arugula on one slice.
      Place a slice of provolone cheese ontop of the arugula.
      Place about 5 pepperochini rings ontop of the cheese.
      Place 4 slices of deli sliced turkey breast ontop of peppers.
      Place another slice of cheese ontop of the turkey.
      Sprinkle remaining bread with fresh cracked black pepper, oregano and himalayan pink salt.
      Assemble sandwich.'
    ),
    (
      '4',
      'Eggplant Parmesean',
      'Eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends eggplant parmesean to impress your vegetarian friends.',
      '/images/eggplant-parmesan.jpg',
      'Slice eggplant into 1/4 inch slices.
      Heavily salt each slice and place on a cloth so draw water out of the eggplant. Let sit 30 mins.
      In a bowl, combine flour and seaonings.'
    ),
    (
      '5',
      'One-Pot Mac' || E'n' || E'Beer-Cheese',
      'This mac and cheese recipe is cheesy, tangy, spicy and super creamy. The secret is cooking it all in one pot! Cooking your pasta in the sauce releases the starches from the pasta into your sauce to naturally thicken to make for a creamier sauce! This recipe uses gets its tang from the sriracha sauce but also makes for a spicy dish. Prepare at your own risk. You have been warned.',
      '/images/macaroni-and-cheese.jpg',
      'Melt butter in pot on medium-low heat. Once melted, mix in flour.
      Continue stirring for about 1 min until mix just starts to change color. Aim for light golden brown.
      Pour in beer and stir often for 2-3 minutes.
      Slowly stir in coconut milk. Small pours at a time at first, then dump the whole can in and stir.
      Add in water, seasonings, sauces and bring to boil.
      Stir in pasta and cook for 1 minute minus the directions on the box.
      Turn off heat, stir in cheese and parsley and enjoy!'
    );

insert into "Ingredients" ("ingredientId", "name", "measurement", "packageType")
  values -- next id: 36
    -- seasonings
    ('1', 'black pepper', 'ounce', 'seasoning'),
    ('2', 'himalyan salt', 'ounce', 'seasoning'),
    ('3', 'dried oregano', 'ounce', 'seasoning'),
    ('21', 'garlic powder', 'ounce', 'seasoning'),
    ('22', 'onion powder', 'ounce', 'seasoning'),
    ('23', 'paprika', 'ounce', 'seasoning'),
    ('24', 'cayenne powder', 'ounce', 'seasoning'),
    -- condiments
    ('4', 'peanut butter', 'ounce', 'jar'),
    ('5', 'jelly', 'ounce', 'jar'),
    ('6', 'mayo', 'ounce', 'jar'),
    ('7', 'dijon mustard', 'ounce', 'bottle'),
    ('30', 'worstershire sauce', 'ounce', 'bottle'),
    ('31', 'sriracha sauce', 'ounce', 'bottle'),
    -- deli
    ('9', 'bread', 'slice', 'loaf'),
    ('10', 'turkey', 'slice', 'package'),
    -- preserved goods
    ('11', 'pepperoncini peppers', '', 'jar'),
    ('12', 'marinara', 'ounce', 'jar'),
    ('32', 'coconut milk', 'ounce', 'can'),
    -- dried goods
    ('13', 'flour', 'ounce', 'package'),
    ('14', 'bread crumbs', 'ounce', 'package'),
    ('34', 'elbow macaroni', 'ounce', 'package'),
    -- produce
    ('15', 'eggplant', '', ''),
    ('16', 'arugula', 'ounce', 'package'),
    -- herbs
    ('20', 'parsley', 'ounce', ''),
    -- dairy products
    ('8', 'provolone cheese', 'slice', 'package'),
    ('36', 'butter', 'ounce', 'package'),
    ('17', 'Vermont white cheddar', 'ounce', 'package'),
    ('18', 'parmesean cheese', 'ounce', 'package'),
    ('19', 'gruyere cheese', 'ounce', 'package'),
    -- cooking oil
    ('25', 'olive oil', 'ounce', 'bottle'),
    ('26', 'peanut oil', 'ounce', 'bottle'),
    ('27', 'cold pressed coconut oil', 'ounce', 'jar'),
    ('28', 'canola oil', 'ounce', 'bottle'),
    -- other
    ('29', 'beer', '', 'can'),
    ('33', 'water', 'ounce', '');
alter sequence "Ingredients_ingredientId_seq" restart with 50;

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
    ('4', '13', '5'), -- flour
    -- One-Pot Mac'n'Beer-Cheese
    ('5', '36', '1'), -- butter
    ('5', '13', '1'), -- flour
    ('5', '29', '1'), -- beer
    ('5', '32', '1'), -- coconut milk
    ('5', '33', '1'), -- water
    ('5', '21', '1'), -- garlic powder
    ('5', '22', '1'), -- onion powder
    ('5', '23', '1'), -- paprika
    ('5', '24', '1'), -- cayenenne powder
    ('5', '1', '1'), -- black pepper
    ('5', '2', '1'), -- himalayan salt
    ('5', '30', '1'), -- worstershire sauce
    ('5', '7', '1'), -- dijon mustard
    ('5', '31', '1'), -- sriracha
    ('5', '34', '1'), -- Macaroni
    ('5', '17', '1'), -- Vermont white cheddar
    ('5', '18', '1'), -- parmesean cheese
    ('5', '19', '1'), -- gruyere cheese
    ('5', '20', '1'); -- parsley

insert into "Users" ("userId", "username", "hashedPassword")
  values ('1', 'Kait', '$argon2id$v=19$m=4096,t=3,p=1$OSCiWex0sLLwUW8pcbc8Sw$+z+IqIeVc6TYttEyhKUMu+MOZv/1AsWwFDTTz3zLaSI');
insert into "GroceryLists" ("groceryListId", "userId")
  values ('1', '1');
insert into "GroceryItems" ("groceryListId", "ingredientId", "quantity")
  values
    ('1', '1', '5'),
    ('1', '2', '4'),
    ('1', '3', '3');
-- For Ingredients table:
-- packageTypes: 'seasoning', 'jar', 'bottle', 'package', 'loaf', 'can', 'null'
-- measurment: 'ounce', 'slice', ''
-- if (RecipeIngredients.ingredientId.measurent === 'ounce') {if }
-- Make measurments all oz for now to make it easier and then do conversions later
-- Add a "category" column later

-- Run this code into the terminal to grab a specific table:
-- psql -d GroceryGuru -c "\\d \"Recipes\""
