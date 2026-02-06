import { useState, useEffect } from 'react';
import './components.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './Login';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

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
            <h1>Digital Doggy</h1>
          </Link>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </div>

        <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/breeds" onClick={() => setMenuOpen(false)}>Breeds</Link>

          {token ? (
            <>
              <span className="user-info">
                <i className="fa-solid fa-circle-user"></i> Logged in
              </span>
              <button className="login-link" onClick={logout}>
                Logout
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
              Login
            </button>
          )}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;