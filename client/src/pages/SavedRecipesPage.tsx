import './BrowseRecipes.css';
import {
  SavedRecipesList,
  type Recipe,
  SavedRecipeItems,
} from '../lib/dataTypes.js';
import { fetchSavedRecipes } from '../lib/api.js';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function SavedRecipesPage() {
  const [savedRecipesList, setSavedRecipesList] = useState<SavedRecipesList>();
  const [savedRecipeItems, setSavedRecipeItems] = useState<SavedRecipeItems[]>(
    []
  );
  const { savedRecipesListId: savedRecipesId } = useParams();
  const savedRecipesListId = Number(savedRecipesId);

  useEffect(() => {
    async function loadSavedRecipesPage() {
      const savedRecipes = await fetchSavedRecipes(savedRecipesListId);
      setSavedRecipesList(savedRecipes);
    }
    loadSavedRecipesPage();
  }, [savedRecipesListId]);

  return <SearchRecipesComponent savedRecipeItems={savedRecipeItems} />;
}

type SearchComponentProps = {
  savedRecipesList: SavedRecipesList;
};

function SearchRecipesComponent({ savedRecipesList }: SearchComponentProps) {
  const [input, setInput] = useState('');

  const inputList = savedRecipesList.savedRecipeItems.filter((recipe) =>
    recipe.title.toLowerCase().match(input)
  );

  return (
    <div className="browse-recipes-page">
      <SearchBar input={input} onChangeInput={setInput} />

      <RecipeList savedRecipesList={inputList} />
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
  savedRecipesList: SavedRecipesList;
};

function RecipeList({ savedRecipesList }: RecipeListProps) {
  return (
    <>
      <h1 className="page-heading">Saved Recipes</h1>
      <div className="recipes">
        {savedRecipesList?.savedRecipeItems.map((recipe) => {
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
  return (
    <>
      <Link to={`/recipes/${recipeId}`}>
        <div className="recipe-item">
          <img src={recipeImage} />
          <p>{title}</p>
        </div>
      </Link>
    </>
  );
}
