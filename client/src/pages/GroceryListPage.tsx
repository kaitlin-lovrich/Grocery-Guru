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
  fetchAllClickedRecipeRef,
  fetchGroceryList,
  fetchRemoveIngredientIdItems,
  fetchRemoveRecipeIdItems,
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
      const allClickedRecipes = await fetchAllClickedRecipeRef(groceryListId);
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

  async function handleRemove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const checked = Array.from(formData.entries());
    const checkedIngredientIds = checked.map((check) => +check[1]);
    await fetchRemoveIngredientIdItems({
      groceryListId: groceryListId,
      ingredientIds: checkedIngredientIds,
    });
    const updatedList = shownGroceryList!.groceryItems.filter(
      (item) => !checkedIngredientIds.includes(item.ingredientId)
    );
    shownGroceryList!.groceryItems = updatedList;
    setShownGroceryList({ ...shownGroceryList! });

    console.log('shownGroceryList', shownGroceryList);
    console.log('clickedRecipes', clickedRecipes);

    const updatedClickedRecipes = clickedRecipes.filter((recipe) => {
      const found = shownGroceryList!.groceryItems.find(
        (item) => item.recipeId === recipe.recipeId
      );

      return !!found;
    });
    setClickedRecipes(updatedClickedRecipes);
  }

  async function handleXClick(recipeId: number) {
    await fetchRemoveRecipeIdItems({
      groceryListId: groceryListId,
      recipeId: recipeId,
    });
    const updatedList = shownGroceryList!.groceryItems.filter(
      (item) => recipeId !== item.recipeId
    );
    shownGroceryList!.groceryItems = updatedList;
    setShownGroceryList({ ...shownGroceryList! });
    const updatedClickedRecipes = clickedRecipes.filter(
      (item) => recipeId !== item.recipeId
    );
    setClickedRecipes(updatedClickedRecipes);
  }

  if (!shownGroceryList) return null;
  const { groceryItems } = shownGroceryList;
  const groceryList = groceryItems.map((item) => {
    return (
      <li key={`${item.ingredientId}: ${item.recipeId}`}>
        <div>
          <label>
            <input
              type="checkbox"
              name="ingredientIds"
              className="checkbox"
              value={item.ingredientId}
            />
            {`${item.quantity} ${item.name} ${item.packageType}`}
          </label>
        </div>
      </li>
    );
  });

  return (
    <div className="page">
      <div className="content-container grocery-list">
        <form id="grocery-list-form" onSubmit={handleRemove}>
          <div className="heading-and-button">
            <h1 className="page-title">Grocery List</h1>
            <div>
              <div>
                <button type="submit" className="x-button">
                  <FaX />
                </button>
              </div>
              <p>Remove checked items</p>
            </div>
          </div>
          <ul className="grocery-list">{groceryList}</ul>
        </form>
        {!showIngredientForm && (
          <AddIngredientButton onClick={() => handleAddIngredientButton()} />
        )}
      </div>
      {showIngredientForm && (
        <AddIngredientForm
          onClick={() => handleAddIngredientButton()}
          groceryListId={groceryListId}
          onSave={(newGroceryItem) => handleSave(newGroceryItem)}
        />
      )}
      <div className="">
        <h1 className="page-heading">Recipe Ingredients Referenced:</h1>
        <div className="clicked-recipe-refs">
          {clickedRecipes.map((recipe) => {
            return (
              <div key={recipe.recipeId} className="recipe-item-container">
                <RecipeItem
                  recipe={recipe}
                  onXClick={(recipeId) => handleXClick(recipeId)}
                />
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
  onXClick: (recipeId: number) => void;
};

function RecipeItem({ recipe, onXClick }: RecipeItemProps) {
  const { recipeId, title, recipeImage } = recipe;
  return (
    <div className="recipe-item">
      <img src={recipeImage} />
      <div className="recipe-item">
        <Link to={`/recipes/${recipeId}`}>
          <p>{title}</p>
        </Link>
        <button
          type="button"
          className="x-button"
          onClick={() => onXClick(recipeId)}>
          <FaX />
        </button>
      </div>
    </div>
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
