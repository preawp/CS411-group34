import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import IngredientSelection from './Components/IngredientSelection';
import LoginPage from './Components/LoginPage';
import { GoogleLogin } from 'react-google-login';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = (googleUser) =>  {
    // Handle sign-in process, set isLoggedIn to true upon successful authentication
    setIsLoggedIn(true);

    console.log('Login successful! Navigating to next page...');

    // You can access user information from googleUser object
    console.log('Logged in user:', googleUser);
  };

  const handleSignOut = () => {

    console.log('Logout successful! Navigating to next page...');

    // Handle sign-out process, set isLoggedIn to false upon successful sign-out
    setIsLoggedIn(false);
  };

  const onFailure = (error) => {
    console.log('Login failed:', error);
  };

  return (
    <div className="App">
      <Header />
      {isLoggedIn ? (
        <>
          <IngredientSelection />
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          {/* Display Google login button */}
          <GoogleLogin
            clientId="342236352531-9djnv5q03jlfb7amogjmb2j6l7pf3lme.apps.googleusercontent.com" // Replace with your Google OAuth client ID
            buttonText="Login with Google"
            onSuccess={handleSignIn}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            redirectUri="http://localhost:3000/auth/callback"
            uxMode="redirect"
          />
        </>
      )}
    </div>
  );
}

export default App;

//test changes

//test changes