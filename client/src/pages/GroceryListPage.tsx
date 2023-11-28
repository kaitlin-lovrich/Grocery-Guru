import './GroceryList.css';
import {
  type Ingredient,
  type GroceryList,
  GroceryItems,
  ClickedRecipeRef,
} from '../lib/dataTypes.js';
import {
  fetchAddIngredient,
  fetchAddToGroceryList,
  fetchAllClickedRecipeRes,
  fetchGroceryList,
} from '../lib/api.js';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaX } from 'react-icons/fa6';

export default function GroceryListPage() {
  const [clickedRecipes, setClickedRecipes] = useState<ClickedRecipeRef[]>([]);
  const { groceryListId: groceryId } = useParams();
  const [shownGroceryList, setShownGroceryList] = useState<GroceryList>();
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const groceryListId = Number(groceryId);

  useEffect(() => {
    async function loadGroceryListPage(groceryListId: number) {
      const groceryList = await fetchGroceryList(groceryListId);
      setShownGroceryList(groceryList);
      const allClickedRecipes = await fetchAllClickedRecipeRes(groceryListId);
      setClickedRecipes(allClickedRecipes);
    }
    loadGroceryListPage(Number(groceryListId));
  }, [groceryListId]);

  function handleAddIngredientButton() {
    setShowIngredientForm(!showIngredientForm);
  }

  function handleSave(newGroceryItem: Ingredient) {
    setShownGroceryList((prev) => ({
      ...prev!,
      groceryListId,
      groceryItems: [...prev!.groceryItems, newGroceryItem as GroceryItems],
    }));
  }

  if (!shownGroceryList) return null;
  const { groceryItems } = shownGroceryList;
  const groceryList = groceryItems.map((item) => {
    return (
      <li key={`${item.ingredientId}: ${item.recipeId}`}>
        <div>
          <label>
            <input type="checkbox" name={item.name} className="checkbox" />
            {`${item.quantity} ${item.name} ${item.packageType}`}
          </label>
        </div>
      </li>
    );
  });

  return (
    <div className="page">
      <div className="content-container grocery-list">
        <h1 className="page-title">Grocery List</h1>
        <form id="grocery-list-form">
          <ul>{groceryList}</ul>
        </form>
        {!showIngredientForm && (
          <AddIngredientButton onClick={() => handleAddIngredientButton()} />
        )}
        {showIngredientForm && (
          <AddIngredientForm
            onClick={() => handleAddIngredientButton()}
            groceryListId={groceryListId}
            onSave={(newGroceryItem) => handleSave(newGroceryItem)}
          />
        )}
      </div>
      <div className="">
        <h1 className="page-heading">Recipe Ingredients Referenced:</h1>
        <div className="clicked-recipe-refs">
          {clickedRecipes.map((recipe) => {
            return (
              <div key={recipe.recipeId} className="recipe-item-container">
                <RecipeItem recipe={recipe} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type AddIngredientButtonProps = {
  onClick: () => void;
};

function AddIngredientButton({ onClick }: AddIngredientButtonProps) {
  return (
    <div>
      <button type="button" onClick={onClick}>
        + Add Ingredient
      </button>
    </div>
  );
}

type AddIngredientFormProps = {
  groceryListId: number;
  onSave: (ingredient: Ingredient) => void;
  onClick: () => void;
};

function AddIngredientForm({
  groceryListId,
  onSave,
  onClick,
}: AddIngredientFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const ingredientData = Object.fromEntries(formData.entries());
      const ingredient = await fetchAddIngredient(ingredientData);
      const quantity = ingredientData.quantity;
      const newGroceryItem = await fetchAddToGroceryList({
        groceryListId,
        ...ingredient,
        quantity,
      });
      onSave({ ...ingredientData, ...newGroceryItem });
      console.log('newGroceryItem', newGroceryItem);
    } catch (err) {
      alert(`Error adding Ingredient: ${err}`);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="content-container">
        <label>
          Quantity
          <input type="number" name="quantity" />
        </label>
        <label>
          Measurement
          <input type="text" value="ounce" name="measurement" />
        </label>
        <label>
          Package Type
          <select name="packageType">
            <option value="seasoning">seasoning</option>
            <option value="package">package</option>
            <option value="loaf">loaf</option>
            <option value="jar">jar</option>
            <option value="can">can</option>
            <option value="bottle">bottle</option>
            <option value="">none</option>
          </select>
        </label>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <div>
          <button type="submit" onClick={onClick}>
            + Add to Grocery List
          </button>
        </div>
      </form>
    </>
  );
}

type RecipeItemProps = {
  recipe: ClickedRecipeRef;
};

function RecipeItem({ recipe }: RecipeItemProps) {
  const { recipeId, title, recipeImage } = recipe;
  return (
    <Link to={`/recipes/${recipeId}`}>
      <div className="recipe-item">
        <img src={recipeImage} />
        <p>{title}</p>
        <FaX />
      </div>
    </Link>
  );
}

// function EmptyGroceryListMessage() {
//   return (
//     <span>
//       Grocery empty. Add some stuff by checking off an ingredient on a recipe's
//       page or click 'Add Ingredient' below!
//     </span>
//   );
// }
