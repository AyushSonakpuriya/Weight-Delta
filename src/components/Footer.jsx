import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                {/* Top border accent */}
                <div className="site-footer__border" />

                <div className="site-footer__content">
                    {/* Brand column */}
                    <div className="site-footer__brand">
                        <div className="site-footer__brand-logo">
                            <img src="/weighing scale.png" alt="Weight Delta" />
                            <span className="site-footer__brand-name">Weight Delta</span>
                        </div>
                        <p className="site-footer__copyright">
                            © {new Date().getFullYear()} Weight Delta. All rights reserved.
                        </p>
                        <p className="site-footer__credit">
                            made with ❤️ by Ayush Sonakpuriya
                        </p>
                    </div>

                    {/* Link columns */}
                    <div className="site-footer__columns">
                        <div className="site-footer__column">
                            <h4 className="site-footer__column-title">Pages</h4>
                            <ul className="site-footer__column-list">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/calculator">Calculator</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/history">History</Link></li>
                            </ul>
                        </div>

                        <div className="site-footer__column">
                            <h4 className="site-footer__column-title">Socials</h4>
                            <ul className="site-footer__column-list">
                                <li><a href="https://github.com/AyushSonakpuriya" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                <li><a href="https://www.linkedin.com/in/ayush-sonakpuriya/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            </ul>
                        </div>

                        <div className="site-footer__column">
                            <h4 className="site-footer__column-title">Legal</h4>
                            <ul className="site-footer__column-list">
                                <li><a href="#disclaimer">Disclaimer</a></li>
                                <li><a href="#methodology">Methodology</a></li>
                                <li><a href="#limitations">Limitations</a></li>
                            </ul>
                        </div>

                        <div className="site-footer__column">
                            <h4 className="site-footer__column-title">Account</h4>
                            <ul className="site-footer__column-list">
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/signup">Sign Up</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Large background wordmark */}
                <div className="site-footer__wordmark" aria-hidden="true">
                    Weight Delta
                </div>
            </div>
        </footer>
    );
}
