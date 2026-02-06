import './Components.css';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../useLocale';

function Footer() {
const navigate = useNavigate();
const { t } = useLocale();

    return (
        <footer>

            <div className='footer'>
                {t('footerCopyright')}
                <span> <a href="mailto:wgq5001@psu.edu" className="footer-link"> {t('footerContact')} </a> </span> | 
                <a href="https://github.com/wilsonquilli" target="_blank" className="footer-link">
                    GitHub
                </a>
            </div>

            <ul className="footer-links" aria-label="Footer navigation">
                <li onClick={() => navigate('/')}> {t('home')} </li>
                <li onClick={() => navigate('/about')}> {t('about')} </li>
                <li onClick={() => navigate('/breeds')}> {t('breeds')} </li>
            </ul>     
        </footer>
    );
}

export default Footer;
