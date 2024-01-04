import './BrowseRecipes.css';
import { type Recipe } from '../lib/dataTypes.js';
import { fetchRecipes, fetchSavedRecipes } from '../lib/api.js';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../components/AppContext.js';
import RecipeItem from '../components/RecipeItem.js';

export default function BrowseRecipes() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const { user, setSavedRecipesList } = useContext(AppContext);

  useEffect(() => {
    async function loadBrowseRecipes() {
      try {
        const recipes = await fetchRecipes();
        setAllRecipes(recipes);

        if (user && user.savedRecipesListId) {
          const savedRecipesData = await fetchSavedRecipes(
            user.savedRecipesListId
          );
          setSavedRecipesList(savedRecipesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    loadBrowseRecipes();
  }, [setAllRecipes, setSavedRecipesList, user]);

  return (
    <>
      <SearchRecipesComponent allRecipes={allRecipes} />
    </>
  );
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
      <h1 className="page-heading">Browse Recipes</h1>
      <RecipeList shownRecipes={searchedRecipeList} />
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
  shownRecipes: Recipe[];
};

function RecipeList({ shownRecipes }: RecipeListProps): JSX.Element {
  const { savedRecipesList } = useContext(AppContext);

  const shownRecipesList = shownRecipes.map((recipe) => {
    const isSaved = savedRecipesList?.savedRecipeItems.some(
      (savedRecipe) => savedRecipe.recipeId === recipe.recipeId
    );

    return (
      <div key={recipe.recipeId} className="recipe-item-container">
        <RecipeItem recipe={recipe} saved={isSaved} />
      </div>
    );
  });

  return (
    <>
      <div className="recipes">{shownRecipesList}</div>
    </>
  );
}
