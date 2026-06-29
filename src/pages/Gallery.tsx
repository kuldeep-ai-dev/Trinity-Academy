import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Grid, Layers, Loader2, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PageHeader from '../components/PageHeader';
import styles from './Gallery.module.css';

const Gallery = () => {
    const [items, setItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [lightboxItem, setLightboxItem] = useState<any | null>(null);
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        const fetchItems = async () => {
            const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
            if (data) {
                setItems(data);
                setFilteredItems(data);
                const cats = ['All', ...Array.from(new Set(data.map((d: any) => d.category).filter(Boolean)))];
                setCategories(cats as string[]);
            }
            setLoading(false);
        };
        fetchItems();
    }, []);

    useEffect(() => {
        setFilteredItems(activeFilter === 'All' ? items : items.filter(item => item.category === activeFilter));
    }, [activeFilter, items]);

    // Close lightbox on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxItem(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const catColor: Record<string, string> = {
        Campus: '#3b82f6', Sports: '#10b981', Events: '#f59e0b',
        Classroom: '#8b5cf6', All: 'var(--primary)'
    };

    return (
        <div className={styles.page}>
            <PageHeader
                title="School Gallery"
                subtitle="Glimpses of life, learning, and celebration at Trinity Academy."
            />

            <div className="container section">
                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.stat}>
                        <Grid size={20} />
                        <span>{items.length} Photos</span>
                    </div>
                    <div className={styles.stat}>
                        <Layers size={20} />
                        <span>{categories.length - 1} Categories</span>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filterSection}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.pill} ${activeFilter === cat ? styles.pillActive : ''}`}
                            style={activeFilter === cat ? { background: catColor[cat] || 'var(--primary)' } : {}}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className={styles.loader}><Loader2 className={styles.spin} size={28} /> Loading gallery...</div>
                ) : filteredItems.length === 0 ? (
                    <div className={styles.empty}>
                        <ImageIcon size={52} />
                        <p>No photos found in this category.</p>
                    </div>
                ) : (
                    <motion.div layout className={styles.masonryGrid}>
                        <AnimatePresence>
                            {filteredItems.map((item, i) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    className={`${styles.gridItem} ${i % 5 === 0 ? styles.wide : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.35, delay: i * 0.04 }}
                                    onClick={() => setLightboxItem(item)}
                                >
                                    <img src={item.src} alt={item.title} loading="lazy" />
                                    <div className={styles.itemOverlay}>
                                        <div className={styles.zoomIcon}><ZoomIn size={22} /></div>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.catPill} style={{ background: catColor[item.category] || '#64748b' }}>{item.category}</span>
                                            <h3>{item.title}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxItem && (
                    <motion.div
                        className={styles.lightboxOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxItem(null)}
                    >
                        <motion.div
                            className={styles.lightboxContent}
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.85 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.lightboxClose} onClick={() => setLightboxItem(null)}><X size={22} /></button>
                            <img src={lightboxItem.src} alt={lightboxItem.title} />
                            <div className={styles.lightboxCaption}>
                                <span className={styles.catPill} style={{ background: catColor[lightboxItem.category] || '#64748b' }}>{lightboxItem.category}</span>
                                <h3>{lightboxItem.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
