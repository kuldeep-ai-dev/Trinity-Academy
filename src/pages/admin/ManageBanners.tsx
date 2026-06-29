import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Edit2, Loader2, X, Calendar, Clock, MegaphoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ManageBanners.module.css';

interface PromoBanner {
    id?: string;
    created_at?: string;
    title: string;
    highlight_word: string;
    description: string;
    image_url: string;
    badge_text: string;
    button_text: string;
    button_action: string;
    dismiss_text: string;
    is_active: boolean;
    starts_at: string;
    expires_at: string;
    display_delay_ms: number;
    priority: number;
}

const EMPTY_FORM: PromoBanner = {
    title: '',
    highlight_word: '',
    description: '',
    image_url: '',
    badge_text: '',
    button_text: 'Enroll Now',
    button_action: 'enroll',
    dismiss_text: 'Maybe Later',
    is_active: true,
    starts_at: new Date().toISOString().substring(0, 16),
    expires_at: '',
    display_delay_ms: 1500,
    priority: 0
};

const ManageBanners = () => {
    const [banners, setBanners] = useState<PromoBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<PromoBanner>(EMPTY_FORM);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('promo_banners')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching promo banners:', error);
        } else if (data) {
            // Helper to format date strings for datetime-local input
            const formatted = data.map((b: any) => ({
                ...b,
                starts_at: b.starts_at ? new Date(b.starts_at).toISOString().substring(0, 16) : '',
                expires_at: b.expires_at ? new Date(b.expires_at).toISOString().substring(0, 16) : ''
            }));
            setBanners(formatted);
        }
        setLoading(false);
    };

    const handleOpenCreateModal = () => {
        setFormData({
            ...EMPTY_FORM,
            starts_at: new Date().toISOString().substring(0, 16)
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (banner: PromoBanner) => {
        setFormData(banner);
        setEditingId(banner.id || null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete the banner "${title}"?`)) return;
        const { error } = await supabase.from('promo_banners').delete().eq('id', id);
        if (error) {
            alert('Failed to delete: ' + error.message);
        } else {
            setBanners(prev => prev.filter(b => b.id !== id));
        }
    };

    const handleToggleActive = async (banner: PromoBanner) => {
        const nextActive = !banner.is_active;
        const { error } = await supabase
            .from('promo_banners')
            .update({ is_active: nextActive })
            .eq('id', banner.id);

        if (error) {
            alert('Failed to update status: ' + error.message);
        } else {
            setBanners(prev =>
                prev.map(b => (b.id === banner.id ? { ...b, is_active: nextActive } : b))
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert the form datetime values to standard ISO format for DB insertion
        const submitData = {
            ...formData,
            starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
            expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
            // Ensure priority and delay are numbers
            priority: Number(formData.priority) || 0,
            display_delay_ms: Number(formData.display_delay_ms) || 1500
        };

        if (editingId) {
            // Update existing banner
            const { error } = await supabase
                .from('promo_banners')
                .update(submitData)
                .eq('id', editingId);

            if (error) {
                alert('Error updating banner: ' + error.message);
            } else {
                setIsModalOpen(false);
                fetchBanners();
            }
        } else {
            // Create new banner
            const { error } = await supabase
                .from('promo_banners')
                .insert([submitData]);

            if (error) {
                alert('Error creating banner: ' + error.message);
            } else {
                setIsModalOpen(false);
                fetchBanners();
            }
        }
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>Promo Pop-up Banners</h1>
                    <p>Manage scheduled announcement popups & badges visible to school website guests.</p>
                </div>
                <button className={styles.addBtn} onClick={handleOpenCreateModal}>
                    <Plus size={20} /> New Banner
                </button>
            </div>

            {/* Banner List */}
            {loading ? (
                <div className={styles.loader}>
                    <Loader2 className={styles.spin} size={28} /> Loading...
                </div>
            ) : banners.length === 0 ? (
                <div className={styles.empty}>
                    <MegaphoneOff size={48} />
                    <p>No banners found. Create one to display on the website homepage.</p>
                </div>
            ) : (
                <div className={styles.bannerList}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Banner Title</th>
                                    <th>Badge text</th>
                                    <th>Actions / Target</th>
                                    <th>Priority</th>
                                    <th>Schedule</th>
                                    <th>Controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banners.map(banner => (
                                    <tr key={banner.id}>
                                        <td>
                                            <label className={styles.switch}>
                                                <input
                                                    type="checkbox"
                                                    checked={banner.is_active}
                                                    onChange={() => handleToggleActive(banner)}
                                                />
                                                <span className={styles.slider}></span>
                                            </label>
                                        </td>
                                        <td className={styles.titleCell}>
                                            {banner.title}{' '}
                                            {banner.highlight_word && (
                                                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                                                    ({banner.highlight_word})
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {banner.badge_text ? (
                                                <span className={styles.badgePreview}>{banner.badge_text}</span>
                                            ) : (
                                                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>None</span>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem' }}>
                                                <strong>{banner.button_text}</strong> ({banner.button_action})
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.priorityBadge}>{banner.priority}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
                                                Start: {banner.starts_at ? banner.starts_at.replace('T', ' ') : 'Immediate'}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'block' }}>
                                                Expiry: {banner.expires_at ? banner.expires_at.replace('T', ' ') : 'Never'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionsCell}>
                                                <button
                                                    className={styles.actionBtnSmall}
                                                    title="Edit Banner"
                                                    onClick={() => handleOpenEditModal(banner)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtnSmall} ${styles.deleteBtnSmall}`}
                                                    title="Delete Banner"
                                                    onClick={() => handleDelete(banner.id!, banner.title)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
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
                                    <h2>{editingId ? 'Edit Banner Popup' : 'Create New Banner Popup'}</h2>
                                    <p>Configure appearance, action buttons, priority and expiry times.</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                    <X size={22} />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formRow}>
                                        <div className={styles.fieldGroup}>
                                            <label>Banner Header / Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. Shape Their Future Today!"
                                                required
                                            />
                                        </div>
                                        <div className={styles.fieldGroup}>
                                            <label>Highlight Word (Colored Accent)</label>
                                            <input
                                                type="text"
                                                value={formData.highlight_word}
                                                onChange={e => setFormData({ ...formData, highlight_word: e.target.value })}
                                                placeholder="e.g. Future"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label>Description Body</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Trinity Academy offers a blend of tradition..."
                                            required
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.fieldGroup}>
                                            <label>Graphic / Image URL</label>
                                            <input
                                                type="text"
                                                value={formData.image_url}
                                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                                placeholder="https://... (Leave blank for default)"
                                            />
                                        </div>
                                        <div className={styles.fieldGroup}>
                                            <label>Badge Text</label>
                                            <input
                                                type="text"
                                                value={formData.badge_text}
                                                onChange={e => setFormData({ ...formData, badge_text: e.target.value })}
                                                placeholder="e.g. 2026-27 Enrollment"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.fieldGroup}>
                                            <label>Primary Action Button Title</label>
                                            <input
                                                type="text"
                                                value={formData.button_text}
                                                onChange={e => setFormData({ ...formData, button_text: e.target.value })}
                                                placeholder="e.g. Enroll Now"
                                                required
                                            />
                                        </div>
                                        <div className={styles.fieldGroup}>
                                            <label>Primary Action Target</label>
                                            <input
                                                type="text"
                                                value={formData.button_action}
                                                onChange={e => setFormData({ ...formData, button_action: e.target.value })}
                                                placeholder="e.g. 'enroll' or Link '/admission/apply'"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.fieldGroup}>
                                            <label>Dismiss Button text</label>
                                            <input
                                                type="text"
                                                value={formData.dismiss_text}
                                                onChange={e => setFormData({ ...formData, dismiss_text: e.target.value })}
                                                placeholder="e.g. Maybe Later"
                                            />
                                        </div>
                                        <div className={styles.fieldGroup}>
                                            <label>Display Delay (MS)</label>
                                            <input
                                                type="number"
                                                value={formData.display_delay_ms}
                                                onChange={e => setFormData({ ...formData, display_delay_ms: Number(e.target.value) })}
                                                placeholder="1500"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.fieldGroup}>
                                            <label><Calendar size={13} /> Start Schedule</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.starts_at}
                                                onChange={e => setFormData({ ...formData, starts_at: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.fieldGroup}>
                                            <label><Clock size={13} /> Expiry Time Period</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.expires_at}
                                                onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.fieldGroup}>
                                            <label>Display Priority (higher = first)</label>
                                            <input
                                                type="number"
                                                value={formData.priority}
                                                onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className={styles.fieldGroup} style={{ justifyContent: 'center' }}>
                                            <label className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                                />
                                                Activate immediately
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles.formFooter}>
                                        <button
                                            type="button"
                                            className={styles.cancelBtn}
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className={styles.submitBtn}>
                                            {editingId ? 'Update Banner' : 'Create Banner'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageBanners;
