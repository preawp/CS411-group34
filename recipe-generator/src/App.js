import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import IngredientSelection from './Components/IngredientSelection';
import LoginPage from './Components/LoginPage';
import { OAuthProvider, OAuthConsumer } from 'react-oauth';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    // Handle sign-in process, set isLoggedIn to true upon successful authentication
    setIsLoggedIn(true);
  };

  return (
    <OAuthProvider
      oauthKey="your_github_client_id"
      oauthSecret="your_github_client_secret"
      redirectUri="your_redirect_uri"
    >
      <div className="App">
        {/* Use OAuthConsumer to wrap the components that depend on user authentication */}
        <OAuthConsumer>
          {({ loading, error, data, login }) => {
            if (loading) return <p>Loading...</p>; // Display a loading message while OAuth is in progress
            if (error) return <p>Error: {error.message}</p>; // Display an error message if OAuth encounters an error

            if (data) {
              // User is logged in
              return (
                // Render the component for authenticated users
                <IngredientSelection />
              );
            } else {
              // User is not logged in
              return (
                // Render the component for non-authenticated users, passing the handleSignIn function as a prop
                <LoginPage onSignIn={handleSignIn} />
              );
            }
          }}
        </OAuthConsumer>

        {/* <Header />
        {isLoggedIn ? (
          <IngredientSelection />
        ) : (
          <LoginPage onSignIn={handleSignIn} />
        )} */}
      </div>
    </OAuthProvider>
  );
}

export default App;

//test changes

//test changes