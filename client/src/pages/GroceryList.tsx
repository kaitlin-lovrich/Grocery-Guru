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
      console.log(groceryListId, typeof groceryListId);
    }
    loadGroceryListPage(Number(groceryListId));
  }, [groceryListId]);

  function handleAddIngredientButton() {
    setShowIngredientForm(true);
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
        <div>
          <button type="button" onClick={() => handleAddIngredientButton()}>
            + Add Ingredient
          </button>
        </div>
        {AddIngredient && <AddIngredient />}
      </div>
    </div>
  );
}

function AddIngredient() {
  return (
    <>
      <form>
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
        <button>+ Add to Grocery List</button>
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
