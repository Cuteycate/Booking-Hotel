import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logout from "../auth/Logout"
import '../auth/LoginPage.css';
const NavBar = () => {
  const [showAccount, setShowAccount] = useState(false);

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };
  const isLoggedIn = localStorage.getItem("token")
	const userRole = localStorage.getItem("userRole")

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register')
	// Determine if the current route is not within the admin section

	 React.useEffect(() => {
    if (isAuthRoute) {
        document.body.classList.add('container-fluid');
    } else {
        document.body.classList.remove('container-fluid');
        document.body.style.overflow = 'unset';
    }
}, [isAuthRoute]);

  const handleDropdownBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowAccount(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow sticky-top w-100">
      <div className="container-fluid">
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
                Browse all rooms
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to={"/blogs"}>
                Blogs
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
                Account
              </a>
              <ul className={`dropdown-menu ${showAccount ? "show" : ""}`} aria-labelledby="navbarDropdown">
              {isLoggedIn ? (
									<Logout />
								) : (
									<li>
										<Link className="dropdown-item" to={"/login"}>
											Login
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
