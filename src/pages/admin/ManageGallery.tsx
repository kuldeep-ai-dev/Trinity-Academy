import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Search, Loader2, Image as ImageIcon, Link, Type, X, Layers, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ManageGallery.module.css';

const CATEGORIES = ['Campus', 'Sports', 'Events', 'Classroom', 'Achievements', 'Cultural'];

const EMPTY_FORM = { src: '', title: '', category: '' };

const ManageGallery = () => {
    const [items, setItems] = React.useState<any[]>([]);
    const [filtered, setFiltered] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState(EMPTY_FORM);
    const [activeFilter, setActiveFilter] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);

    React.useEffect(() => { fetchItems(); }, []);

    React.useEffect(() => {
        let result = items;
        if (activeFilter !== 'All') result = result.filter(i => i.category === activeFilter);
        if (searchQuery) result = result.filter(i => i.title?.toLowerCase().includes(searchQuery.toLowerCase()));
        setFiltered(result);
    }, [activeFilter, searchQuery, items]);

    const fetchItems = async () => {
        setLoading(true);
        const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
        if (data) { setItems(data); setFiltered(data); }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bhrbsq6z';
            const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '822626638678112';
            const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'wUknWCPOUAbcdHjzivm6Swh_dFE';

            const timestamp = Math.floor(Date.now() / 1000).toString();

            // Signature generation parameters: timestamp
            const signatureString = `timestamp=${timestamp}${apiSecret}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(signatureString);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('api_key', apiKey);
            uploadFormData.append('timestamp', timestamp);
            uploadFormData.append('signature', signature);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: uploadFormData
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to upload to Cloudinary');
            }

            setFormData(prev => ({ ...prev, src: result.secure_url }));
        } catch (err: any) {
            console.error('Upload error:', err);
            setUploadError(err.message || 'Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data } = await supabase.from('gallery_items').insert([formData]).select();
        if (data) { setItems(prev => [data[0], ...prev]); setIsModalOpen(false); setFormData(EMPTY_FORM); }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;
        const { error } = await supabase.from('gallery_items').delete().eq('id', id);
        if (!error) setItems(prev => prev.filter(i => i.id !== id));
    };

    const filterButtons = ['All', ...CATEGORIES];

    const catColor: Record<string, string> = {
        Campus: '#3b82f6', Sports: '#10b981', Events: '#f59e0b',
        Classroom: '#8b5cf6', Achievements: '#ec4899', Cultural: '#f97316'
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>Gallery Management</h1>
                    <p>{items.length} photos across {new Set(items.map(i => i.category)).size} categories</p>
                </div>
                <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add Photo
                </button>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBar}>
                    <Search size={16} className={styles.searchIcon} />
                    <input type="text" placeholder="Search by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className={styles.filterPills}>
                    {filterButtons.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.pill} ${activeFilter === cat ? styles.pillActive : ''}`}
                            style={activeFilter === cat && catColor[cat] ? { background: catColor[cat] } : {}}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className={styles.loader}><Loader2 className={styles.spin} size={28} /> Loading...</div>
            ) : (
                <div className={styles.photoGrid}>
                    <AnimatePresence>
                        {filtered.map(item => (
                            <motion.div
                                key={item.id}
                                className={styles.photoCard}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <div className={styles.imageWrapper}>
                                    <img src={item.src} alt={item.title} />
                                    <div className={styles.imgOverlay}>
                                        <button className={styles.deleteCardBtn} onClick={() => handleDelete(item.id, item.title)}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div className={styles.cardInfo}>
                                    <span className={styles.catBadge} style={{ background: (catColor[item.category] || '#64748b') + '22', color: catColor[item.category] || '#64748b' }}>
                                        {item.category}
                                    </span>
                                    <p className={styles.photoTitle}>{item.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                        <div className={styles.empty}>
                            <ImageIcon size={48} />
                            <p>No photos found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Photo Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, y: -20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>Add New Photo</h2>
                                    <p>Upload a photo to the school gallery.</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={22} /></button>
                            </div>

                            {/* Preview */}
                            {formData.src && (
                                <div className={styles.previewWrapper}>
                                    <img src={formData.src} alt="Preview" className={styles.preview} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                            )}

                            <form onSubmit={handleAdd} className={styles.form}>
                                <div className={styles.fieldGroup}>
                                    <label><Upload size={14} /> Upload Image</label>
                                    <div className={styles.uploadWrapper}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            id="fileInput"
                                            className={styles.fileInput}
                                        />
                                        <label htmlFor="fileInput" className={styles.fileLabel}>
                                            {uploading ? (
                                                <>
                                                    <Loader2 className={styles.spin} size={16} /> Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} /> Choose Image File
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><Link size={14} /> Or Image URL</label>
                                    <input value={formData.src} onChange={e => setFormData({ ...formData, src: e.target.value })} placeholder="https://..." required />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label><Type size={14} /> Title</label>
                                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Annual Sports Day 2024" required />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label><Layers size={14} /> Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                        <option value="">Select category...</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn}><Plus size={18} /> Add to Gallery</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageGallery;
