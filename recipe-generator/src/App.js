import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import IngredientSelection from './Components/IngredientSelection';
import LoginPage from './Components/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    // Handle sign-in process, set isLoggedIn to true upon successful authentication
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <Header />
      {isLoggedIn ? (
        <IngredientSelection />
      ) : (
        <LoginPage onSignIn={handleSignIn} />
      )}
    </div>
  );
}

export default App;
