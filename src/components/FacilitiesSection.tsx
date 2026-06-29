import { motion } from 'framer-motion';
import { BookOpen, Award, ShieldCheck, Monitor } from 'lucide-react';
import styles from './FacilitiesSection.module.css';

interface Facility {
    icon: React.ReactNode;
    title: string;
    desc: string;
    color: string;
}

const defaultFacilities: Facility[] = [
    {
        icon: <BookOpen size={32} />,
        title: "Quality Education",
        desc: "Comprehensive curriculum designed for holistic development of every child.",
        color: "var(--primary)"
    },
    {
        icon: <Monitor size={32} />,
        title: "Modern Labs",
        desc: "Equipped with the latest hardware and high-speed internet for tech learning.",
        color: "var(--secondary)"
    },
    {
        icon: <Award size={32} />,
        title: "Excellence Awards",
        desc: "A proven track record of academic and co-curricular achievements.",
        color: "var(--accent)"
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Safe Campus",
        desc: "Secure environment with modern safety standards and constant monitoring.",
        color: "#e74c3c"
    }
];

const FacilitiesSection = ({ title = "Our World-Class Facilities", subtitle = "Why Choose Trinity Academy?" }: { title?: string, subtitle?: string }) => {
    return (
        <section className="section bg-white">
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.subTitle}>{subtitle}</span>
                    <h2>{title}</h2>
                    <p>We provide a perfect blend of modern facilities and traditional values to nurture young minds.</p>
                </div>

                <div className={styles.facilitiesGrid}>
                    {defaultFacilities.map((facility, index) => (
                        <motion.div
                            key={index}
                            className={styles.facilityCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -12 }}
                        >
                            <div className={styles.iconWrapper} style={{ backgroundColor: `${facility.color}15` }}>
                                <div className={styles.iconInner} style={{ color: facility.color }}>
                                    {facility.icon}
                                </div>
                                <div className={styles.iconBg} style={{ backgroundColor: facility.color }}></div>
                            </div>
                            <h3>{facility.title}</h3>
                            <p>{facility.desc}</p>
                            <div className={styles.cardFooter}>
                                <div className={styles.line}></div>
                                <span className={styles.more}>Learn More</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FacilitiesSection;
