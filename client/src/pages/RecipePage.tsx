import './RecipePage.css';
import { GroceryList, Ingredient, type Recipe } from '../lib/dataTypes.js';
import {
  fetchAddToGroceryList,
  fetchGroceryList,
  fetchRecipePage,
} from '../lib/api.js';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../components/AppContext.js';
// import { Link } from 'react-router-dom';

type RecipePageProps = {
  groceryListId: number | undefined;
};

export default function RecipePage({ groceryListId }: RecipePageProps) {
  const { recipeId: recipeIdStr } = useParams();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [groceryList, setGroceryList] = useState<GroceryList>();
  const { user } = useContext(AppContext);
  // const navigate = useNavigate();

  const recipeId = Number(recipeIdStr);

  useEffect(() => {
    async function loadRecipePage(recipeId: number) {
      const recipe = await fetchRecipePage(recipeId);
      setSelectedRecipe(recipe);
      if (user) {
        const groceryList = await fetchGroceryList(user.groceryListId);
        setGroceryList(groceryList);
      }
    }
    loadRecipePage(Number(recipeId));
  }, [recipeId, user]);

  if (!selectedRecipe) return null;
  const { title, description, recipeImage, ingredients, instructions } =
    selectedRecipe;

  function handleCheck(ingredient: Ingredient) {
    if (!user) return;
    fetchAddToGroceryList({ groceryListId, ...ingredient, recipeId });
  }

  const ingredientList = ingredients.map((ingredient) => {
    return (
      <li key={ingredient.ingredientId}>
        <CheckBoxIngredient
          onClick={handleCheck}
          ingredient={ingredient}
          groceryList={groceryList}
          recipeId={recipeId}
        />
      </li>
    );
  });

  const instructionsArray = instructions.split('\n');
  const instructionsList = instructionsArray.map((item) => {
    return <li key={item}>{item}</li>;
  });

  return (
    <div className="page">
      <div className="content-container">
        <h1 className="page-title">{title}</h1>
        <p>{description}</p>
        <div className="recipe-image">
          <img src={recipeImage} />
        </div>
        <h2 className="recipe-h2">Ingredients</h2>
        <ul>{ingredientList}</ul>
        <h2 className="recipe-h2">Instructions</h2>
        <ol className="instructions">{instructionsList}</ol>
      </div>
    </div>
  );
}

type CheckBoxIngredientProps = {
  ingredient: Ingredient;
  groceryList?: GroceryList;
  recipeId: number;
  onClick: (ingredient: Ingredient) => void;
};

function CheckBoxIngredient({
  ingredient,
  groceryList,
  recipeId,
  onClick,
}: CheckBoxIngredientProps) {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const isInGroceryItems = !!groceryList?.groceryItems.find((groceryItem) => {
      return (
        groceryItem.ingredientId === ingredient.ingredientId &&
        groceryItem.recipeId === recipeId
      );
    });
    setChecked(isInGroceryItems);
    console.log('isInGroceryItems', isInGroceryItems);
  }, [groceryList, ingredient, recipeId]);
  console.log('checked', checked);
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          onClick={() => onClick(ingredient)}
        />
        {`${ingredient.quantity} ${ingredient.name}`}
      </label>
    </div>
  );
}
