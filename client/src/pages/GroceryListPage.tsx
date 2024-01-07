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
  fetchSavedRecipes,
} from '../lib/api.js';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaX } from 'react-icons/fa6';
import { formatGroceryListItem } from '../lib/functions.js';
import RecipeItem from '../components/RecipeItem.js';
import { AppContext } from '../components/AppContext.js';
import LoadingMessage from '../components/LoadingMessage.js';

export default function GroceryListPage() {
  const [clickedRecipes, setClickedRecipes] = useState<ClickedRecipeRef[]>([]);
  const [shownGroceryList, setShownGroceryList] = useState<GroceryList>();
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const { user, setSavedRecipesList, isLoading, setIsLoading } =
    useContext(AppContext);
  const { groceryListId: groceryId } = useParams();
  const groceryListId = Number(groceryId);

  const clickedRecipesArray = clickedRecipes.map((recipe) => ({ ...recipe }));

  useEffect(() => {
    setIsLoading(true);
    async function loadGroceryListPage(groceryListId: number) {
      try {
        const groceryList = await fetchGroceryList(groceryListId);
        setShownGroceryList(groceryList);
        const allClickedRecipes = await fetchAllClickedRecipeRef(groceryListId);
        setClickedRecipes(allClickedRecipes);
        if (user && user.savedRecipesListId) {
          const savedRecipesData = await fetchSavedRecipes(
            user.savedRecipesListId
          );
          setSavedRecipesList(savedRecipesData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGroceryListPage(Number(groceryListId));
  }, [groceryListId, setIsLoading, setSavedRecipesList, user]);

  function handleAddItemButton() {
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

  if (!shownGroceryList || isLoading) return <LoadingMessage />;
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
            {formatGroceryListItem(item)}
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
          <ul className="grocery-list">
            {groceryList.length === 0 ? (
              <EmptyGroceryListMessage />
            ) : (
              groceryList
            )}
          </ul>
        </form>
        {!showIngredientForm && (
          <AddIngredientButton onClick={() => handleAddItemButton()} />
        )}
      </div>
      {showIngredientForm && (
        <AddIngredientForm
          handleAddItemButton={handleAddItemButton}
          groceryListId={groceryListId}
          onSave={(newGroceryItem) => handleSave(newGroceryItem)}
        />
      )}
      <div className="">
        {clickedRecipes.length !== 0 && (
          <h1 className="page-heading">Recipe Ingredients Referenced:</h1>
        )}
        <RecipeList
          clickedRecipesArray={clickedRecipesArray}
          onXClick={(recipeId) => handleXClick(recipeId)}
        />
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
        + Add Item
      </button>
    </div>
  );
}

type AddIngredientFormProps = {
  groceryListId: number;
  onSave: (ingredient: Ingredient) => void;
  handleAddItemButton: () => void;
};

function AddIngredientForm({
  groceryListId,
  onSave,
  handleAddItemButton,
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
      handleAddItemButton();
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
          <input type="text" name="measurement" />
        </label>
        <label>
          Package Type
          <select name="packageType">
            <option>seasoning</option>
            <option>package</option>
            <option>loaf</option>
            <option>jar</option>
            <option>can</option>
            <option>bottle</option>
            <option>none</option>
          </select>
        </label>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <div>
          <button type="submit">+ Add to Grocery List</button>
        </div>
      </form>
    </>
  );
}

function EmptyGroceryListMessage() {
  return (
    <div>
      <p>Grocery List empty.</p>
      <br />
      <p>
        <span className="pink">
          Add items by checking an ingredient on a recipe's page or click 'Add
          Item' below!
        </span>
      </p>
    </div>
  );
}

type RecipeListProps = {
  clickedRecipesArray: ClickedRecipeRef[];
  onXClick: (recipeId: number) => void;
};

function RecipeList({
  clickedRecipesArray,
  onXClick,
}: RecipeListProps): JSX.Element {
  const { savedRecipesList } = useContext(AppContext);

  const clickedRecipesList = clickedRecipesArray.map((recipe) => {
    const isSaved = savedRecipesList?.savedRecipeItems.some(
      (savedRecipe) => savedRecipe.recipeId === recipe.recipeId
    );

    return (
      <div key={recipe.recipeId} className="recipe-item-container">
        <RecipeItem
          recipe={recipe}
          saved={isSaved}
          onXClick={(recipeId) => onXClick(recipeId)}
        />
      </div>
    );
  });

  return <div className="clicked-recipe-refs">{clickedRecipesList}</div>;
}
