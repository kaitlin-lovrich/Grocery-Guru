import './BrowseRecipes.css';
import { type Recipe } from '../lib/dataTypes.js';
import { fetchRecipes, fetchSavedRecipes } from '../lib/api.js';
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

function RecipeList({ allRecipes }: RecipeListProps): JSX.Element {
  const { user, savedRecipesList, setSavedRecipesList } =
    useContext(AppContext);
  // const [savedRecipes, setSavedRecipes] = useState<SavedRecipesList | null>(null);

  useEffect(() => {
    async function fetchSavedRecipesData() {
      try {
        if (user && user.savedRecipesListId) {
          const savedRecipesData = await fetchSavedRecipes(
            user.savedRecipesListId
          );
          setSavedRecipesList(savedRecipesData);
        }
      } catch (error) {
        // Handle the error, e.g., set an error state or log the error
        console.error('Error fetching saved recipes:', error);
      }
    }

    fetchSavedRecipesData();
  }, [setSavedRecipesList, user]);

  const allRecipesList = allRecipes.map((recipe) => {
    const isSaved = savedRecipesList?.savedRecipeItems.some(
      (savedRecipe) => savedRecipe.recipeId === recipe.recipeId
    );

    return (
      <div key={recipe.recipeId} className="recipe-item-container">
        <RecipeItem recipe={recipe} saved={isSaved || false} />
      </div>
    );
  });

  return (
    <>
      <h1 className="page-heading">Browse Recipes</h1>
      <div className="recipes">{allRecipesList}</div>
    </>
  );
}

// ... (your existing components)

// if ( ==[index].recipeId)
//   setSolidHeart(!solidHeart);
// return (
//   <div key={recipe.recipeId} className="recipe-item-container">
//     <RecipeItem recipe={recipe} saved={solidHeart} />
//   </div>
// );

type RecipeItemProps = {
  recipe: Recipe;
  saved: boolean;
};

function RecipeItem({ recipe, saved }: RecipeItemProps) {
  const { recipeId, title, recipeImage } = recipe;
  const { handleHeartClick, user } = useContext(AppContext);

  return (
    <>
      <div className="recipe-item">
        <img src={recipeImage} />
        <span className="heart-outline">
          {!saved ? (
            <FaRegHeart onClick={() => handleHeartClick(recipeId, user!)} />
          ) : (
            <FaHeart />
          )}
        </span>
        <Link to={`/recipes/${recipeId}`}>
          <p>{title}</p>
        </Link>
      </div>
    </>
  );
}
