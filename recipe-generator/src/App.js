// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import IngredientSelection from './Components/IngredientSelection';
import LoginPage from './Components/LoginPage';
import RecipeDetailsPage from './Components/RecipeDetailsPage';
import { auth } from './firebase-Config';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateCurrentUser} from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

function App() {

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [ user, setUser ] = useState({});

const logout = async () => {
    await signOut(auth);
    setIsLoggedIn(false); // Reset isLoggedIn state to false
    setUser({}); // Clear user information
    navigate("/"); // Redirect to the login page after signing out
  };

onAuthStateChanged(auth,(currentUser) => {
    setUser(currentUser);

  })

  const handleSignIn = () => {
    // Handle sign-in process, set isLoggedIn to true upon successful authentication
    setIsLoggedIn(true);
  };
  

  const handleMoreInformation = (recipe_id) => {
    // Use navigate to go to the RecipeDetailsPage with the selected index
    navigate(`/recipe-details/${recipe_id}`);
  };

  return (
    <div className="App">
    <Header user={user} onSignOut={logout} />
    {isLoggedIn && (
        <>
          <h4>Welcome{user?.email ? `, ${user.email}!` : ", Guest!"}</h4>
          {user?.email && <button onClick={logout}>Sign Out</button>}
        </>
      )}
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