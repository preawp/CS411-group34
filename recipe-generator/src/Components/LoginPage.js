import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from 'jwt-decode';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateCurrentUser} from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onSignIn, }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(true); // Set to true to show registration fields
  const navigate = useNavigate();
  const [user, setUser] = useState({});


  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log('Registering user:', registerEmail, registerPassword);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      console.log('User registered:', user);
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };


  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log('User logged in:', userCredential.user);
      setUser(userCredential.user); // Save user info after login
      onSignIn();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      // Log Firebase error details for debugging
      // Check the Firebase documentation for possible error codes and their meanings
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
