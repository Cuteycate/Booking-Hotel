
import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { loginWithFacebook } from '../utils/ApiFunctions'
import jwtDecode from 'jwt-decode';
const FacebookLoginButton = ({ onSuccess }) => {
  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const backendResponse = await loginWithFacebook(response.accessToken);
        const decoded = jwtDecode(response.accessToken);
        console.log("Decoded token:", decoded);
        onSuccess(backendResponse); // Handle success, e.g., store token, update state, etc.
      } catch (error) {
        console.error("Error during Facebook login:", error);
      }
    }
  };

  return (
    <FacebookLogin
      appId="1005717997798198"
      autoLoad={false}
      callback={responseFacebook}
      render={renderProps => (
        <button onClick={renderProps.onClick}>Login with Facebook</button>
      )}
    />
  );
};

export default FacebookLoginButton;
