import './GroceryList.css';
import { type GroceryList } from '../lib/dataTypes.js';
import { fetchGroceryList } from '../lib/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function GroceryList() {
  const { groceryListId } = useParams();
  const [shownGroceryList, setShownGroceryList] = useState<GroceryList>();

  useEffect(() => {
    async function loadGroceryListPage(groceryListId: number) {
      const groceryList = await fetchGroceryList(1);
      setShownGroceryList(groceryList);
      console.log(Number(groceryListId), typeof Number(groceryListId));
    }
    loadGroceryListPage(1);
  }, [groceryListId]);

  if (!shownGroceryList) return null;
  const { groceryItems } = shownGroceryList;
  const groceryList = groceryItems.map((item) => {
    return (
      <li
        key={
          item.ingredientId
        }>{`${item.quantity} ${item.measurement} ${item.name}`}</li>
    );
  });

  return (
    <div className="grocery-list-page">
      <div className="grocery-list-pagecontent">
        <h1 className="grocery-list-title">Grocery List</h1>
        <ul>{groceryList}</ul>
      </div>
    </div>
  );
}
