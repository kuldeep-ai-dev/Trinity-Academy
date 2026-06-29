import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import styles from './AdmissionBanner.module.css';

interface AdmissionBannerProps {
    isVisible: boolean;
    onClose: () => void;
    onEnrollClick: () => void;
}

const AdmissionBanner: React.FC<AdmissionBannerProps> = ({ isVisible, onClose, onEnrollClick }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.banner}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                >
                    <div className={`container ${styles.container}`}>
                        <div className={styles.content}>
                            <div className={styles.iconBox}>
                                <Sparkles size={20} className={styles.sparkle} />
                            </div>
                            <div className={styles.text}>
                                <strong>Admissions Open 2026-27</strong>
                                <span>Join Trinity Academy for a journey of excellence and holistic growth!</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={`btn ${styles.enrollBtn}`} onClick={onEnrollClick}>
                                Enroll Now <ArrowRight size={16} />
                            </button>
                            <button className={styles.closeBtn} onClick={onClose} aria-label="Close banner">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdmissionBanner;
