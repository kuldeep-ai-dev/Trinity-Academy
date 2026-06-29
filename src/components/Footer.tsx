import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerGrid}`}>
                <div className={styles.schoolInfo}>
                    <img src={logo} alt="Logo" className={styles.footerLogo} />
                    <h3>Trinity Academy Silapathar</h3>
                    <p>A Senior Secondary School | ESTD. 2018 (AFFILIATED TO ASSEB)</p>
                    <p>Empowering students with knowledge, values, and skills to excel.</p>
                    <div className={styles.socialIcons}>
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className={styles.quickLinks}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/about"><ArrowRight size={14} /> About Us</Link></li>
                        <li><Link to="/academics"><ArrowRight size={14} /> Academics</Link></li>
                        <li><Link to="/admission"><ArrowRight size={14} /> Admission</Link></li>
                        <li><Link to="/gallery"><ArrowRight size={14} /> Gallery</Link></li>
                        <li><Link to="/contact"><ArrowRight size={14} /> Contact Us</Link></li>
                    </ul>
                </div>

                <div className={styles.contactInfo}>
                    <h4>School Information</h4>
                    <ul>
                        <li>
                            <MapPin size={20} />
                            <span>Silapathar, Dhemaji, Assam - 787059</span>
                        </li>
                        <li>
                            <Phone size={20} />
                            <span>+91 70022 84176</span>
                        </li>
                        <li>
                            <Mail size={20} />
                            <span>info@trinityacademysilapathar.com</span>
                        </li>
                        <li style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                            <span>SCHOOL CODE: 08H2017</span>
                        </li>
                        <li style={{ marginTop: '0.5rem' }}>
                            <span>Timings: 8:00 AM - 1:30 PM</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.newsletter}>
                    <h4>Stay Updated</h4>
                    <p>Subscribe to our newsletter for latest news and announcements.</p>
                    <form className={styles.newsletterForm}>
                        <input type="email" placeholder="Your Email Address" />
                        <button className="btn btn-accent">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={`container ${styles.bottomContainer}`}>
                    <p>&copy; {new Date().getFullYear()} Trinity Academy Silapathar. All Rights Reserved.</p>
                    <p className={styles.credit}>Made by <a href="https://www.mediageny.com" target="_blank" rel="noopener noreferrer">MEDIAGENY</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
