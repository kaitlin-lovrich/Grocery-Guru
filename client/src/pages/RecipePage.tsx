import './RecipePage.css';
import { GroceryList, Ingredient, type Recipe } from '../lib/dataTypes.js';
import {
  fetchAddToGroceryList,
  fetchGroceryList,
  fetchRecipePage,
} from '../lib/api.js';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../components/AppContext.js';
// import { Link } from 'react-router-dom';

type RecipePageProps = {
  groceryListId: number | undefined;
};

export default function RecipePage({ groceryListId }: RecipePageProps) {
  const { recipeId: recipeIdStr } = useParams();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [groceryList, setGroceryList] = useState<GroceryList>();
  const { user } = useContext(AppContext);
  const recipeId = Number(recipeIdStr);

  useEffect(() => {
    async function loadRecipePage(recipeId: number) {
      if (!user) return;
      const recipe = await fetchRecipePage(recipeId);
      setSelectedRecipe(recipe);
      const groceryList = await fetchGroceryList(user.groceryListId);
      setGroceryList(groceryList);
    }
    loadRecipePage(Number(recipeId));
  }, [recipeId, user]);

  if (!selectedRecipe) return null;
  const { title, description, recipeImage, ingredients, instructions } =
    selectedRecipe;

  function handleCheck(ingredient: Ingredient) {
    // if (!groceyListId) {
    //   navigate('../../auth/login', {
    // relative: 'path',
    // replace: true,
    // });
    // } else {}
    fetchAddToGroceryList({ groceryListId, ...ingredient, recipeId });
  }

  const ingredientList = ingredients.map((ingredient) => {
    const isInGroceryItems = groceryList?.groceryItems.find((groceryItem) => {
      return (
        groceryItem.ingredientId === ingredient.ingredientId &&
        groceryItem.recipeId === recipeId
      );
    });
    console.log(
      'ingredient',
      ingredient,
      'isinGroceryItems',
      !!isInGroceryItems
    );
    return (
      <>
        <li key={ingredient.ingredientId}>
          <div>
            <label>
              <input
                type="checkbox"
                defaultChecked={!!isInGroceryItems}
                onClick={() => handleCheck(ingredient)}
              />
              {`${ingredient.quantity} ${ingredient.name}`}
            </label>
          </div>
        </li>
      </>
    );
  });

  const instructionsArray = instructions.split('\n');
  const instructionsList = instructionsArray.map((item) => {
    return <li key={item}>{item}</li>;
  });

  return (
    <div className="page">
      <div className="content-container">
        <h1 className="page-title">{title}</h1>
        <p>{description}</p>
        <div className="recipe-image">
          <img src={recipeImage} />
        </div>
        <h2 className="recipe-h2">Ingredients</h2>
        <ul>{ingredientList}</ul>
        <h2 className="recipe-h2">Instructions</h2>
        <ol className="instructions">{instructionsList}</ol>
      </div>
    </div>
  );
}
