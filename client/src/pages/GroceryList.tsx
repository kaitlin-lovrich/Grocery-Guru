import './GroceryList.css';
import { type GroceryList } from '../lib/dataTypes.js';
import { fetchGroceryList } from '../lib/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function GroceryList() {
  const { groceryListId } = useParams();
  const [shownGroceryList, setShownGroceryList] = useState<GroceryList>();
  Number(groceryListId);

  useEffect(() => {
    async function loadGroceryListPage(groceryListId: number) {
      const groceryList = await fetchGroceryList(groceryListId);
      setShownGroceryList(groceryList);
      console.log(groceryListId, typeof groceryListId);
    }
    loadGroceryListPage(Number(groceryListId));
  }, [groceryListId]);

  if (!shownGroceryList) return null;
  const { groceryItems } = shownGroceryList;
  const groceryList = groceryItems.map((item) => {
    return (
      <li
        key={
          item.ingredientId
        }>{`${item.quantity} ${item.name} ${item.packageType}`}</li>
    );
  });

  return (
    <div className="page">
      <div className="content-container grocery-list">
        <h1 className="page-title">Grocery List</h1>
        {shownGroceryList ? <ul>{groceryList}</ul> : <EmptyGroceryList />}
      </div>
    </div>
  );
}

function EmptyGroceryList() {
  return (
    <span>
      Grocery empty. Add some stuff by checking off an ingredient on a recipe's
      page or click 'Add Ingredient' below!
    </span>
  );
}
