import './components.css';

function LoginModal({ onClose }) {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5002/auth/login";
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Login dialog"
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Login to Digital Doggy 🐾</h3>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Login with Google
        </button>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LoginModal;