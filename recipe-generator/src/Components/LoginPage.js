import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from "jwt-decode";


const LoginPage = ({ onSignIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ user, setUser ] = useState({});

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    setIsLoggedIn(true);
    onSignIn();
  };

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

  return (
    <div className="login-container">
      <form className="login-form">
        {/* Input fields for username and password */}
        <div id="signInDiv"></div>
      </form>
    </div>
  );
  }
export default LoginPage;
