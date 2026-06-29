import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Edit2, X, Search, Loader2, Newspaper, Calendar, Tag, Link as LinkIcon, AlignLeft, Eye, EyeOff, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ManageNews.module.css';

const CATEGORIES = ['General', 'Admission', 'Academics', 'Events', 'Sports', 'Cultural', 'Holiday', 'Exam', 'Results', 'Other'];

const EMPTY_FORM = { title: '', category: 'General', date: '', description: '', link: '', is_active: true };

const ManageNews = () => {
    const [news, setNews] = React.useState<any[]>([]);
    const [filtered, setFiltered] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState(EMPTY_FORM);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => { fetchNews(); }, []);

    React.useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFiltered(q ? news.filter(n =>
            n.title?.toLowerCase().includes(q) ||
            n.category?.toLowerCase().includes(q) ||
            n.description?.toLowerCase().includes(q)
        ) : news);
    }, [searchQuery, news]);

    const fetchNews = async () => {
        setLoading(true);
        const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (data) { setNews(data); setFiltered(data); }
        setLoading(false);
    };

    const openAdd = () => {
        setEditingId(null);
        setFormData(EMPTY_FORM);
        setIsModalOpen(true);
    };

    const openEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({
            title: item.title || '',
            category: item.category || 'General',
            date: item.date || '',
            description: item.description || '',
            link: item.link || '',
            is_active: item.is_active !== false,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(EMPTY_FORM);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        if (editingId) {
            const { error } = await supabase.from('news').update(formData).eq('id', editingId);
            if (!error) {
                setNews(prev => prev.map(n => n.id === editingId ? { ...n, ...formData } : n));
                closeModal();
            }
        } else {
            const { data } = await supabase.from('news').insert([formData]).select();
            if (data) {
                setNews(prev => [data[0], ...prev]);
                closeModal();
            }
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete announcement "${title}"?`)) return;
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) setNews(prev => prev.filter(n => n.id !== id));
    };

    const toggleActive = async (item: any) => {
        const { error } = await supabase.from('news').update({ is_active: !item.is_active }).eq('id', item.id);
        if (!error) setNews(prev => prev.map(n => n.id === item.id ? { ...n, is_active: !n.is_active } : n));
    };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            Admission: '#3b82f6', Academics: '#8b5cf6', Events: '#f59e0b',
            Sports: '#10b981', Cultural: '#ec4899', Holiday: '#14b8a6',
            Exam: '#f97316', Results: '#06b6d4', General: '#64748b', Other: '#94a3b8',
        };
        return colors[cat] || '#64748b';
    };

    return (
        <div className={styles.page}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.addBtn} onClick={openAdd}>
                    <Plus size={18} /> Add Announcement
                </button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{news.length}</span>
                    <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{news.filter(n => n.is_active !== false).length}</span>
                    <span className={styles.statLabel}>Active</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{news.filter(n => n.is_active === false).length}</span>
                    <span className={styles.statLabel}>Hidden</span>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.loader}><Loader2 className={styles.spin} size={24} /> Loading announcements...</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <Newspaper size={48} strokeWidth={1} />
                        <p>{searchQuery ? 'No announcements match your search.' : 'No announcements yet. Add your first one!'}</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item.id}>
                                    <td className={styles.dateCell}>{item.date || '—'}</td>
                                    <td className={styles.titleCell}>
                                        <span className={styles.titleText}>{item.title}</span>
                                        {item.description && <span className={styles.descPreview}>{item.description.slice(0, 60)}{item.description.length > 60 ? '…' : ''}</span>}
                                    </td>
                                    <td>
                                        <span className={styles.catBadge} style={{ background: getCategoryColor(item.category) + '20', color: getCategoryColor(item.category), border: `1px solid ${getCategoryColor(item.category)}40` }}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={item.is_active !== false ? styles.activeBadge : styles.hiddenBadge}>
                                            {item.is_active !== false ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className={styles.actionsCell}>
                                        <button className={styles.iconBtn} title={item.is_active !== false ? 'Hide' : 'Show'} onClick={() => toggleActive(item)}>
                                            {item.is_active !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button className={styles.iconBtn} title="Edit" onClick={() => openEdit(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Delete" onClick={() => handleDelete(item.id, item.title)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className={styles.overlay} onClick={closeModal}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, y: -30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
                                    <p>{editingId ? 'Update the announcement details below.' : 'Fill in the details to publish an announcement.'}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={closeModal}><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSave} className={styles.form}>
                                {/* Title */}
                                <div className={styles.fieldGroup}>
                                    <label><Newspaper size={14} /> Title <span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Annual Sports Day 2025 Registration Open"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Category + Date */}
                                <div className={styles.row2}>
                                    <div className={styles.fieldGroup}>
                                        <label><Tag size={14} /> Category <span>*</span></label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label><Calendar size={14} /> Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className={styles.fieldGroup}>
                                    <label><AlignLeft size={14} /> Description / Details</label>
                                    <textarea
                                        placeholder="Add more details about this announcement (optional)..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                {/* Link */}
                                <div className={styles.fieldGroup}>
                                    <label><LinkIcon size={14} /> External Link (optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/notice.pdf"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>

                                {/* Visibility toggle */}
                                <div className={styles.toggleRow}>
                                    <label className={styles.toggleLabel}>
                                        <div className={`${styles.toggle} ${formData.is_active ? styles.toggleOn : ''}`} onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
                                            <div className={styles.toggleThumb} />
                                        </div>
                                        <span>{formData.is_active ? 'Visible to public' : 'Hidden from public'}</span>
                                    </label>
                                </div>

                                <div className={styles.formFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                                        {saving ? <Loader2 className={styles.spin} size={16} /> : <Save size={16} />}
                                        {editingId ? 'Update' : 'Publish'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageNews;
