import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from 'jwt-decode';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth } from './firebaseConfig';

const LoginPage = ({ onSignIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true); // Set to true to show registration fields
  const [user, setUser] = useState({});

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      console.log('User registered:', user);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
      // User successfully logged in
    } catch (error) {
      console.log('Login error:', error.message);
    }
  };
  
  
  

  function handleCallbackResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    setIsLoggedIn(true);
    onSignIn();
  }


  const handleRegistration = (e) => {
    e.preventDefault();
    console.log('Registering user:', registerEmail, registerPassword);
    // Perform registration logic using registerEmail and registerPassword
    setRegisterEmail('');
    setRegisterPassword('');
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: '342236352531-9djnv5q03jlfb7amogjmb2j6l7pf3lme.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });
  }, []);

  return (
    <div className="login-container">
      <form className="login-form">
        {/* Input fields for email and password */}
        <div>
          {/* Login fields */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button onClick={handleEmailLogin}>Login with Email</button>
          </div>

          {/* Registration fields */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={handleRegistration}>Register</button>
          </div>
        </div>

        {/* Google login button */}
        <div id="signInDiv"></div>
      </form>
    </div>
  );
};

export default LoginPage;
