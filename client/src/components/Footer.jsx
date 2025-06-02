import '../styles/Footer.css'
import { Link } from 'react-router';

export default function Footer() {



    return (
        <div className="footer">
            <div className="footer-content">
                <Link to='/founders' className='unstyled-link'>
                    <h5>© Order of The Dev 2025</h5>
                </Link>
            </div>
        </div>
    );
};
