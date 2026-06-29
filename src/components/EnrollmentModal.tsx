import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, Mail, MapPin, GraduationCap } from 'lucide-react';
import styles from './EnrollmentModal.module.css';

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        grade: '',
        phone: '',
        email: '',
        address: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Enrollment Data:', formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            onClose();
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div 
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={24} />
                        </button>

                        {!isSubmitted ? (
                            <div className={styles.modalContent}>
                                <div className={styles.header}>
                                    <h2>Admission <span>Enquiry</span></h2>
                                    <p>Please fill out the form below and we'll get back to you shortly.</p>
                                </div>

                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.inputGroup}>
                                        <label><User size={18} /> Student Name</label>
                                        <input 
                                            type="text" 
                                            name="studentName" 
                                            required 
                                            placeholder="Enter student's full name"
                                            value={formData.studentName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className={styles.grid}>
                                        <div className={styles.inputGroup}>
                                            <label><User size={18} /> Parent/Guardian Name</label>
                                            <input 
                                                type="text" 
                                                name="parentName" 
                                                required 
                                                placeholder="Enter parent's name"
                                                value={formData.parentName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label><GraduationCap size={18} /> Seeking Admission For</label>
                                            <select 
                                                name="grade" 
                                                required
                                                value={formData.grade}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Grade</option>
                                                <option value="nursery">Nursery</option>
                                                <option value="kg">KG</option>
                                                <option value="1">Class 1</option>
                                                <option value="2">Class 2</option>
                                                <option value="3">Class 3</option>
                                                <option value="4">Class 4</option>
                                                <option value="5">Class 5</option>
                                                <option value="6">Class 6</option>
                                                <option value="7">Class 7</option>
                                                <option value="8">Class 8</option>
                                                <option value="9">Class 9</option>
                                                <option value="10">Class 10</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.grid}>
                                        <div className={styles.inputGroup}>
                                            <label><Phone size={18} /> Phone Number</label>
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                required 
                                                placeholder="Enter phone number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label><Mail size={18} /> Email Address</label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                placeholder="Enter email address"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label><MapPin size={18} /> Address</label>
                                        <textarea 
                                            name="address" 
                                            rows={3} 
                                            placeholder="Enter your full address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full">
                                        Submit Application <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>
                                    <Send size={48} />
                                </div>
                                <h3>Submission Successful!</h3>
                                <p>Thank you for your interest in Trinity Academy. Our admissions team will contact you soon.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EnrollmentModal;
