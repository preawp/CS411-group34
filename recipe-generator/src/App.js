// App.js
import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import IngredientSelection from './Components/IngredientSelection';
import SignInCallback from './Components/SignInCallback';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from "jwt-decode";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ user, setUser ] = useState({});

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    setIsLoggedIn(true);
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;

  }
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "342236352531-9djnv5q03jlfb7amogjmb2j6l7pf3lme.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );
  }, []);

  const handleSignIn = (googleUser) => {
    setIsLoggedIn(true);
    console.log('Login successful! Navigating to the next page...');
    console.log('Logged in user:', googleUser);
  };


  const onFailure = (error) => {
    console.log('Login failed:', error);
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
                <div id="signInDiv"></div>
              )
            }
          />
          <Route path="/recipe-details/:id" element={<RecipeDetailsPage />} />
          {/* Add more routes for other pages */}
        </Routes>
      </div>

    // <div className="App">
    //   <div id="signInDiv"></div>
    //   {}
    //   { user &&
    //     <div>
    //       <img src={user.picture}></img>
    //     </div>
    //   }
    // </div>
  );
}

export default App;