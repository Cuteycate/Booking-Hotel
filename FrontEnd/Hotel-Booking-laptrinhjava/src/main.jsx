import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="850626381134-2noa9h0gt27jmtq5l3mltn867k3r26go.apps.googleusercontent.com">
    <App/>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
