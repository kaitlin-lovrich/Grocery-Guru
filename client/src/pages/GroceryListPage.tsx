import './GroceryList.css';
import {
  type Ingredient,
  type GroceryList,
  GroceryItems,
  CheckedRecipeRef,
} from '../lib/dataTypes.js';
import {
  fetchAddIngredient,
  fetchAddToGroceryList,
  fetchAllCheckedRecipeRef,
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
  const [checkedRecipes, setCheckedRecipes] = useState<CheckedRecipeRef[]>([]);
  const [displayedGroceryList, setDisplayedGroceryList] =
    useState<GroceryList>();
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const { user, setSavedRecipesList, isLoading, setIsLoading } =
    useContext(AppContext);
  const { groceryListId: groceryId } = useParams();
  const groceryListId = Number(groceryId);

  const checkedRecipesArray = checkedRecipes.map((recipe) => ({ ...recipe }));

  useEffect(() => {
    setIsLoading(true);
    async function loadGroceryListPage(groceryListId: number) {
      try {
        const groceryList = await fetchGroceryList(groceryListId);
        setDisplayedGroceryList(groceryList);
        const allCheckedRecipes = await fetchAllCheckedRecipeRef(groceryListId);
        setCheckedRecipes(allCheckedRecipes);
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
    setDisplayedGroceryList((prev) => ({
      ...prev!,
      groceryListId,
      groceryItems: [...prev!.groceryItems, newGroceryItem as GroceryItems],
    }));
  }

  // Removes all checked items from the grocery list
  async function handleRemoveChecked(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form); // Collects the form's checked inputs
    const checked = Array.from(formData.entries()); // Array of key, value pairs ex. ['ingredientId', '123']
    const checkedIngredientIds = checked.map((check) => +check[1]); // Array of values converted to numbers ex. [101, 102]
    await fetchRemoveIngredientIdItems({
      groceryListId: groceryListId,
      ingredientIds: checkedIngredientIds,
    }); // Sends an API to the groceryListId and the array of checkedIngredientIds
    const updatedList = displayedGroceryList!.groceryItems.filter(
      (item) => !checkedIngredientIds.includes(item.ingredientId)
    );
    displayedGroceryList!.groceryItems = updatedList;
    setDisplayedGroceryList({ ...displayedGroceryList! });
    const updatedCheckedRecipes = checkedRecipes.filter((recipe) => {
      const found = displayedGroceryList!.groceryItems.find(
        (item) => item.recipeId === recipe.recipeId
      );
      return !!found;
    });
    setCheckedRecipes(updatedCheckedRecipes);
  }

  // Removes of all grocery list items associated with a specific recipe
  async function handleXClick(recipeId: number) {
    // Sends a DELETE request to the server with the groceryListId and recipeId in the request body.
    await fetchRemoveRecipeIdItems({
      groceryListId: groceryListId,
      recipeId: recipeId,
    });

    // Removes grocery items where the items' recipeId matches the recipeId being removed
    // If the Id's do not match, expression returns true and `item` gets stored in updatedList
    const updatedList = displayedGroceryList!.groceryItems.filter(
      (item) => recipeId !== item.recipeId
    );
    // Replaces groceryItems with the updated list
    displayedGroceryList!.groceryItems = updatedList;
    // Updates the state that displays the user's grocery list on the client side
    setDisplayedGroceryList({ ...displayedGroceryList! });

    // Creates a new list with the clicked recipe removed
    const updatedCheckedRecipes = checkedRecipes.filter(
      (item) => recipeId !== item.recipeId
    );
    setCheckedRecipes(updatedCheckedRecipes);
  }

  if (!displayedGroceryList || isLoading) return <LoadingMessage />;

  const { groceryItems } = displayedGroceryList;

  type AggGroceryItems = {
    [name: string]: GroceryItems;
  };

  // // Adds ingredient quantities together if ingredients appear in the list more than once
  const aggregatedGroceryItems = groceryItems.reduce<AggGroceryItems>(
    (acc, item) => {
      const name = item.name;
      if (!acc[name]) {
        acc[name] = { ...item };
      } else {
        acc[name].quantity += item.quantity;
      }
      return acc;
    },
    {}
  );

  const groceryList = Object.values(aggregatedGroceryItems).map((item) => {
    return (
      <li key={`${item.ingredientId}: ${item.recipeId}`}>
        <div>
          <label className="checkbox-label">
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
        <form id="grocery-list-form" onSubmit={handleRemoveChecked}>
          <div className="heading-and-button">
            <h1 className="page-title">Grocery List</h1>
            {groceryList.length !== 0 && (
              <div>
                <div>
                  <button type="submit" className="x-button">
                    <FaX />
                  </button>
                </div>
                <p>Remove checked items</p>
              </div>
            )}
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
        {checkedRecipes.length !== 0 && (
          <h1 className="page-heading">Recipes Referenced:</h1>
        )}
        <RecipeReferenceList
          checkedRecipesArray={checkedRecipesArray}
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

type RecipeReferenceListProps = {
  checkedRecipesArray: CheckedRecipeRef[];
  onXClick: (recipeId: number) => void;
};

function RecipeReferenceList({
  checkedRecipesArray,
  onXClick,
}: RecipeReferenceListProps): JSX.Element {
  const { savedRecipesList } = useContext(AppContext);

  const checkedRecipesList = checkedRecipesArray.map((recipe) => {
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

  return <div className="clicked-recipe-refs">{checkedRecipesList}</div>;
}
