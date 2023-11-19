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
  const { title, description, recipeImage, instructions } = selectedRecipe;
  return (
    <div className="recipe-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="recipe-item-container">
        <img src={recipeImage} />
      </div>
      <p>{instructions}</p>
    </div>
  );
}
