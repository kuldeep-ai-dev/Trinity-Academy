import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, GraduationCap, Microscope, Pencil, Globe } from 'lucide-react';
import styles from './LoadingScreen.module.css';
import logo from '../assets/logo.png';

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 28); // Approx 2.8s to reach 100 (within 3s splash)
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const eduIcons = [
        { Icon: Book, delay: 0, x: -150, y: -100 },
        { Icon: GraduationCap, delay: 0.2, x: 150, y: -120 },
        { Icon: Microscope, delay: 0.4, x: -180, y: 120 },
        { Icon: Pencil, delay: 0.6, x: 200, y: 100 },
        { Icon: Globe, delay: 0.8, x: 0, y: -200 },
    ];

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className={styles.loader}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Mesh Gradient Background */}
                    <div className={styles.meshBg} />

                    {/* Floating Educational Icons */}
                    {eduIcons.map(({ Icon, delay, x, y }, index) => (
                        <motion.div
                            key={index}
                            className={styles.floatingIcon}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 0.4, 0.2],
                                scale: [0, 1.2, 1],
                                x: [x, x + 10, x - 10, x],
                                y: [y, y - 20, y + 20, y]
                            }}
                            transition={{
                                delay,
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <Icon size={40} />
                        </motion.div>
                    ))}

                    <div className={styles.mainContent}>
                        <div className={styles.logoWrapper}>
                            <motion.div
                                className={styles.logoCircle}
                                animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.img
                                src={logo}
                                alt="Trinity Academy"
                                className={styles.logo}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, type: "spring" }}
                            />
                        </div>

                        <div className={styles.textContent}>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Trinity Academy
                            </motion.h1>

                            <div className={styles.progressContainer}>
                                <div className={styles.percentage}>{progress}%</div>
                                <div className={styles.progressBar}>
                                    <motion.div
                                        className={styles.progressFill}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    Preparing your educational journey...
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footerBranding}>
                        <span>Nurturing Minds, Building Futures</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
