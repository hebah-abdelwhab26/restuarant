import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "react-use-cart";
import { useFavorites } from "../Favorites/FavoritesContext";

const API_URL = "https://restaurant.hebahgift.com/api";

function readAuthUser() {
  const raw =
    sessionStorage.getItem("auth_user") ||
    localStorage.getItem("auth_user");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readAuthToken() {
  return (
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(() => readAuthUser());
  const [animateFav, setAnimateFav] = useState(false);

  const accountRef = useRef(null);

  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const refreshAuth = useCallback(() => {
    setUser(readAuthUser());
    setAccountOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("auth-changed", refreshAuth);
    window.addEventListener("storage", refreshAuth);

    return () => {
      window.removeEventListener("auth-changed", refreshAuth);
      window.removeEventListener("storage", refreshAuth);
    };
  }, [refreshAuth]);

  useEffect(() => {
    if (favorites.length > 0) {
      setAnimateFav(true);
      const timer = setTimeout(() => setAnimateFav(false), 300);
      return () => clearTimeout(timer);
    }
  }, [favorites.length]);

  // إغلاق قائمة الحساب عند النقر خارجها
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const handleAccountLink = () => {
    closeMenu();
  };

  const handleLogout = async () => {
    const token = readAuthToken();

    try {
      if (token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );
      }
    } catch (error) {
      console.error(
        "Logout API request failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("user");

      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("user");

      setUser(null);
      closeMenu();
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="header" data-header="">
      <div className="container">
        {/* الشعار */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src="./assets/images/logo.svg"
            width={160}
            height={50}
            alt="Grilli - Home"
          />
        </Link>

        {/* القائمة الرئيسية */}
        <nav
          className={`navbar ${menuOpen ? "active" : ""}`}
          data-navbar=""
        >
          <button
            type="button"
            className="close-btn"
            aria-label="close menu"
            onClick={closeMenu}
          >
            ✕
          </button>

          <Link to="/" className="logo" onClick={closeMenu}>
            <img
              src="./assets/images/logo.svg"
              width={160}
              height={50}
              alt="Grilli - Home"
            />
          </Link>

          <ul className="navbar-list">
            {/* الرئيسية */}
            <li className="navbar-item">
              <Link
                to="/"
                className="navbar-link hover-underline"
                onClick={closeMenu}
              >
                <div className="separator" />
                <span className="span">Home</span>
              </Link>
            </li>

            {/* قائمة الطعام */}
            <li className="navbar-item">
              <Link
                to="/menus"
                className="navbar-link hover-underline"
                onClick={closeMenu}
              >
                <div className="separator" />
                <span className="span">Menus</span>
              </Link>
            </li>

            {/* من نحن */}
            <li className="navbar-item">
              <a
                href="/#about"
                className="navbar-link hover-underline"
                onClick={closeMenu}
              >
                <div className="separator" />
                <span className="span">About Us</span>
              </a>
            </li>

            {/* العروض */}
            <li className="navbar-item">
              <a
                href="/#offer"
                className="navbar-link hover-underline"
                onClick={closeMenu}
              >
                <div className="separator" />
                <span className="span">Offer</span>
              </a>
            </li>

            {/* قائمة الحساب */}
            <li
              className="navbar-item account-menu-item"
              ref={accountRef}
            >
              <button
                type="button"
                className="account-menu-trigger"
                aria-haspopup="true"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <ion-icon name="person-circle-outline" />
                <span>
                  {user ? user.name || "My Account" : "Account"}
                </span>
                <ion-icon
                  name={accountOpen ? "chevron-up-outline" : "chevron-down-outline"}
                  style={{ fontSize: "14px" }}
                />
              </button>

              {accountOpen && (
                <div className="account-dropdown">
                  {user ? (
                    <>
                      <div className="account-dropdown-name">
                        {user.name || "My Account"}
                      </div>

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="account-dropdown-link"
                          onClick={handleAccountLink}
                        >
                          <ion-icon name="grid-outline" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        className="account-dropdown-link"
                        onClick={handleLogout}
                      >
                        <ion-icon name="log-out-outline" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="account-dropdown-link"
                        onClick={handleAccountLink}
                      >
                        <ion-icon name="log-in-outline" />
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/register"
                        className="account-dropdown-link"
                        onClick={handleAccountLink}
                      >
                        <ion-icon name="person-add-outline" />
                        <span>Register</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </li>

            {/* المفضلة */}
            <li className="navbar-item" style={{ position: "relative" }}>
              <Link
                to="/favorites"
                className="navbar-link hover-underline"
                aria-label="Favorites"
                onClick={closeMenu}
              >
                <ion-icon
                  name="heart"
                  style={{ fontSize: "22px", color: "red" }}
                />

                {favorites.length > 0 && (
                  <span
                    className={animateFav ? "counter-animate" : ""}
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-8px",
                      background: "black",
                      color: "#fff",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {favorites.length}
                  </span>
                )}
              </Link>
            </li>

            {/* سلة المشتريات */}
            <li className="navbar-item" style={{ position: "relative" }}>
              <Link
                to="/cart"
                className="navbar-link hover-underline"
                aria-label="Shopping cart"
                onClick={closeMenu}
              >
                <div className="separator" />

                <ion-icon
                  name="cart-outline"
                  style={{ fontSize: "28px", color: "#fcf8f8" }}
                />

                {totalItems > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      background: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      fontSize: "12px",
                      padding: "2px 6px",
                      lineHeight: "1",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* معلومات الاتصال */}
          <div className="text-center">
            <p className="headline-1 navbar-title">Visit Us</p>

            <address className="body-4">
              Restaurant St, Delicious City, <br />
              London 9578, UK
            </address>

            <p className="body-4 navbar-text">
              Open: 9.30 am - 2.30pm
            </p>

            <a
              href="mailto:booking@grilli.com"
              className="body-4 sidebar-link"
            >
              booking@grilli.com
            </a>
          </div>
        </nav>

        {/* زر حجز الطاولة */}
        <a href="/#reserv" className="btn btn-secondary">
          <span className="text text-1">Find A Table</span>
          <span className="text text-2" aria-hidden="true">
            Find A Table
          </span>
        </a>

        {/* زر فتح القائمة على الشاشات الصغيرة */}
        <button
          type="button"
          className="nav-open-btn"
          aria-label="open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className="line line-1" />
          <span className="line line-2" />
          <span className="line line-3" />
        </button>

        {menuOpen && (
          <div className="overlay active" onClick={closeMenu} />
        )}
      </div>
    </header>
  );
}

