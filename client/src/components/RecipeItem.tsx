import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { Recipe, CheckedRecipeRef } from '../lib/dataTypes';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';

type RecipeItemProps = {
  recipe: Recipe | CheckedRecipeRef; // Accommodate both Recipe and CheckedRecipeRef
  saved: boolean; // Determine if the recipe is saved or not
  onXClick?: (recipeId: number) => void; // Optional, for handling X button click
};

export default function RecipeItem({
  recipe,
  saved,
  onXClick,
}: RecipeItemProps) {
  const { recipeId, title, recipeImage } = recipe;
  const [isSaved, setIsSaved] = useState(saved);
  const { handleHeartClick, user } = useContext(AppContext);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  function toggleSave() {
    handleHeartClick(recipeId, user!, !isSaved);
    setIsSaved(!isSaved);
  }

  return (
    <div className="recipe-item">
      <img src={recipeImage} alt="recipe image" />

      <span
        className="heart-outline"
        onClick={toggleSave}
        role="button"
        tabIndex={0}
        aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}>
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </span>

      <div className="title-and-x">
        <Link to={`/recipes/${recipeId}`}>
          <p>{title}</p>
        </Link>

        {onXClick && (
          <div className="x-button-div">
            <button
              type="button"
              className="x-button"
              onClick={() => onXClick(recipeId)}
              aria-label="Remove recipe">
              <FaX />
            </button>
            <div className="x-button-message">
              <p>Remove all ingredients associated with recipe</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
