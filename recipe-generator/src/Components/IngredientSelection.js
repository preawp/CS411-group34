// where user select or type in their preferred ingredients
import React, { useState } from 'react';
import './IngredientSelection.css'; // Ensure this path matches the location of your CSS file

const IngredientSelection = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [generatedMenu, setGeneratedMenu] = useState([]);

  const handleIngredientSelect = (ingredient) => {
    const updatedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter((item) => item !== ingredient)
      : [...selectedIngredients, ingredient];

    setSelectedIngredients(updatedIngredients);
  };

  const ingredients = ['Tomato', 'Cheese', 'Bread', 'Beef', 'Chicken', 'Pasta', 'Rice', 'Shrimp'];

  // Updated mock recipes based on selected ingredients
  const recipes = [
    {
      id: 1,
      title: 'Caprese Salad',
      ingredients: ['Tomato', 'Cheese', 'Bread'],
    },
    {
      id: 2,
      title: 'Beef Stir-Fry',
      ingredients: ['Beef', 'Rice'],
    },
    {
      id: 3,
      title: 'Creamy Chicken Pasta',
      ingredients: ['Chicken', 'Pasta', 'Cheese'],
    },
    {
      id: 4,
      title: 'Shrimp Scampi',
      ingredients: ['Shrimp', 'Pasta', 'Bread'],
    },
  ];

  const generateMenu = () => {
    const generatedMenu = recipes.filter((recipe) =>
      selectedIngredients.every((ingredient) =>
        recipe.ingredients.includes(ingredient)
      )
    );
    setGeneratedMenu(generatedMenu);
  };

  return (
    <div className="ingredient-selection">
      <h2>Choose Ingredients</h2>
      <div className="ingredient-checkboxes">
        {ingredients.map((ingredient) => (
          <label key={ingredient}>
            <input
              type="checkbox"
              value={ingredient}
              checked={selectedIngredients.includes(ingredient)}
              onChange={() => handleIngredientSelect(ingredient)}
            />
            {ingredient}
          </label>
        ))}
      </div>
      <button onClick={generateMenu}>Generate Menu</button>

      <h2>Generated Menu</h2>
      <div className="generated-menu">
        {generatedMenu.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.title}</h3>
            {/* Display other recipe details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSelection;
