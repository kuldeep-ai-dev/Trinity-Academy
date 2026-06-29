import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Star } from 'lucide-react';
import styles from './AchievementsSection.module.css';

const achievements = [
    { title: "Best Science Academy", year: "2024", icon: <Trophy size={32} /> },
    { title: "100% Board Success", year: "2023", icon: <Award size={32} /> },
    { title: "Regional Sports Champions", year: "2024", icon: <Zap size={32} /> },
    { title: "Excellence in Arts", year: "2022", icon: <Star size={32} /> }
];

const AchievementsSection = () => {
    return (
        <section className="section bg-white">
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.subTitle}>Excellence Redefined</span>
                    <h2>Our <span>Achievements</span></h2>
                    <p>Proud moments that define our journey of excellence.</p>
                </div>
                <div className={styles.achievementsGrid}>
                    {achievements.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.achievementCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            whileHover={{ y: -15 }}
                        >
                            <div className={styles.achIcon} style={{ color: idx % 2 === 0 ? '#1a4789' : '#2d8a4e' }}>
                                {item.icon}
                            </div>
                            <span className={styles.year}>{item.year}</span>
                            <h4>{item.title}</h4>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AchievementsSection;
