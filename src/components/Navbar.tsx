import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        {
            name: 'About Us',
            path: '/about',
            submenu: [
                { name: "Director's Message", path: '/about/director' },
                { name: "Principal's Message", path: '/about/principal' },
                { name: 'Management / Trust', path: '/about/management' },
                { name: 'Rules & Regulations', path: '/rules' },
            ]
        },
        { name: 'Academics', path: '/academics' },
        { name: 'Admission', path: '/admission' },
        { name: 'Facilities', path: '/facilities' },
        {
            name: 'Our Team',
            path: '/team',
            submenu: [
                { name: 'Advisory Board', path: '/team/advisory-board' },
                { name: 'Our Teachers', path: '/team/teachers' },
            ]
        },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
        { name: 'Downloads', path: '/downloads' },
        { name: 'Careers', path: '/career' },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.topBar}>
                <div className="container flex justify-between">
                    <div className={styles.topInfo}>
                        <span><Phone size={14} /> +91 70022 84176</span>
                        <span><Mail size={14} /> info@trinityacademysilapathar.com</span>
                    </div>
                    <div className={styles.topSocial}>
                        <Facebook size={14} />
                        <Twitter size={14} />
                        <Instagram size={14} />
                    </div>
                </div>
            </div>

            <nav className={styles.nav}>
                <div className={`container ${styles.navContainer}`}>
                    <Link to="/" className={styles.logoContainer}>
                        <img src={logo} alt="Trinity Academy" className={styles.logoImg} />
                        <div className={styles.logoText}>
                            <span className={styles.schoolName}>Trinity Academy</span>
                            <span className={styles.location}>A Senior Secondary School</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className={styles.desktopLinks}>
                        {navLinks.map((link) => (
                            <li key={link.name} className={styles.navItem}>
                                <Link
                                    to={link.path}
                                    className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                                >
                                    {link.name}
                                    {link.submenu && <ChevronDown size={14} />}
                                </Link>
                                {link.submenu && (
                                    <ul className={styles.dropdown}>
                                        {link.submenu.map((sub) => (
                                            <li key={sub.name}>
                                                <Link to={sub.path}>{sub.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.mobileNav}
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween' }}
                    >
                        <ul className={styles.mobileLinks}>
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    {link.submenu ? (
                                        <div className={styles.mobileSubmenuWrapper}>
                                            <span className={styles.mobileLinkParent}>{link.name}</span>
                                            <ul className={styles.mobileSubmenu}>
                                                {link.submenu.map((sub) => (
                                                    <li key={sub.name}>
                                                        <Link to={sub.path} onClick={() => setIsOpen(false)}>{sub.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <Link to={link.path} onClick={() => setIsOpen(false)}>{link.name}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
