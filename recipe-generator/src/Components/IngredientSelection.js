import React, { useState } from 'react';
import './IngredientSelection.css'; // Ensure this path matches the location of your CSS file
import {useNavigate} from 'react-router-dom';
import DOMPurify from 'dompurify';

const IngredientSelection = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [generatedMenu, setGeneratedMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const generateMenu = async () => {

    const updateIngredientsUrl = 'http://localhost:5000/update-ingredients';
    const updateIngredientsData = {ingredients: selectedIngredients};

    try {
      setLoading(true);

      const updateIngredientsResponse = await fetch(updateIngredientsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateIngredientsData),
      });

      const updateIngredientsResult = await updateIngredientsResponse.json();
      console.log(updateIngredientsResult.message);

      const generateMenuUrl = 'http://localhost:5000/generate-menu';
      const generatedMenuResponse = await fetch(generateMenuUrl);
      if (generatedMenuResponse.ok) {
        const generatedMenuData = await generatedMenuResponse.json();
        console.log('Generated Menu Data:', generatedMenuData);
        setGeneratedMenu(generatedMenuData);
      } else {
        console.error('Error fetching generated menu:', generatedMenuResponse.status);
      }
    } catch (error) {
      console.error('Error updating ingredients:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleMoreInformation = (recipe_id) => {
    // Here, you can use the index to determine the selected recipe
    // and navigate to a new page with more information.
    // For now, let's just log the index.
    console.log('More Information clicked for recipe id:', recipe_id);
    navigate(`/recipe-details/${recipe_id}`)
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {generatedMenu.map((recipe, index) => (
              <li key={index}>
                <h3>{recipe[0]}</h3>
                <a href = {recipe[4]} target = "_blank" rel = "noopener noreferrer">
                  <img src = {recipe[4]} alt = "Recipe"/>
                </a>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(recipe[1])}}/>
                <p>{recipe[2].length > 0 ? `Missing Ingredients: ${recipe[2].join(', ')}`: 'Missing Ingredients: None!'}</p> 
                <button onClick={() => handleMoreInformation(recipe[5])}>
                  More Information
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default IngredientSelection;
