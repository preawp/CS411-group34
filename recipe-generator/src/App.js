import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import IngredientSelection from './Components/IngredientSelection';
import LoginPage from './Components/LoginPage';
import RecipeDetailsPage from './Components/RecipeDetailsPage';
import { db, auth } from './firebase-Config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const logout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser({});
    navigate('/');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);

        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(prevUser => ({ ...prevUser, name: userData.name }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser({});
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    setIsLoggedIn(true);
  };

  const handleMoreInformation = (recipe_id) => {
    navigate(`/recipe-details/${recipe_id}`);
  };

  return (
    <div className="App">
      <Header user={user} onSignOut={logout} />
      {isLoggedIn && (
        <>
          {user.name ? (
            <>
              <h4>Welcome, {user.name}!</h4>
              <button onClick={logout}>Sign Out</button>
            </>
          ) : (
            <p>Loading...</p>
          )}
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
