import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from 'jwt-decode';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db  } from '../firebase-Config';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getFirestore, collection, getDoc } from 'firebase/firestore';
import { GOOGLE_CLIENT_ID } from './config';

<script src="https://accounts.google.com/gsi/client"></script>

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
  const [name, setName] = useState('');

  
  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log('Registering user:', registerEmail, registerPassword);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      console.log('User registered:', user);
  
      const userId = user.uid;
      const userDocRef = doc(db, 'users', userId);
  
    
      await setDoc(userDocRef, {
        email: registerEmail,
        name: name,
      });
  
      setRegisterEmail('');
      setRegisterPassword('');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); 

    } catch (error) {
      console.error('Registration error:', error);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000); 
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
        
        
        const userId = userData.uid;
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
  
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
  

          setUser(prevState => ({ ...prevState, name: userData.name }));
        }
  
        onSignIn(userData);
        navigate('/');
      } else {
        console.error('User data not available');
      }
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000); 
    }
  };
  
  
  const fetchUserName = async () => {
    try {
      if (user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser(prevUser => ({ ...prevUser, name: userData.name })); // Merge name with existing user data
        } else {
          console.log('User document does not exist');
        }
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        fetchUserName();
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
      client_id: GOOGLE_CLIENT_ID,
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

            <input
              type="email"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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