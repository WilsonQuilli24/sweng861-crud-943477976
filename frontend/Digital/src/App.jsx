import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Breeds from './pages/Breeds.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import BreedDetail from "./pages/BreedDetail.jsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/"); 
      navigate("/");
    } else if (window.location.pathname === "/auth/callback") {
      alert("Login failed. Please try again.");
      navigate("/"); 
    }
  }, [navigate]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/breeds" element={<Breeds />} />
        <Route path="/breeds/:id" element={<BreedDetail />} />
      </Routes>
    </>
  );
}

export default App;