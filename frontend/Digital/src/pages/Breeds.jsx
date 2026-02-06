import './pages.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/apiClient.js';
import { Link } from "react-router-dom";

function Breeds() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const data = await apiFetch("/breeds");
        if (data) setBreeds(data);
      } catch (err) {
        console.error("Error fetching breeds:", err);
        setError("Failed to load breeds. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBreeds();
  }, []);

  return (
    <>
      <Navbar />

      <main className="breeds-container">
        <h1>Dog Breeds 🐾</h1>

        {loading && <p className="loading">Loading breeds...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="breeds-grid">
            {breeds.map((b) => (
              <Link to={`/breeds/${b.id}`} key={b.id} className="breed-card">
                <h2>{b.breed}</h2>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Breeds;