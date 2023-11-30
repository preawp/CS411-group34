// SignInCallback.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SignInCallback = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('Full URL:', window.location.href); // Log the full URL

    const handleSignInCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state'); // Include state validation if used

        if (code) {
          console.log('Authorization Code:', code);

          // Continue with the code exchange and user information retrieval
          try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code,
                client_id: '342236352531-9djnv5q03jlfb7amogjmb2j6l7pf3lme.apps.googleusercontent.com', // Replace with your actual client ID
                client_secret: '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', // Replace with your actual client secret
                redirect_uri: 'http://localhost:3000/auth/callback',
                grant_type: 'authorization_code',
              }),
            });

            if (!response.ok) {
              throw new Error(`Token request failed with status ${response.status}`);
            }

            const result = await response.json();
            console.log('Access Token and User Info:', result);

            // Process user information as needed

            // Redirect to the main page or any other desired route
            window.location.href = '/';
          } catch (tokenError) {
            console.error('Error fetching access token:', tokenError);
          }
        } else {
          console.error('No authorization code found in the URL.');
        }
      } catch (error) {
        console.error('Error handling Google Sign-In callback:', error);
      }
    };

    handleSignInCallback();
  }, [location]);

  return (
    <div>
      <p>Processing Google Sign-In callback...</p>
    </div>
  );
};

export default SignInCallback;