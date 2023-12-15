import './BrowseRecipes.css';
import { type Recipe } from '../lib/dataTypes.js';
import { fetchRecipes } from '../lib/api.js';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { AppContext } from '../components/AppContext.js';

export default function BrowseRecipes() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function loadBrowseRecipes() {
      const recipes = await fetchRecipes();
      setAllRecipes(recipes);
    }
    loadBrowseRecipes();
  }, [setAllRecipes]);

  return <SearchRecipesComponent allRecipes={allRecipes} />;
}

type SearchComponentProps = {
  allRecipes: Recipe[];
};

function SearchRecipesComponent({ allRecipes }: SearchComponentProps) {
  const [input, setInput] = useState('');

  const searchedRecipeList = allRecipes.filter((recipe) =>
    recipe.title.toLowerCase().match(input.toLowerCase())
  );

  return (
    <div className="browse-recipes-page">
      <SearchBar input={input} onChangeInput={setInput} />

      <RecipeList allRecipes={searchedRecipeList} />
    </div>
  );
}

type SearchBarProps = {
  input: string;
  onChangeInput: (value: string) => void;
};

function SearchBar({ input, onChangeInput }: SearchBarProps) {
  return (
    <input
      value={input}
      onChange={(e) => onChangeInput(e.currentTarget.value)}
      className="search-bar"
    />
  );
}

type RecipeListProps = {
  allRecipes: Recipe[];
};

function RecipeList({ allRecipes }: RecipeListProps) {
  return (
    <>
      <h1 className="page-heading">Browse Recipes</h1>
      <div className="recipes">
        {allRecipes?.map((recipe) => {
          return (
            <div key={recipe.recipeId} className="recipe-item-container">
              <RecipeItem recipe={recipe} />
            </div>
          );
        })}
      </div>
    </>
  );
}

type RecipeItemProps = {
  recipe: Recipe;
};

function RecipeItem({ recipe }: RecipeItemProps) {
  const { recipeId, title, recipeImage } = recipe;
  const { handleHeartClick, user, savedRecipesList } = useContext(AppContext);

  return (
    <>
      <div className="recipe-item">
        <img src={recipeImage} />
        <span className="heart-outline">
          {!savedRecipesList.savedRecipeItems.find(
            (recipe) => recipe.recipeId === recipeId
          ) ? (
            <FaRegHeart onClick={() => handleHeartClick(recipeId, user!)} />
          ) : (
            <FaHeart onClick={() => handleHeartClick(recipeId, user!)} />
          )}
        </span>
        <Link to={`/recipes/${recipeId}`}>
          <p>{title}</p>
        </Link>
      </div>
    </>
  );
}
