import './BrowseRecipes.css';
import {
  SavedRecipesList,
  type Recipe,
  SavedRecipeItems,
} from '../lib/dataTypes.js';
import { fetchSavedRecipes } from '../lib/api.js';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa6';
import { AppContext } from '../components/AppContext.js';

export default function SavedRecipesPage() {
  // const [savedRecipesList, setSavedRecipesList] = useState<SavedRecipesList>();
  const { savedRecipesList, setSavedRecipesList } = useContext(AppContext);

  const { savedRecipesListId: savedRecipesId } = useParams();
  const savedRecipesListId = Number(savedRecipesId);

  useEffect(() => {
    async function loadSavedRecipesPage(savedRecipesListId: number) {
      const savedRecipes = await fetchSavedRecipes(savedRecipesListId);
      setSavedRecipesList(savedRecipes);
    }
    loadSavedRecipesPage(Number(savedRecipesListId));
  }, [savedRecipesListId, setSavedRecipesList]);

  return <SearchRecipesComponent savedRecipesList={savedRecipesList} />;
}

type SearchComponentProps = {
  savedRecipesList: SavedRecipesList | undefined;
};

function SearchRecipesComponent({ savedRecipesList }: SearchComponentProps) {
  const [input, setInput] = useState('');

  const searchedRecipeList = savedRecipesList?.savedRecipeItems.filter(
    (recipe) => recipe.title.toLowerCase().match(input.toLowerCase())
  );

  return (
    <div className="browse-recipes-page">
      <SearchBar input={input} onChangeInput={setInput} />

      <RecipeList savedRecipeItems={searchedRecipeList} />
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
              <RecipeItem recipe={recipe} savedRecipeItems={savedRecipeItems} />
            </div>
          );
        })}
      </div>
    </>
  );
}

type RecipeItemProps = {
  recipe: Recipe;
  savedRecipeItems: SavedRecipeItems[] | undefined;
};

function RecipeItem({ recipe }: RecipeItemProps) {
  const { recipeId, title, recipeImage } = recipe;

  return (
    <>
      <div className="recipe-item">
        <img src={recipeImage} alt="recipe image" />
        <span className="heart-outline">
          <FaRegHeart />
        </span>
        <Link to={`/recipes/${recipeId}`}>
          <p>{title}</p>
        </Link>
      </div>
    </>
  );
}
