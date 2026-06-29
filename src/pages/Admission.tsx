import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { FileText, CheckCircle, HelpCircle, ArrowRight, Download } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import styles from './Admission.module.css';

const Admission = () => {
    const steps = [
        { title: "Registration", desc: "Obtain and submit the registration form available at the school office or download online." },
        { title: "Interaction", desc: "A personal interaction with the student and parents will be scheduled." },
        { title: "Verification", desc: "Submission of required documents for verification." },
        { title: "Finalization", desc: "Payment of fees and completion of enrollment formalities." }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <PageHeader title="Admission Process" subtitle="Join the Trinity Academy Family" />

            <div className="container section">
                <div className={styles.admissionContent}>
                    <motion.div className={styles.intro} variants={itemVariants}>
                        <h2>Start Your <span>Academic Journey</span></h2>
                        <p>We welcome applications from students who are eager to learn and grow in our dynamic environment. Our admission process is transparent and designed to identify the potential in every child.</p>
                        <Link to="/admission/apply" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                            Apply for Admission <ArrowRight size={18} />
                        </Link>
                    </motion.div>

                    <motion.div
                        className={styles.stepsGrid}
                        variants={containerVariants}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className={styles.stepCard}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={styles.stepNumber}>{index + 1}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className={styles.infoSection}>
                        <motion.div
                            className={styles.documents}
                            variants={itemVariants}
                        >
                            <h3><FileText size={32} color="var(--primary)" /> Required Documents</h3>
                            <ul>
                                <motion.li variants={itemVariants}><CheckCircle size={20} /> Birth Certificate (Copy)</motion.li>
                                <motion.li variants={itemVariants}><CheckCircle size={20} /> Previous School Records / Transfer Certificate</motion.li>
                                <motion.li variants={itemVariants}><CheckCircle size={20} /> Passport Size Photographs (4)</motion.li>
                                <motion.li variants={itemVariants}><CheckCircle size={20} /> Aadhaar Card (Copy)</motion.li>
                                <motion.li variants={itemVariants}><CheckCircle size={20} /> Address Proof</motion.li>
                            </ul>
                        </motion.div>

                        <motion.div
                            className={styles.faqPreview}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className={styles.faqIconContainer}>
                                <HelpCircle size={48} color="var(--primary)" />
                            </div>
                            <h3>Have Questions?</h3>
                            <p>Check our FAQ section or contact the admission office directly for any assistance.</p>
                            <div className={styles.actions}>
                                <Link to="/admission/apply" className="btn btn-primary">
                                    Apply Online Now
                                </Link>
                                <button className="btn btn-accent">
                                    <Download size={18} /> Download PDF Form
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Admission;
