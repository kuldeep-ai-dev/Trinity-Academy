import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, BookOpen, Send, CheckCircle, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import PageHeader from '../components/PageHeader';
import styles from './ApplyAdmission.module.css';

const ApplyAdmission = () => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Form State to preserve data across steps
    const [formData, setFormData] = useState({
        student_name: '',
        dob: '',
        gender: '',
        grade: '',
        father_name: '',
        mother_name: '',
        phone: '',
        email: '',
        school: '',
        last_grade: '',
        address: '',
        termsAccepted: false
    });

    const totalSteps = 4;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
        setValidationError(null);
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.student_name || !formData.dob || !formData.gender || !formData.grade) {
                setValidationError("Please fill all required student information.");
                return false;
            }
        } else if (currentStep === 2) {
            if (!formData.father_name || !formData.mother_name || !formData.phone || !formData.email) {
                setValidationError("Please fill all required parent/guardian details.");
                return false;
            }
        } else if (currentStep === 4) {
            if (!formData.termsAccepted) {
                setValidationError("You must agree to the terms and conditions to submit.");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, totalSteps));
            setValidationError(null);
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
        setValidationError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation check
        if (!validateStep(4)) return;

        setLoading(true);

        const data = {
            student_name: formData.student_name,
            dob: formData.dob,
            gender: formData.gender,
            grade: formData.grade,
            father_name: formData.father_name,
            mother_name: formData.mother_name,
            contact_primary: formData.phone,
            email: formData.email,
            previous_school: formData.school,
            last_grade: formData.last_grade,
            address: formData.address,
        };

        const { error } = await supabase.from('admission_applications').insert([data]);

        if (!error) {
            setIsSubmitted(true);
        } else {
            alert('Error submitting application: ' + error.message);
        }
        setLoading(false);
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
                    <h1>Application Submitted!</h1>
                    <p>Thank you for choosing Trinity Academy. Your application has been received and our admission team will contact you within 48 hours.</p>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Back to Home</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <PageHeader title="Apply for Admission" subtitle="Take the first step towards a bright future" />

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
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <User className={styles.stepIcon} />
                                        <h3>Student Information</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        <div className={styles.inputGroup}>
                                            <label>Full Name of Student</label>
                                            <input
                                                name="student_name"
                                                type="text"
                                                placeholder="Enter full name"
                                                required
                                                value={formData.student_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Date of Birth</label>
                                            <input
                                                name="dob"
                                                type="date"
                                                required
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Gender</label>
                                            <select name="gender" required value={formData.gender} onChange={handleInputChange}>
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Grade Applying For</label>
                                            <select name="grade" required value={formData.grade} onChange={handleInputChange}>
                                                <option value="">Select Grade</option>
                                                {[...Array(11)].map((_, i) => (
                                                    <option key={i} value={i + 1}>Class {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <Users className={styles.stepIcon} />
                                        <h3>Parent/Guardian Details</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        <div className={styles.inputGroup}>
                                            <label>Father's Name</label>
                                            <input
                                                name="father_name"
                                                type="text"
                                                placeholder="Enter father's name"
                                                required
                                                value={formData.father_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Mother's Name</label>
                                            <input
                                                name="mother_name"
                                                type="text"
                                                placeholder="Enter mother's name"
                                                required
                                                value={formData.mother_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Contact Number (Primary)</label>
                                            <input
                                                name="phone"
                                                type="tel"
                                                placeholder="Enter phone number"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Email Address</label>
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Enter email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <BookOpen className={styles.stepIcon} />
                                        <h3>Academic History</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        <div className={styles.inputGroup}>
                                            <label>Previous School Name</label>
                                            <input
                                                name="school"
                                                type="text"
                                                placeholder="Enter school name"
                                                value={formData.school}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Last Grade Completed</label>
                                            <input
                                                name="last_grade"
                                                type="text"
                                                placeholder="e.g. Class 3"
                                                value={formData.last_grade}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                            <label>Residential Address</label>
                                            <textarea
                                                name="address"
                                                placeholder="Enter full address"
                                                rows={3}
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={styles.formStep}
                                >
                                    <div className={styles.stepHeader}>
                                        <Send className={styles.stepIcon} />
                                        <h3>Review & Submit</h3>
                                    </div>
                                    <div className={styles.reviewBox}>
                                        <p>By submitting this form, you certify that all information provided is accurate to the best of your knowledge. Our admission office will review your application and schedule an interaction session.</p>
                                        <div className={styles.disclaimer}>
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                name="termsAccepted"
                                                required
                                                checked={formData.termsAccepted}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="terms">I agree to the school's terms and conditions regarding admission.</label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {validationError && (
                            <motion.div
                                className={styles.errorMessage}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AlertCircle size={16} /> {validationError}
                            </motion.div>
                        )}

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

export default ApplyAdmission;
