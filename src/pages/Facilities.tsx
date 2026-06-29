import PageHeader from '../components/PageHeader';
import { BookOpen, Dumbbell, Shield, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Facilities.module.css';

const Facilities = () => {
    const facilityList = [
        {
            icon: <BookOpen />,
            title: "Library",
            desc: "A vast collection of books and digital resources with dedicated reading zones for students of all ages.",
            image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: <Monitor />,
            title: "Computer Lab",
            desc: "Advanced computing facility with high-speed internet and latest software for coding and creative design.",
            image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: <Dumbbell />,
            title: "Sports Complex",
            desc: "Includes a full-sized football field, cricket pitch, and indoor arenas for badminton and table tennis.",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: <Shield />,
            title: "CCTV Security",
            desc: "Round-the-clock monitoring and strict access control systems to ensure total campus safety.",
            image: "https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div>
            <PageHeader title="Our Facilities" subtitle="World-class infrastructure for holistic growth" />

            <div className="container section">
                <div className={styles.intro}>
                    <span className={styles.badge}>State-of-the-Art</span>
                    <h2>Modern <span>Infrastructure</span></h2>
                    <p>We provide a conducive environment equipped with the latest facilities to support academic, physical, and creative development. Every space is designed to inspire curiosity and excellence.</p>
                </div>

                <div className={styles.facilitiesGrid}>
                    {facilityList.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.facilityCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.cardImage}>
                                <img src={item.image} alt={item.title} />
                                <div className={styles.iconOverlay}>
                                    {item.icon}
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <button className={styles.btnLink}>View Details</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Call to Action Section */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2>Experience it Yourself</h2>
                        <p>Take a virtual tour or schedule a physical visit to see our facilities firsthand.</p>
                        <div className={styles.ctaBtns}>
                            <button className="btn btn-primary">Schedule Visit</button>
                            <button className="btn btn-accent">Virtual Tour</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Facilities;
