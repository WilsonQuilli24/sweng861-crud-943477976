import './pages.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocale } from '../i18n.js';
import { apiFetch } from '../services/apiClient.js';

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

  const { t } = useLocale();

  return (
    <>
      <Navbar />

      <main className="breeds-container">
        <h1>{t('appName')} 🐾</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{t('breeds')}</h2>
          <Link to="/breeds/new" className="create-btn" aria-label={t('addNew')}>{t('addNew')}</Link>
        </div>

        {loading && <p className="loading">{t('loading')}</p>}
        {error && <p className="error">{t('couldNotLoad')}</p>}

        {!loading && !error && (
          <div className="breeds-grid">
            {breeds.map((b) => (
              <Link to={`/breeds/${b.id}`} key={b.id} className="breed-card">
                <img src={`https://dog.ceo/api/breed/${b.breed.toLowerCase()}/images/random`} alt={b.breed} onError={(e) => e.target.style.display = 'none'} />
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