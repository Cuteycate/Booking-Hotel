import React, { useState } from "react";
import { registerUser } from "../utils/ApiFunctions"; // Import only the registerUser function
import { Link } from "react-router-dom";
import '../auth/LoginPage.css';

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
            newErrors.firstName = "Tên không được để trống.";
        }
        if (!registration.lastName.trim()) {
            newErrors.lastName = "Họ và Tên Đệm không khả dụng.";
        }
        if (!registration.email.trim()) {
            newErrors.email = "Email không được trống.";
        } else if (!/\S+@\S+\.\S+/.test(registration.email)) {
            newErrors.email = "Email phải đúng cú pháp.";
        }
        if (!registration.password.trim()) {
            newErrors.password = "Mất khẩu không được để trống..";
        } else if (registration.password.length < 6) {
            newErrors.password = "Mật Khẩu phải trên 6 ký tự.";
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
            await registerUser(registration);
            setSuccessMessage("Đăng ký thành công, Vui lòng kiểm tra Email của bạn để xác thực.");
            setErrorMessage("");
            setRegistration({ firstName: "", lastName: "", email: "", password: "" });
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(`Đăng ký không thành công : ${error.message}`);
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

                <h2>Đăng Ký</h2>
                <form onSubmit={handleRegistration}>
                    <div className="mb-3 row">
                        <label htmlFor="firstName" className="col-sm-5 col-form-label">
                            Tên 
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
                            Họ và Tên Đệm
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
                            Mật Khẩu
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
                            Đăng Ký
                        </button>
                    </div>
                    <div className="mb-3">
                        <span style={{ marginLeft: "10px" }}>
                            Đã có tài khoản? <Link to={"/login"}>Đăng Nhập</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;
