// Header.js

import React from 'react';
import './Header.css'; // Import your header styles
import user from './LoginPage';
const Header = () => {
  return (
    <header>
      <h1 className="satisfy-font">Recipe & Song</h1>
      <h4>Welcome!</h4>
        {user.email}
      {/* Add additional header content as needed */}
    </header>
  );
};

export default Header;
