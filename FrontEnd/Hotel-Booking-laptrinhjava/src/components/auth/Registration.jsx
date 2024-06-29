import React, { useState } from "react";
import { registerUser } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import '../auth/LoginPage.css'

const Registration = () => {
    const [registration, setRegistration] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        const newErrors = {};
        
        if (!registration.firstName.trim()) {
            newErrors.firstName = "First name cannot be blank.";
        }
        if (!registration.lastName.trim()) {
            newErrors.lastName = "Last name cannot be blank.";
        }
        if (!registration.email.trim()) {
            newErrors.email = "Email cannot be blank.";
        } else if (!/\S+@\S+\.\S+/.test(registration.email)) {
            newErrors.email = "Email address is invalid.";
        }
        if (!registration.password.trim()) {
            newErrors.password = "Password cannot be blank.";
        } else if (registration.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setRegistration({ ...registration, [e.target.name]: e.target.value });
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const result = await registerUser(registration);
            setSuccessMessage(result);
            setErrorMessage("");
            setRegistration({ firstName: "", lastName: "", email: "", password: "" });
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(`Registration error: ${error.message}`);
        }
        
        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 5000);
    };

    return (
        <div className="login-page">
            <div className="wrapper">
           
           {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
           {successMessage && <p className="alert alert-success">{successMessage}</p>}

           <h2>Register</h2>
           <form onSubmit={handleRegistration}>
               <div className="mb-3 row">
                   <label htmlFor="firstName" className="col-sm-5 col-form-label">
                       First Name
                   </label>
                   <div className="col-sm-10 input-box ">
                       <input
                           id="firstName"
                           name="firstName"
                           type="text"
                           className="form-control"
                           value={registration.firstName}
                           onChange={handleInputChange}
                       />
                       {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                   </div>
               </div>

               <div className="mb-3 row">
                   <label htmlFor="lastName" className="col-sm-5 col-form-label">
                       Last Name
                   </label>
                   <div className="col-sm-10 input-box">
                       <input
                           id="lastName"
                           name="lastName"
                           type="text"
                           className="form-control"
                           value={registration.lastName}
                           onChange={handleInputChange}
                       />
                       {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                   </div>
               </div>

               <div className="mb-3 row">
                   <label htmlFor="email" className="col-sm-5 col-form-label">
                       Email
                   </label>
                   <div className="col-sm-10 input-box">
                       <input
                           id="email"
                           name="email"
                           type="email"
                           className="form-control"
                           value={registration.email}
                           onChange={handleInputChange}
                       />
                       {errors.email && <small className="text-danger">{errors.email}</small>}
                   </div>
               </div>

               <div className="mb-3 row">
                   <label htmlFor="password" className="col-sm-5 col-form-label">
                       Password
                   </label>
                   <div className="col-sm-10 input-box">
                       <input
                           type="password"
                           className="form-control"
                           id="password"
                           name="password"
                           value={registration.password}
                           onChange={handleInputChange}
                       />
                       {errors.password && <small className="text-danger">{errors.password}</small>}
                   </div>
               </div>

               <div className="mb-3">
                   <button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
                       Register
                   </button>
               </div>
               <div className="mb-3">
               <span style={{ marginLeft: "10px" }}>
                       Already have an account? <Link to={"/login"}>Login</Link>
                   </span>
               </div>
           </form>
    
   </div>
        </div>
    );
};

export default Registration;
