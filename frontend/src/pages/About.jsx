import './pages.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { useLocale } from '../useLocale';

function About() {
  const { t } = useLocale();

  return (
    <>
      <Navbar />

      <main className="about-container">
        <section className="about-hero">
          <h1>{t('aboutTitle')}</h1>
          <p>{t('aboutIntro')}</p>
        </section>

        <section className="about-content">
          <section>
            <h2>{t('aboutMeTitle')}</h2>
            <p>{t('aboutMeBody')}</p>
            <img src = "/myfavdog.jpeg" alt = "My Favorite Dog" height = "250px" width = "200px"/>
          </section>

          <section>
            <h2>{t('projectVisionTitle')}</h2>
            <p>{t('projectVisionBody')}</p>
          </section>

          <section>
            <h2>{t('contactSocialsTitle')}</h2>
            <div className="social-buttons">
              <a
                href="https://www.linkedin.com/in/wilson-quilli-8469b4291/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn linkedin"
              >
                <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
              </a>
              <a
                href="https://github.com/wilsonquilli"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn github"
              >
                <FontAwesomeIcon icon={faGithub} /> GitHub
              </a>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;