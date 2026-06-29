import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import styles from './EventsSection.module.css';
import schoolEventsImg from '../assets/school_events.jpg';

const events = [
    { date: "15 Feb", title: "Annual Sports Day", time: "09:00 AM" },
    { date: "28 Feb", title: "Science Exhibition", time: "10:30 AM" },
    { date: "10 Mar", title: "Cultural Night", time: "06:00 PM" }
];

const listVariants = {
    visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

const EventsSection = () => {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.eventsContainer}>
                    <motion.div
                        className={styles.eventsContent}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className={styles.subTitle}>Upcoming Events</span>
                        <h2>School <span>Activities</span></h2>
                        <p>Stay updated with our latest happenings and cultural programs.</p>

                        <motion.div
                            className={styles.eventList}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={listVariants}
                        >
                            {events.map((event, idx) => (
                                <motion.div
                                    key={idx}
                                    className={styles.eventItem}
                                    variants={itemVariants}
                                >
                                    <div className={styles.eventDate}>
                                        <strong>{event.date.split(' ')[0]}</strong>
                                        <span>{event.date.split(' ')[1]}</span>
                                    </div>
                                    <div className={styles.eventInfo}>
                                        <h4>{event.title}</h4>
                                        <p><Calendar size={14} /> {event.time}</p>
                                    </div>
                                    <ArrowRight className={styles.eventArrow} />
                                </motion.div>
                            ))}
                        </motion.div>
                        <button className="btn btn-primary">View All Events</button>
                    </motion.div>
                    <motion.div
                        className={styles.eventsImage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div className={styles.imageDecoration}></div>
                        <div className={styles.imageWrapper}>
                            <img src={schoolEventsImg} alt="School Events" className={styles.roundedImg} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
