import { Phone, Mail, MapPin, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import styles from './Contact.module.css';

const Contact = () => {
    return (
        <div>
            <PageHeader title="Contact Us" subtitle="Get in touch with us for any inquiries" />
            <div className="container section">
                <div className={styles.contactGrid}>
                    <div className={styles.infoCol}>
                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}><MapPin /></div>
                            <div>
                                <h3>Our Location</h3>
                                <p>Silapathar, Dhemaji, Assam - 787059</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}><Phone /></div>
                            <div>
                                <h3>Phone Number</h3>
                                <p>+91 70022 84176</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}><Mail /></div>
                            <div>
                                <h3>Email Address</h3>
                                <p>info@trinityacademysilapathar.com</p>
                                <p>admissions@trinityacademysilapathar.com</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}><Send /></div>
                            <div>
                                <h3>School Details</h3>
                                <p>ESTD. 2018 | Affiliated to ASSEB</p>
                                <p><strong>CODE:</strong> 08H2017</p>
                                <p><strong>Timings:</strong> 8:00 AM - 1:30 PM</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formCol}>
                        <div className={styles.formWrapper}>
                            <h2>Send us a <span>Message</span></h2>
                            <p>Fill out the form below and we'll get back to you as soon as possible.</p>

                            <form className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Full Name</label>
                                        <input type="text" placeholder="John Doe" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email Address</label>
                                        <input type="email" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Subject</label>
                                    <input type="text" placeholder="General Inquiry" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Message</label>
                                    <textarea rows={5} placeholder="Your message here..."></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Maps Embed */}
            <div className={styles.mapContainer}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.6337173697825!2d94.72311581158105!3d27.573875976160267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3740ecad721a6a05%3A0x61e2da93165c0cb7!2sTrinity%20Academy!5e0!3m2!1sen!2sin!4v1782724509463!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    style={{ border: 0, borderRadius: '1rem' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Trinity Academy Location"
                />
            </div>
        </div>
    );
};

export default Contact;
