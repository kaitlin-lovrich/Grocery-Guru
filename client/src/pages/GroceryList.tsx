import './GroceryList.css';
import { type GroceryList } from '../lib/dataTypes.js';
import { fetchGroceryList } from '../lib/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function GroceryList() {
  const { groceryListId } = useParams();
  const [shownGroceryList, setShownGroceryList] = useState<GroceryList>();
  const [showIngredientForm, setShowIngredientForm] = useState(false);

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
        {showIngredientForm && <AddIngredientForm />}
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

function AddIngredientForm() {
  return (
    <>
      <form className="content-container">
        <label>
          Quantity
          <input type="number" />
        </label>
        <label>
          Measurement
          <input type="text" value="ounce" />
        </label>
        <label>
          Name
          <input type="text" />
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
