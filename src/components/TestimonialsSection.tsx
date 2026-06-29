import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import styles from './TestimonialsSection.module.css';

const testimonials = [
    {
        parent: "Rahul Sharma",
        role: "Parent of Class 8 Student",
        text: "Trinity Academy has provided my child with not just education, but a path to personal growth. The teachers are exceptional.",
        rating: 5
    },
    {
        parent: "Priya Das",
        role: "Parent of Class 5 Student",
        text: "The focus on co-curricular activities alongside academics is what makes this school stand out. Highly recommended!",
        rating: 5
    },
    {
        parent: "Amit Baruah",
        role: "Parent of Class 10 Student",
        text: "We've seen a remarkable shift in our son's confidence level since he joined Trinity. The environment is truly nurturing.",
        rating: 5
    }
];

const TestimonialsSection = () => {
    return (
        <section className="section bg-white">
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.subTitle}>Testimonials</span>
                    <h2>What <span>Parents Say</span> About Us</h2>
                    <p>Real stories from the Trinity Academy family.</p>
                </div>
                <div className={styles.testimonialsGrid}>
                    {testimonials.map((testi, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.testimonialCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                            whileHover={{ y: -10 }}
                        >
                            <Quote className={styles.quoteIcon} />
                            <p>"{testi.text}"</p>
                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < testi.rating ? "#f1c40f" : "none"} color="#f1c40f" />
                                ))}
                            </div>
                            <div className={styles.parentInfo}>
                                <strong>{testi.parent}</strong>
                                <span>{testi.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
