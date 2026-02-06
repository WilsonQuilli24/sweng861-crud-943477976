import './pages.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import { useLocale } from '../useLocale';

function Home() {
  const { t } = useLocale();

  return (
    <>
      <Navbar />
      <main className="home-container">
        <section className="home-hero">
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <Link to="/breeds" className="hero-btn">{t('exploreBreeds')}</Link>
        </section>

        <section className="home-cards">
          <div className="card">
            <h2>{t('homeBreedsTitle')}</h2>
            <p>{t('homeBreedsBody')}</p>
            <Link to="/breeds" className="card-btn">{t('homeBreedsCta')}</Link>
          </div>
          <div className="card">
            <h2>{t('homeAboutTitle')}</h2>
            <p>{t('homeAboutBody')}</p>
            <Link to="/about" className="card-btn">{t('homeAboutCta')}</Link>
          </div>
          <div className="card">
            <h2>{t('homeContactTitle')}</h2>
            <p>{t('homeContactBody')}</p>
            <a href="mailto:wgq5001@psu.edu" className="card-btn">{t('homeContactCta')}</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
