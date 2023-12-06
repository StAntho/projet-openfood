import "../style/header.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "remixicon/fonts/remixicon.css";
import { useUser } from "./UserContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, dispatch } = useUser();
  const { userInfo } = state;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const logout = () => {
    dispatch({ type: "USER_SIGN_OUT" });
    localStorage.removeItem("userInfo");
  };

  return (
    <header className="header" id="header">
      <nav className="nav container">
        <NavLink onClick={closeMenu} to="/" className="nav__logo">
          Ratatouille
        </NavLink>

        <div
          className={`nav__menu active-link${isMenuOpen ? " show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list grid">
            <li className="nav__item">
              <NavLink
                onClick={closeMenu}
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav__link active-link" : "nav__link"
                }
              >
                <i className="ri-restaurant-line"></i> Produits
              </NavLink>
            </li>
            {userInfo && userInfo !== null && (
              <li className="nav__item">
                <NavLink
                  onClick={closeMenu}
                  to="/account"
                  className={({ isActive }) =>
                    isActive ? "nav__link active-link" : "nav__link"
                  }
                >
                  <i className="ri-account-circle-line"></i> Mon compte
                </NavLink>
              </li>
            )}
            {userInfo && userInfo.is_admin === 1 && (
              <li className="nav__item">
                <NavLink
                  onClick={closeMenu}
                  to="/admin"
                  className="nav__link"
                >
                  <i className="ri-settings-2-line"></i> Administration
                </NavLink>
              </li>
            )}
            {userInfo && userInfo !== null ? (
              <li className="nav__item">
                <NavLink onClick={logout} to="/" className="nav__link">
                  <i className="ri-logout-box-line"></i> Déconnexion
                </NavLink>
              </li>
            ) : (
              <li className="nav__item">
                <NavLink
                  onClick={closeMenu}
                  to="/inscription"
                  className={({ isActive }) =>
                    isActive ? "nav__link active-link" : "nav__link"
                  }
                >
                  <i className="ri-account-circle-line"></i> Inscription
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
