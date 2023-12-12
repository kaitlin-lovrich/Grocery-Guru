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
  // const [savedRecipeItems, setSavedRecipeItems] = useState<SavedRecipeItems[]>(
  //   []
  // );
  const { savedRecipesListId: savedRecipesId } = useParams();
  const savedRecipesListId = Number(savedRecipesId);

  useEffect(() => {
    async function loadSavedRecipesPage(savedRecipesListId: number) {
      const savedRecipes = await fetchSavedRecipes(savedRecipesListId);
      setSavedRecipesList(savedRecipes);
    }
    loadSavedRecipesPage(Number(savedRecipesListId));
  }, [savedRecipesListId]);

  return <SearchRecipesComponent savedRecipesList={savedRecipesList} />;
}

type SearchComponentProps = {
  savedRecipesList: SavedRecipesList | undefined;
};

function SearchRecipesComponent({ savedRecipesList }: SearchComponentProps) {
  const [input, setInput] = useState('');

  const inputList = savedRecipesList?.savedRecipeItems.filter((recipe) =>
    recipe.title.toLowerCase().match(input)
  );

  return (
    <div className="browse-recipes-page">
      <SearchBar input={input} onChangeInput={setInput} />

      <RecipeList savedRecipeItems={inputList} />
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
  savedRecipeItems: SavedRecipeItems[] | undefined;
};

function RecipeList({ savedRecipeItems }: RecipeListProps) {
  return (
    <>
      <h1 className="page-heading">Saved Recipes</h1>
      <div className="recipes">
        {savedRecipeItems?.map((recipe) => {
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
