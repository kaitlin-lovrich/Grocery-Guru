import './RecipePage.css';
import { type Recipe } from '../lib/dataTypes.js';
import { fetchRecipePage } from '../lib/api.js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';

export default function RecipePage() {
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

  const ingredientList = ingredients.map((ingredient) => {
    return <li key={ingredient.ingredientId}>{ingredient.name}</li>;
  });

  const instructionsArray = instructions.split('\n');
  const instructionsList = instructionsArray.map((item) => {
    return <li key={item}>{item}</li>;
  });

  return (
    <div className="recipe-page">
      <div className="recipe-page-content">
        <h1 className="recipe-title">{title}</h1>
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
