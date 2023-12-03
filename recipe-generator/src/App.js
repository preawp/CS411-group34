// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import IngredientSelection from './Components/IngredientSelection';
import LoginPage from './Components/LoginPage';
import RecipeDetailsPage from './Components/RecipeDetailsPage';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [ user, setUser ] = useState({});

  const handleSignIn = () => {
    // Handle sign-in process, set isLoggedIn to true upon successful authentication
    setIsLoggedIn(true);
  };
  
  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  };

  const handleMoreInformation = (recipe_id) => {
    // Use navigate to go to the RecipeDetailsPage with the selected index
    navigate(`/recipe-details/${recipe_id}`);
  };

  return (
    <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <IngredientSelection handleMoreInformation={handleMoreInformation} />
              ) : (
                <LoginPage onSignIn={handleSignIn} />
              )
            }
          />
          <Route path="/recipe-details/:id" element={<RecipeDetailsPage />} />
          {/* Add more routes for other pages */}
        </Routes>
      </div>
  );
}

export default App;