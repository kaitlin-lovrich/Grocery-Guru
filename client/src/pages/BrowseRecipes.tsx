import './BrowseRecipes.css';
import { type Recipe } from '../lib/dataTypes.js';
import { fetchRecipes } from '../lib/api.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BrowseRecipes() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function loadBrowseRecipes() {
      const recipes = await fetchRecipes();
      setAllRecipes(recipes);
    }
    loadBrowseRecipes();
  }, [setAllRecipes]);

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

  const inputList = allRecipes.filter((recipe) =>
    recipe.title.toLowerCase().match(input)
  );

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
          <SearchBar input={input} onChangeInput={setInput} />
        </div>
      </div>
      <RecipeList allRecipes={inputList} />
    </>
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
      className="input"></input>
  );
}

type RecipeListProps = {
  allRecipes: Recipe[];
};

function RecipeList({ allRecipes }: RecipeListProps) {
  return (
    <div className="browse-recipes-page">
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
    </div>
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
