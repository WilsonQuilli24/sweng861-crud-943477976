import { useState, useEffect } from 'react';
import './components.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './Login';
import { useLocale } from '../i18n.js';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <>
      <nav className="navbar-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src="/logo.jpg" alt="Digital Doggy Logo" />
            <h1>{t('appName') || 'Digital Doggy'}</h1>
          </Link>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </div>

        <div className={`nav-menu ${menuOpen ? "active" : ""}`} role="navigation" aria-label="Main navigation">
          <Link to="/" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>{t('about')}</Link>
          <Link to="/breeds" onClick={() => setMenuOpen(false)}>{t('breeds')}</Link>

          <div style={{ marginLeft: 8 }}>
            <label htmlFor="locale-select" className="sr-only">Language</label>
            <select
              id="locale-select"
              aria-label="Select language"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              style={{ padding: '6px', borderRadius: 6 }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          {token ? (
            <>
              <span className="user-info">
                <i className="fa-solid fa-circle-user"></i> Logged in
              </span>
              <button className="login-link" onClick={logout}>
                {t('logout')}
              </button>
            </>
          ) : (
            <button
              className="login-link"
              onClick={() => {
                setMenuOpen(false);
                setShowLogin(true);
              }}
            >
              {t('login')}
            </button>
          )}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;