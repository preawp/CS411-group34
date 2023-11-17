import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login functionality
    // Simulate successful authentication, set isLoggedIn to true
    onSignIn();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        {/* Input fields for username and password */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
