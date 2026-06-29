import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PromoPopup.module.css';
import promoGraphic from '../assets/admission_promo.png';

interface PromoPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onEnrollClick: () => void;
    bannerData: any;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ isVisible, onClose, onEnrollClick, bannerData }) => {
    const navigate = useNavigate();

    if (!bannerData) return null;

    const handleButtonClick = () => {
        if (bannerData.button_action === 'enroll') {
            onEnrollClick();
        } else if (bannerData.button_action) {
            if (bannerData.button_action.startsWith('http')) {
                window.open(bannerData.button_action, '_blank');
            } else {
                navigate(bannerData.button_action);
            }
            onClose();
        }
    };

    const renderTitle = (title: string, highlight: string) => {
        if (!highlight) return title;
        const index = title.toLowerCase().indexOf(highlight.toLowerCase());
        if (index === -1) return title;

        const before = title.substring(0, index);
        const match = title.substring(index, index + highlight.length);
        const after = title.substring(index + highlight.length);

        return (
            <>
                {before}
                <span>{match}</span>
                {after}
            </>
        );
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className={styles.overlay}>
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Close promotion">
                            <X size={24} />
                        </button>

                        <div className={styles.card}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={bannerData.image_url || promoGraphic}
                                    alt="Promotion Banner"
                                    className={styles.promoImg}
                                    onError={(e) => {
                                        // Fallback to default graphic if custom url fails to load
                                        (e.target as HTMLImageElement).src = promoGraphic;
                                    }}
                                />
                                {bannerData.badge_text && (
                                    <div className={styles.badge}>
                                        <Sparkles size={16} /> {bannerData.badge_text}
                                    </div>
                                )}
                            </div>

                            <div className={styles.content}>
                                <h2>{renderTitle(bannerData.title, bannerData.highlight_word)}</h2>
                                <p>{bannerData.description}</p>

                                <div className={styles.actions}>
                                    <button className="btn btn-primary" onClick={handleButtonClick}>
                                        {bannerData.button_text} <ArrowRight size={18} />
                                    </button>
                                    <button className={styles.maybeLater} onClick={onClose}>
                                        {bannerData.dismiss_text || 'Maybe Later'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PromoPopup;
