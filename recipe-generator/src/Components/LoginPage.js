import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from 'jwt-decode';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase-Config';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onSignIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [user, setUser] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log('Registering user:', registerEmail, registerPassword);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      console.log('User registered:', user);
      setRegisterEmail('');
      setRegisterPassword('');
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Registration error:', error);
      setShowErrorMessage(true); // Show error message
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000); // Hide error message after 3 seconds
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log('User logged in:', userCredential.user);
      const userData = userCredential.user;

      if (userData && userData.email) {
        setUser(userData);
        onSignIn(userData);
        navigate('/');
      } else {
        console.error('User data not available');
      }
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      setShowErrorMessage(true); // Show error message for login failure
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000); // Hide error message after 3 seconds
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      } else {
        setUser({});
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser({});
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
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
              placeholder="Password, minimum of 6 characters"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={handleRegistration}>Register</button>
          </div>
        </div>

        {/* Google login button */}
        <div id="signInDiv"></div>

    
        {/* Success and Error messages */}
        {showSuccessMessage && <div className="success-message">Registration Successful!</div>}
        {showErrorMessage && <div className="error-message">Registration/Login Failed. Please try again.</div>}
      </form>
    </div>
  );
};

export default LoginPage;
