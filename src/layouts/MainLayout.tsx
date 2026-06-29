import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import EnrollmentModal from '../components/EnrollmentModal';
import PromoPopup from '../components/PromoPopup';
import LoadingScreen from '../components/LoadingScreen';
import { supabase } from '../lib/supabaseClient';

const MainLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPromoVisible, setIsPromoVisible] = useState(false);
    const [bannerData, setBannerData] = useState<any>(null);

    useEffect(() => {
        // Initial application loading simulation
        const loaderTimer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(loaderTimer);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const fetchPromo = async () => {
                try {
                    const nowIso = new Date().toISOString();
                    const { data, error } = await supabase
                        .from('promo_banners')
                        .select('*')
                        .eq('is_active', true)
                        .lte('starts_at', nowIso)
                        .order('priority', { ascending: false })
                        .order('created_at', { ascending: false });

                    if (error) {
                        console.error('Error fetching promo banner:', error);
                        return;
                    }
                    if (data && data.length > 0) {
                        const active = data.find(b => !b.expires_at || new Date(b.expires_at) > new Date());
                        if (active) {
                            setBannerData(active);
                            const delay = active.display_delay_ms !== undefined ? active.display_delay_ms : 1500;
                            const timer = setTimeout(() => {
                                setIsPromoVisible(true);
                            }, delay);
                            return timer;
                        }
                    }
                } catch (err) {
                    console.error('Failed to get promo banner:', err);
                }
            };

            let timerId: any;
            fetchPromo().then(timer => {
                if (timer) timerId = timer;
            });

            return () => {
                if (timerId) clearTimeout(timerId);
            };
        }
    }, [isLoading]);

    const openModal = () => {
        setIsModalOpen(true);
        setIsPromoVisible(false); // Close promo if modal is opened
    };
    const closeModal = () => setIsModalOpen(false);
    const closePromo = () => setIsPromoVisible(false);

    return (
        <div className="layout">
            <LoadingScreen isLoading={isLoading} />
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    paddingTop: '120px',
                    minHeight: 'calc(100vh - 400px)',
                    transition: 'padding-top 0.3s ease'
                }}
            >
                <Outlet context={{ openModal }} />
            </motion.main>
            <Footer />
            <EnrollmentModal isOpen={isModalOpen} onClose={closeModal} />
            <PromoPopup
                isVisible={isPromoVisible}
                onClose={closePromo}
                onEnrollClick={openModal}
                bannerData={bannerData}
            />
        </div>
    );
};

export default MainLayout;
