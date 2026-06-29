import PageHeader from '../components/PageHeader';
import { Book, Globe, Award, Clock } from 'lucide-react';
import styles from './Academics.module.css';

const Academics = () => {
    const levels = [
        { title: "Primary Education", icon: <Book />, desc: "Focusing on fundamental skills and social development." },
        { title: "Middle School", icon: <Globe />, desc: "Expanding horizons with diverse subjects and critical thinking." },
        { title: "Secondary School", icon: <Award />, desc: "Intensive academic preparation and career guidance." }
    ];

    return (
        <div>
            <PageHeader title="Academics" subtitle="Excellence in education since 2018" />
            <div className="container section">
                <div className={styles.intro}>
                    <h2>Our <span>Curriculum</span></h2>
                    <p>We follow a comprehensive curriculum that balances academic rigour with creative exploration, ensuring every student finds their path to success.</p>
                </div>

                <div className={styles.levelsGrid}>
                    {levels.map((level, index) => (
                        <div key={index} className={styles.levelCard}>
                            <div className={styles.iconBox}>{level.icon}</div>
                            <h3>{level.title}</h3>
                            <p>{level.desc}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.scheduleSection}>
                    <div className={styles.scheduleInfo}>
                        <h3><Clock size={24} /> School Hours</h3>
                        <ul className={styles.timeList}>
                            <li><span>Monday - Friday</span> <span>08:00 AM - 02:30 PM</span></li>
                            <li><span>Saturday</span> <span>08:00 AM - 12:30 PM</span></li>
                            <li><span>Sunday</span> <span>Closed</span></li>
                        </ul>
                    </div>
                    <div className={styles.examInfo}>
                        <h3>Academic Calendar</h3>
                        <p>Our academic year is divided into two terms with regular assessments and co-curricular activities planned throughout the year.</p>
                        <button className="btn btn-primary">Download Calendar 2026</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Academics;
