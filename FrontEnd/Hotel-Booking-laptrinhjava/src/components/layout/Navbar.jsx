import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logout from "../auth/Logout"
const NavBar = () => {
  const [showAccount, setShowAccount] = useState(false);
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register')
  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };
  const isLoggedIn = localStorage.getItem("token")
	const userRole = localStorage.getItem("userRole")


  const handleDropdownBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowAccount(false);
    }
  };

  
  const loginPageStyle = isAuthRoute
  ? {
      
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }
  : {
      backgroundImage: "none",
    };

  return (
    
  
      <nav className="navbar navbar-expand-lg bg-body-tertiary shadow sticky-top w-100">
      <div className="container-fluid" style={loginPageStyle} >
        <Link to={"/"} className="navbar-brand">
          <span className="hotel-color">Penacony Hotel</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to={"/browse-all-rooms"}>
                Xem tất cả phòng
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to={"/blogs"}>
                Bài Viết
              </NavLink>
            </li>
            {isLoggedIn && userRole === "ROLE_ADMIN" && (
							<li className="nav-item">
								<NavLink className="nav-link" aria-current="page" to={"/admin"}>
									Admin
								</NavLink>
							</li>
						)}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to={"/find-booking"}>
                Tìm booking
              </NavLink>
            </li>
            <li className="nav-item dropdown" onBlur={handleDropdownBlur}>
              <a
                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded={showAccount ? "true" : "false"}
                onClick={handleAccountClick}
              >
                Tài Khoản
              </a>
              <ul className={`dropdown-menu ${showAccount ? "show" : ""}`} aria-labelledby="navbarDropdown">
              {isLoggedIn ? (
									<Logout />
								) : (
									<li>
										<Link className="dropdown-item" to={"/login"}>
											Đăng Nhập
										</Link>
									</li>
								)}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    
  );
};

export default NavBar;
