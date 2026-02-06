import './Components.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
const navigate = useNavigate();

    return (
        <footer>

            <div className='footer'>
                &copy; 2026 Digital Doggy 
                <span onClick={() => navigate('/privacy')} className = "footer-link"> Privacy </span> | 
                <span onClick={() => navigate('/contact')} className = "footer-link"> Contact </span> |  
                <a href="https://github.com/wilsonquilli" target="_blank" className="footer-link">
                    GitHub
                </a>
            </div>

            <ul className="footer-links" aria-label="Footer navigation">
                <li onClick = {() => navigate('/Home')}> Home </li>
                <li onClick ={() => navigate('About')}> About </li>
                <li onClick = {() => navigate('Breeds')}> Breeds </li>
            </ul>     
        </footer>
    );
}

export default Footer;