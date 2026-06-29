import { motion, AnimatePresence } from 'framer-motion';
import { Download as DownloadIcon, FileText, Loader2, Search, FileDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PageHeader from '../components/PageHeader';
import styles from './Downloads.module.css';

const Downloads = () => {
    const [downloads, setDownloads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchDownloads = async () => {
            const { data } = await supabase.from('downloads').select('*').order('category_name');
            if (data) setDownloads(data);
            setLoading(false);
        };
        fetchDownloads();
    }, []);

    // Get all unique categories dynamically
    const categories = React.useMemo(() => {
        const unique = Array.from(new Set(downloads.map(item => item.category_name).filter(Boolean)));
        return ['All', ...unique];
    }, [downloads]);

    // Apply search filter and selected category pill filter
    const filteredDownloads = React.useMemo(() => {
        return downloads.filter(item => {
            const matchesSearch =
                item.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'All' ||
                item.category_name === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [downloads, searchQuery, selectedCategory]);

    // Group the filtered downloads by category for rendering
    const groupedDownloads = React.useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        filteredDownloads.forEach(item => {
            const cat = item.category_name || 'General';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(item);
        });
        return groups;
    }, [filteredDownloads]);

    return (
        <div className={styles.page}>
            <PageHeader
                title="Downloads Center"
                subtitle="Access and download syllabus, admission forms, routines, calendars, and other essential documents."
            />

            <div className={`${styles.section}`}>
                {/* Search and Category Filter Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search documents by name, category, syllabus, etc..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {categories.length > 1 && (
                        <div className={styles.filterPills}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.pill} ${selectedCategory === cat ? styles.pillActive : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Documents Loader/List */}
                {loading ? (
                    <div className={styles.loader}>
                        <Loader2 className={styles.spin} size={30} /> Loading resources...
                    </div>
                ) : filteredDownloads.length === 0 ? (
                    <motion.div
                        className={styles.empty}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FileDown size={64} className={styles.emptyIcon} />
                        <h4>No Documents Found</h4>
                        <p>We couldn't find any documents matching your criteria. Try adjusting your search query or filters.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className={styles.downloadsGrid}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                    >
                        <AnimatePresence>
                            {Object.entries(groupedDownloads).map(([categoryName, files]) => (
                                <motion.div
                                    key={categoryName}
                                    className={styles.categoryGroup}
                                    variants={{
                                        hidden: { opacity: 0, y: 15 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <div className={styles.categoryHeader}>
                                        <FileText className={styles.categoryIcon} size={20} />
                                        <h3>{categoryName}</h3>
                                    </div>
                                    <div className={styles.fileList}>
                                        {files.map(file => (
                                            <div key={file.id} className={styles.fileCard}>
                                                <div className={styles.fileMeta}>
                                                    <div className={styles.docIconWrapper}>
                                                        <FileText size={22} />
                                                    </div>
                                                    <div className={styles.fileTextInfo}>
                                                        <span className={styles.fileName} title={file.file_name}>
                                                            {file.file_name}
                                                        </span>
                                                        <div className={styles.fileSubText}>
                                                            <span>Size:</span>
                                                            <span className={styles.sizeBadge}>
                                                                {file.file_size || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a
                                                    href={file.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={styles.downloadBtn}
                                                    title={`Download ${file.file_name}`}
                                                >
                                                    <DownloadIcon size={18} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Downloads;
