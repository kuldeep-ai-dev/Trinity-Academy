import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Loader2, BellOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from './NewsSection.module.css';

const NewsSection = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const { data } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);
            if (data) setNews(data);
            setLoading(false);
        };
        fetchNews();
    }, []);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <motion.div
                        className={styles.headerTitle}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.badge}>School Updates</span>
                        <h2 className={styles.title}>Latest Announcements</h2>
                    </motion.div>
                    <motion.button
                        className={styles.viewAll}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        View All News <ArrowRight size={18} />
                    </motion.button>
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        <div className={styles.loader}>
                            <Loader2 className="spinner" size={32} color="var(--primary)" />
                            <span>Fetching latest updates...</span>
                        </div>
                    ) : news.length > 0 ? (
                        news.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={styles.newsCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div>
                                    <div className={styles.dateBadge}>
                                        <Calendar size={14} />
                                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <span className={styles.category}>{item.category || 'Announcement'}</span>
                                    <h3 className={styles.newsTitle}>{item.title}</h3>
                                </div>
                                <button className={styles.readMore}>
                                    Read Details <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className={styles.emptyState}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                        >
                            <BellOff size={48} strokeWidth={1} />
                            <h3>No new announcements</h3>
                            <p>Check back later for fresh updates from Trinity Academy.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
