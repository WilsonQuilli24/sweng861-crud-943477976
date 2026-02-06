import './pages.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Navbar />
      <main className="home-container">
        <section className="home-hero">
          <h1> Welcome to Digital Doggy 🐶 </h1>
          <p> Your ultimate platform to explore dog breeds, subbreeds, and more! </p>
          <Link to="/breeds" className="hero-btn"> Explore Breeds </Link>
        </section>

        <section className="home-cards">
          <div className="card">
            <h2>Breeds</h2>
            <p>Discover all dog breeds and their unique traits.</p>
            <Link to="/breeds" className="card-btn">View Breeds</Link>
          </div>
          <div className="card">
            <h2>About</h2>
            <p>Learn more about Digital Doggy and the creator.</p>
            <Link to="/about" className="card-btn">About Me</Link>
          </div>
          <div className="card">
            <h2>Contact</h2>
            <p>Have questions or feedback? Reach out!</p>
            <Link to="/contact" className="card-btn">Get in Touch</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;