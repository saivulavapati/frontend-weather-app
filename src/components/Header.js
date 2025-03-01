import React, { useState, useRef, useEffect} from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import weatherLogo from "../images/weatherLogo.webp"

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth(); 
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const profileName = user != null? user.split('@')[0]:"User"

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowOptions(false);
  }, [isAuthenticated]);


  return (
    <nav className="bg-light p-3 d-flex justify-content-between align-items-center shadow-sm">
      <img className="header-logo" src={weatherLogo} alt="logo"/>
      <h1 className="fs-5 mb-0 mx-2">Weather</h1>
      <div className="ms-auto d-flex align-items-center">
        {!isAuthenticated ? (
          <>
            <NavLink to="/register" className="btn btn-outline-primary mx-2">
              Register
            </NavLink>
            <NavLink to="/" className="btn btn-outline-primary mx-2">
              Login
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/favourites" className={({ isActive }) => 
              `mx-2 ${isActive ? "btn btn-primary" : ""}`
            }>
              Favourites
            </NavLink>

            <div className="position-relative" ref={dropdownRef}>
              <button 
                className="btn btn-outline-secondary mx-2 text-capitalize"
                onClick={() => setShowOptions(!showOptions)}
              >
                {profileName}
              </button>

              {showOptions && (
                <ul className="dropdown-menu show position-absolute" style={{ right: 0 }}>
                  <li className="mt-2">
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
