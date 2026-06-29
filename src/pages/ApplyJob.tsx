import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { User, GraduationCap, Briefcase, FileText, Send, CheckCircle, ArrowLeft, ArrowRight, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import PageHeader from '../components/PageHeader';
import styles from './ApplyJob.module.css';

const ApplyJob = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const jobTitle = location.state?.jobTitle || "General Application";

    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const totalSteps = 4;

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            current_location: formData.get('location'),
            highest_degree: formData.get('degree'),
            institution: formData.get('institution'),
            grad_year: parseInt(formData.get('grad_year') as string),
            specialization: formData.get('specialization'),
            total_exp: parseInt(formData.get('exp') as string),
            current_org: formData.get('current_org'),
            role_description: formData.get('description'),
            cv_url: 'https://placeholder-storage.com', // In a real app, upload to Supabase Storage first
            job_title: jobTitle
        };

        const { error } = await supabase.from('job_applications').insert([data]);

        if (!error) {
            setIsSubmitted(true);
        } else {
            alert('Error submitting application: ' + error.message);
        }
        setLoading(false);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    if (isSubmitted) {
        return (
            <div className={styles.successWrapper}>
                <motion.div
                    className={styles.successCard}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <CheckCircle size={80} color="var(--secondary)" />
                    <h1>Application Sent!</h1>
                    <p>Thank you for your interest in joining Trinity Academy. We have received your application for the <strong>{jobTitle}</strong> position. Our HR team will review your profile and get back to you shortly.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <PageHeader title="Join Our Team" subtitle={`Applying for: ${jobTitle}`} />

            <div className="container section">
                <div className={styles.formContainer}>
                    {/* Progress Bar */}
                    <div className={styles.progressWrapper}>
                        <div className={styles.progressBar}>
                            <motion.div
                                className={styles.progressFill}
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step / totalSteps) * 100}%` }}
                            />
                        </div>
                        <div className={styles.stepIndicators}>
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`${styles.stepDot} ${s <= step ? styles.active : ''}`}>
                                    {s < step ? <CheckCircle size={16} /> : s}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <User className={styles.stepIcon} />
                                        <h3>Personal Information</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Full Name</label>
                                            <input name="full_name" type="text" placeholder="Enter your full name" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Email Address</label>
                                            <input name="email" type="email" placeholder="Enter your email" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Phone Number</label>
                                            <input name="phone" type="tel" placeholder="Enter your phone number" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Current Location</label>
                                            <input name="location" type="text" placeholder="City, State" required />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <GraduationCap className={styles.stepIcon} />
                                        <h3>Academic Qualifications</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Highest Degree</label>
                                            <input name="degree" type="text" placeholder="e.g. M.A. in English" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>University/College</label>
                                            <input name="institution" type="text" placeholder="Enter institution name" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Year of Graduation</label>
                                            <input name="grad_year" type="number" placeholder="YYYY" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Specialization</label>
                                            <input name="specialization" type="text" placeholder="e.g. Science, Mathematics" required />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <Briefcase className={styles.stepIcon} />
                                        <h3>Work Experience</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Total Years of Experience</label>
                                            <input name="exp" type="number" placeholder="Enter years" required />
                                        </motion.div>
                                        <motion.div className={styles.inputGroup} variants={itemVariants}>
                                            <label>Current Organization</label>
                                            <input name="current_org" type="text" placeholder="Enter current school/company" />
                                        </motion.div>
                                        <motion.div className={`${styles.inputGroup} ${styles.fullWidth}`} variants={itemVariants}>
                                            <label>Brief Description of Previous Roles</label>
                                            <textarea name="description" placeholder="Describe your experience..." rows={4}></textarea>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <FileText className={styles.stepIcon} />
                                        <h3>Review & CV Upload</h3>
                                    </div>
                                    <div className={styles.uploadBox}>
                                        <motion.div
                                            className={styles.uploadArea}
                                            variants={itemVariants}
                                        >
                                            <Upload size={32} />
                                            <p>Upload your CV/Resume (PDF/Doc)</p>
                                            <span className={styles.uploadBtn}>Select File</span>
                                            <input type="file" className={styles.fileInput} />
                                        </motion.div>
                                        <motion.div className={styles.disclaimer} variants={itemVariants}>
                                            <input type="checkbox" id="consent" required />
                                            <label htmlFor="consent">I confirm that the information provided is true and I authorize the school to contact me regarding this application.</label>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className={styles.formActions}>
                            {step > 1 && (
                                <button type="button" className={styles.btnPrev} onClick={prevStep}>
                                    <ArrowLeft size={18} /> Previous
                                </button>
                            )}
                            {step < totalSteps ? (
                                <button type="button" className="btn btn-primary" onClick={nextStep} style={{ marginLeft: 'auto' }}>
                                    Next Step <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-secondary" style={{ marginLeft: 'auto' }} disabled={loading}>
                                    {loading ? <Loader2 className="spinner" /> : 'Submit Application'} <Send size={18} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyJob;
