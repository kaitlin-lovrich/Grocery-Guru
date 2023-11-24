import './GroceryList.css';
import { type GroceryList } from '../lib/dataTypes.js';
import {
  fetchAddIngredient,
  fetchAddToGroceryList,
  fetchGroceryList,
} from '../lib/api';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// type GroceryListProps = {
//   setGroceryListId: ;
// };

export default function GroceryList() {
  const { groceryListId: groceryId } = useParams();
  const [shownGroceryList, setShownGroceryList] = useState<GroceryList>();
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const groceryListId = Number(groceryId);

  useEffect(() => {
    async function loadGroceryListPage(groceryListId: number) {
      const groceryList = await fetchGroceryList(groceryListId);
      setShownGroceryList(groceryList);
    }
    loadGroceryListPage(Number(groceryListId));
  }, [groceryListId]);

  function handleAddIngredientButton() {
    setShowIngredientForm(!showIngredientForm);
  }

  if (!shownGroceryList) return null;
  const { groceryItems } = shownGroceryList;
  const groceryList = groceryItems.map((item) => {
    return (
      <>
        <li key={item.ingredientId}>
          <div>
            <label>
              <input
                type="checkbox"
                id={`${item.ingredientId}`}
                name={item.name}
                className="checkbox"
              />
              {`${item.quantity} ${item.name} ${item.packageType}`}
            </label>
          </div>
        </li>
      </>
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
          <AddIngredientForm groceryListId={groceryListId} />
        )}
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
};

function AddIngredientForm({ groceryListId }: AddIngredientFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const ingredientData = Object.fromEntries(formData.entries());
      console.log('ingredientData', ingredientData);
      const ingredient = await fetchAddIngredient(ingredientData);
      console.log('ingredient', ingredient);
      const quantity = ingredientData.quantity;
      await fetchAddToGroceryList({ groceryListId, ...ingredient, quantity });
      // setShownGroceryList();
    } catch (err) {
      alert(`Error adding Ingredient: ${err}`);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="content-container">
        <label>
          Quantity
          <input type="text" name="quantity" />
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
          <button type="submit">+ Add to Grocery List</button>
        </div>
      </form>
    </>
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
