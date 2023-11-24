import React, { useState } from 'react';
import './IngredientSelection.css'; // Ensure this path matches the location of your CSS file

const IngredientSelection = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [generatedMenu, setGeneratedMenu] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputValue.trim() !== '') {
        setSelectedIngredients([...selectedIngredients, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = [...selectedIngredients];
    newIngredients.splice(index, 1);
    setSelectedIngredients(newIngredients);
  };

  const generateMenu = () => {
    // Implement your logic for generating the menu here
    // Use selectedIngredients to fetch recipes or perform any action
    // Update the generatedMenu state with the fetched recipes or results
  };

  return (
    <div className="ingredient-selection">
      <h2>Enter Your Ingredients</h2>
      <div className="ingredient-input">
        <div className="selected-ingredients">
          {selectedIngredients.map((ingredient, index) => (
            <div key={index} className="ingredient-tag" onClick={() => removeIngredient(index)}>
              {ingredient}
              <span className="close-button">×</span>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Press Enter after each ingredient"
            className="ingredient-input-field"
          />
        </div>
        <button onClick={generateMenu} className="generate-button">
          Generate Menu
        </button>
      </div>
      {/* Display Generated Menu */}
      <div className="generated-menu">
        {/* Render generated recipes */}
      </div>
    </div>
  );
};

export default IngredientSelection;
