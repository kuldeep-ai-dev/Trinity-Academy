import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Award, Target, Heart, User, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';
import styles from './AdvisoryBoard.module.css';

const AdvisoryBoard = () => {
    const [boardMembers, setBoardMembers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .from('advisory_board')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });
            if (data) setBoardMembers(data);
            setLoading(false);
        };
        fetchMembers();
    }, []);

    const getIcon = (index: number) => {
        switch (index % 3) {
            case 0: return <Award size={24} />;
            case 1: return <Target size={24} />;
            case 2: return <Heart size={24} />;
            default: return <User size={24} />;
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    const cardVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className={styles.page}>
            <PageHeader title="Our Advisory Board" subtitle="Visionaries shaping the future of education" />

            <div className="container section">
                <motion.div
                    className={styles.intro}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Expert <span>Guidance</span></h2>
                    <p>Our Advisory Board consists of eminent educationists and professionals who provide strategic direction and ensure our curriculum remains at the forefront of global standards.</p>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>
                        <Loader2 className="animate-spin" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ marginLeft: '0.75rem', fontWeight: 500 }}>Loading members...</span>
                    </div>
                ) : boardMembers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
                        <p style={{ margin: 0, fontWeight: 500 }}>No advisory board members listed currently.</p>
                    </div>
                ) : (
                    <motion.div
                        className={styles.boardGrid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {boardMembers.map((member, index) => (
                            <motion.div
                                key={member.id || index}
                                className={styles.memberCard}
                                variants={cardVariants}
                                whileHover={{ y: -10 }}
                            >
                                <div className={styles.iconCircle}>
                                    {member.image_url ? (
                                        <img src={member.image_url} alt={member.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        getIcon(index)
                                    )}
                                </div>
                                <div className={styles.content}>
                                    <h3>{member.name}</h3>
                                    <p className={styles.role}>{member.role}</p>
                                    <p className={styles.edu}>{member.edu}</p>
                                    <div className={styles.visionBox}>
                                        <p>"{member.vision}"</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdvisoryBoard;

