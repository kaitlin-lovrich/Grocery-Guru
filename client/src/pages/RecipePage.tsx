import './RecipePage.css';
import { Ingredient, type Recipe } from '../lib/dataTypes.js';
import { fetchAddToGroceryList, fetchRecipePage } from '../lib/api.js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';

type RecipePageProps = {
  groceryListId: number;
};

export default function RecipePage({ groceryListId }: RecipePageProps) {
  const { recipeId } = useParams();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();

  useEffect(() => {
    async function loadRecipePage(recipeId: number) {
      const recipe = await fetchRecipePage(recipeId);
      setSelectedRecipe(recipe);
    }
    loadRecipePage(Number(recipeId));
  }, [recipeId]);

  if (!selectedRecipe) return null;
  const { title, description, recipeImage, ingredients, instructions } =
    selectedRecipe;

  function handleCheck(ingredient: Ingredient) {
    fetchAddToGroceryList({ groceryListId, ...ingredient });
  }

  const ingredientList = ingredients.map((ingredient) => {
    return (
      <>
        <li key={ingredient.ingredientId}>
          <div>
            <label>
              <input type="checkbox" onClick={() => handleCheck(ingredient)} />
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
