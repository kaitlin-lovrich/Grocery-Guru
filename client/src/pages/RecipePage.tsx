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
    async function loadRecipeData(recipeId: number) {
      const recipe = await fetchRecipePage(recipeId);
      setSelectedRecipe(recipe);
    }
    loadRecipeData(Number(recipeId));
  }, [recipeId]);

  return (
    <div className="recipe-page">
      <h1>Recipe Page</h1>
      {selectedRecipe?.title}
    </div>
  );
}
