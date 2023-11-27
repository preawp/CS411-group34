// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import IngredientSelection from './Components/IngredientSelection';
import SignInCallback from './Components/SignInCallback';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = (googleUser) => {
    setIsLoggedIn(true);
    console.log('Login successful! Navigating to the next page...');
    console.log('Logged in user:', googleUser);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    console.log('Logout successful! Navigating to the next page...');
  };

  const onFailure = (error) => {
    console.log('Login failed:', error);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Use the "element" prop */}
          <Route path="/auth/callback" element={<SignInCallback />} />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  <IngredientSelection />
                  <button onClick={handleSignOut}>Sign Out</button>
                </>
              ) : (
                <>
                  <GoogleLogin
                    clientId="342236352531-9djnv5q03jlfb7amogjmb2j6l7pf3lme.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={handleSignIn}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    redirectUri="http://localhost:3000/auth/callback"
                    uxMode="redirect"
                  />
                </>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;