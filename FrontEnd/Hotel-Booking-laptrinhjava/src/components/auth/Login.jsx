import React, { useState } from "react";
import { loginUser, loginWithGoogle, loginWithFacebook } from "../utils/ApiFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import jwtDecode from "jwt-decode";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();
    const redirectUrl = location.state?.path || "/";

    const handleInputChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await loginUser(login);
        if (success) {
            const token = success.token;
            auth.handleLogin(token);
            navigate(redirectUrl, { replace: true });
        } else {
            setErrorMessage("Invalid username or password. Please try again.");
        }
        setTimeout(() => {
            setErrorMessage("");
        }, 4000);
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        console.log("Google credential response: ", credentialResponse);
        const decoded = jwtDecode(credentialResponse.credential);
        const success = await loginWithGoogle(credentialResponse.credential);
        if (success) {
            const token = success.token;
            auth.handleLogin(token);
            navigate(redirectUrl, { replace: true });
        } else {
            setErrorMessage("Google login failed. Please try again.");
        }
    };

    const handleFacebookLogin = async (response) => {
        if (response.accessToken) {
            try {
                console.log("Facebook access token:", response.accessToken);
                // Decode token (if needed for debugging)
                // const decoded = jwtDecode(response.accessToken);
                // console.log("Decoded token:", decoded);
                const backendResponse = await loginWithFacebook(response.accessToken);
                if (backendResponse && backendResponse.token) {
                    const token = backendResponse.token;
                    auth.handleLogin(token);
                    navigate(redirectUrl, { replace: true });
                } else {
                    setErrorMessage("Facebook login failed. Please try again.");
                }
            } catch (error) {
                console.error("Error during Facebook login:", error);
                setErrorMessage("Facebook login failed. Please try again.");
            }
        } else {
            console.error("No access token received from Facebook.");
            setErrorMessage("Facebook login failed. Please try again.");
        }
    };
    

    return (
        <section className="container col-6 mt-5 mb-5">
            {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">
                        Email
                    </label>
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            value={login.email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <label htmlFor="password" className="col-sm-2 col-form-label">
                        Password
                    </label>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            value={login.password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
                        Login
                    </button>
                    <span style={{ marginLeft: "10px" }}>
                        Don't have an account yet? <Link to={"/register"}> Register</Link>
                    </span>
                </div>
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                        setErrorMessage("Google login failed. Please try again.");
                    }}
                />
                <FacebookLogin
                    appId="1005717997798198"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={handleFacebookLogin}
                    cssClass="btn btn-facebook"
                    icon="fa-facebook"
                    textButton="&nbsp;&nbsp;Login with Facebook"
                />
            </form>
        </section>
    );
};

export default Login;
