import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import styles from './Home.module.css';
import heroImg from '../assets/hero_campus.png';
import campusView2 from '../assets/campus_view_2.png';
import NewsSection from '../components/NewsSection';
import EventsSection from '../components/EventsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FacilitiesSection from '../components/FacilitiesSection';

interface LayoutContext {
    openModal: () => void;
}

const Home = () => {
    const { openModal } = useOutletContext<LayoutContext>();

    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContainer}`}>
                    <motion.div
                        className={styles.heroContent}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className={styles.badge}>ESTD. 2018 | AFFILIATED TO ASSEB</span>
                        <h1>Nurturing Minds, <span>Building Futures</span></h1>
                        <p>Empowering students with knowledge, values, and skills to excel in an ever-changing world. Join us on a journey of excellence.</p>
                        <div className={styles.heroBtns}>
                            <button className="btn btn-primary" onClick={openModal}>Enroll Now <ArrowRight size={18} /></button>
                            <button className="btn btn-accent">Explore Campus</button>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.heroImage}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={heroImg} alt="Trinity Academy Campus" className={styles.heroImg} />
                            <div className={styles.statCard}>
                                <Zap size={24} color="#f1c40f" />
                                <div>
                                    <strong>100%</strong>
                                    <span>Results</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Facilities Section */}
            <FacilitiesSection />

            {/* About Section Preview */}
            <section className="section">
                <div className={`container ${styles.aboutPreview}`}>
                    <motion.div
                        className={styles.aboutImage}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <img src={campusView2} alt="Trinity Academy Campus View" className={styles.roundedImg} />
                    </motion.div>
                    <motion.div
                        className={styles.aboutText}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.subTitle}>About Our School</span>
                        <h2>Excellence in <span>Every Aspect</span></h2>
                        <p>Trinity Academy Silapathar is dedicated to providing a nurturing environment where students are encouraged to reach their full potential. Our mission is to inspire academic excellence and moral integrity.</p>
                        <ul className={styles.list}>
                            <li><ShieldCheck size={18} /> Holistic Curriculum</li>
                            <li><ShieldCheck size={18} /> Modern Infrastructure</li>
                            <li><ShieldCheck size={18} /> Character Building</li>
                        </ul>
                        <button className="btn btn-secondary" onClick={openModal}>Learn More & Enroll</button>
                    </motion.div>
                </div>
            </section>

            <NewsSection />

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <h3>500+</h3>
                            <p>Students</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>40+</h3>
                            <p>Teachers</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>15+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div className={styles.statItem}>
                            <h3>100%</h3>
                            <p>Happy Parents</p>
                        </div>
                    </div>
                </div>
            </section>

            <EventsSection />
            <TestimonialsSection />
        </div>
    );
};

export default Home;
