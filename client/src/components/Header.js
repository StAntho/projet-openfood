import "../style/header.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";

let v;
export default function Header({ test, setTest }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const loagout = () => {
    localStorage.removeItem("userInfo");
    setTest(localStorage.getItem("userInfo"));
  };

  useEffect(() => {
    if (typeof test === "object" && test !== null) {
      setRole(test.is_superuser);
    } else if (typeof test !== "object" && test !== null) {
      v = JSON.parse(test);
      setRole(v.is_superuser);
    } else if (typeof v === "undefined" || typeof v === []) {
      setRole("");
    }
  }, [test]);

  return (
    <header className="header" id="header">
      <nav className="nav container">
        <NavLink onClick={closeMenu} to="/" className="nav__logo">
          Mon Siège de Rêve
        </NavLink>

        <div
          className={`nav__menu active-link${isMenuOpen ? " show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list grid">
            <li className="nav__item">
              <NavLink onClick={closeMenu} to="/" className={({ isActive }) => (isActive ? "nav__link active-link" : "nav__link")}>
                <i className="ri-coupon-2-line"></i> Séances
              </NavLink>
            </li>
            {test !== null && (
              <li className="nav__item">
                <NavLink onClick={closeMenu} to="/account" className={({ isActive }) => (isActive ? "nav__link active-link" : "nav__link")}>
                  <i className="ri-account-circle-line"></i> Mon compte
                </NavLink>
              </li>
            )}
            {test !== null && role === true && (
              <li className="nav__item">
                <NavLink
                  onClick={closeMenu}
                  to="http://localhost:8000/admin"
                  target="_blank"
                  className="nav__link"
                >
                  <i className="ri-settings-2-line"></i> Administration
                </NavLink>
              </li>
            )}
            {test === null ? (
              <li className="nav__item">
                <NavLink
                  onClick={closeMenu}
                  to="/inscription"
                  className={({ isActive }) => (isActive ? "nav__link active-link" : "nav__link")}
                >
                  <i className="ri-account-circle-line"></i> Inscription
                </NavLink>
              </li>
            ) : (
              <li className="nav__item">
                <NavLink onClick={loagout} to="/" className="nav__link">
                  <i className="ri-logout-box-line"></i> Logout
                </NavLink>
              </li>
            )}
          </ul>

          <div className="nav__close" onClick={toggleMenu}>
            <i className="ri-close-line"></i>
          </div>
        </div>

        <div className="nav__buttons">
          <div className="nav__toggle" onClick={toggleMenu}>
            <i className="ri-menu-4-line"></i>
          </div>
        </div>
      </nav>
    </header>
  );
}
