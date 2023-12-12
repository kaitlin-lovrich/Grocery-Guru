// AddIngredientForm taken from GroceryListPage, can be used and modified when I go to write the code for User can add their own recipes feature

// Function inside GListPage component:
//   function handleSave(newGroceryItem: Ingredient) {
//     setShownGroceryList((prev) => ({
//       ...prev!,
//       groceryListId,
//       groceryItems: [...prev!.groceryItems, newGroceryItem as GroceryItems],
//     }));
//   }

// JSX:
// return (
//   <AddIngredientForm
//     onClick={() => handleAddItemButton()}
//     groceryListId={groceryListId}
//     onSave={(newGroceryItem) => handleSave(newGroceryItem)}
//   />
// );

// Everything below is part of add ingredient form:
// type AddIngredientFormProps = {
//   groceryListId: number;
//   onSave: (ingredient: Ingredient) => void;
//   onClick: () => void;
// };

// function AddIngredientForm({
//   groceryListId,
//   onSave,
//   onClick,
// }: AddIngredientFormProps) {
//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     try {
//       const formData = new FormData(event.currentTarget);
//       const ingredientData = Object.fromEntries(formData.entries());
//       const ingredient = await fetchAddIngredient(ingredientData);
//       const quantity = ingredientData.quantity;
//       const newGroceryItem = await fetchAddToGroceryList({
//         groceryListId,
//         ...ingredient,
//         quantity,
//       });
//       onSave({ ...ingredientData, ...newGroceryItem });
//     } catch (err) {
//       alert(`Error adding Ingredient: ${err}`);
//     }
//   }

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="content-container">
//         <label>
//           Quantity
//           <input type="number" name="quantity" />
//         </label>
//         <label>
//           Measurement
//           <input type="text" value="ounce" name="measurement" />
//         </label>
//         <label>
//           Package Type
//           <select name="packageType">
//             <option value="seasoning">seasoning</option>
//             <option value="package">package</option>
//             <option value="loaf">loaf</option>
//             <option value="jar">jar</option>
//             <option value="can">can</option>
//             <option value="bottle">bottle</option>
//             <option value="">none</option>
//           </select>
//         </label>
//         <label>
//           Name
//           <input type="text" name="name" />
//         </label>
//         <div>
//           <button type="submit" onClick={onClick}>
//             + Add to Grocery List
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }
