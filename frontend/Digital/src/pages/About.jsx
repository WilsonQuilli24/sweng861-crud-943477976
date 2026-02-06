import './pages.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

function About() {
  return (
    <>
      <Navbar />

      <main className="about-container">
        <section className="about-hero">
          <h1>About Digital Doggy 🐶</h1>
          <p>
            Welcome to Digital Doggy: your go-to platform for all things dog breeds!
          </p>
        </section>

        <section className="about-content">
          <section>
            <h2>About Me</h2>
            <p>
              Hello! My name is Wilson Quilli. I'm a graduate student at Penn State World Campus.
              Working on this project for my SWENG 861 Course: Software Construction.
              I live in Philadelphia, PA, and a fun fact about me is that I have 3 dogs!
              This project is for me to get some more hands-on experience with both the backend and frontend, to later use in my final project.
              Thanks for reading and learn more about dogs in this website!
            </p>
          </section>

          <section>
            <h2>Project Vision</h2>
            <p>
              Digital Doggy is a fun project used to get hands-on experience with technologies,
              such as React and Google OAuth. On Digital Doggy, people can view Dog Breeds, who doesn't love Dogs!
            </p>
          </section>

          <section>
            <h2>Contact & Socials</h2>
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