import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Edit2, X, Search, Loader2, Briefcase, Building2, MapPin, Clock, AlignLeft, ListChecks, CalendarCheck, Eye, EyeOff, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ManageVacancies.module.css';

const DEPARTMENTS = ['Primary', 'Secondary', 'Senior Secondary', 'Science', 'Mathematics', 'Humanities', 'Computer Science', 'Physical Education', 'Arts', 'Administration', 'Support Staff', 'Other'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
const LOCATIONS = ['On-site', 'Hybrid', 'Remote'];

const EMPTY_FORM = {
    title: '',
    department: 'Primary',
    type: 'Full-time',
    location: 'On-site',
    description: '',
    requirements: '',
    deadline: '',
    experience: '1+ Year',
    is_active: true,
};

const ManageVacancies = () => {
    const [vacancies, setVacancies] = React.useState<any[]>([]);
    const [filtered, setFiltered] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState(EMPTY_FORM);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => { fetchVacancies(); }, []);

    React.useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFiltered(q ? vacancies.filter(v =>
            v.title?.toLowerCase().includes(q) ||
            v.department?.toLowerCase().includes(q) ||
            v.description?.toLowerCase().includes(q)
        ) : vacancies);
    }, [searchQuery, vacancies]);

    const fetchVacancies = async () => {
        setLoading(true);
        const { data } = await supabase.from('job_vacancies').select('*').order('created_at', { ascending: false });
        if (data) { setVacancies(data); setFiltered(data); }
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
            department: item.department || 'Primary',
            type: item.type || 'Full-time',
            location: item.location || 'On-site',
            description: item.description || '',
            requirements: item.requirements || '',
            deadline: item.deadline || '',
            experience: item.experience || '1+ Year',
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
            const { error } = await supabase.from('job_vacancies').update(formData).eq('id', editingId);
            if (!error) {
                setVacancies(prev => prev.map(v => v.id === editingId ? { ...v, ...formData } : v));
                closeModal();
            }
        } else {
            const { data } = await supabase.from('job_vacancies').insert([formData]).select();
            if (data) {
                setVacancies(prev => [data[0], ...prev]);
                closeModal();
            }
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete vacancy "${title}"?`)) return;
        const { error } = await supabase.from('job_vacancies').delete().eq('id', id);
        if (!error) setVacancies(prev => prev.filter(v => v.id !== id));
    };

    const toggleActive = async (item: any) => {
        const { error } = await supabase.from('job_vacancies').update({ is_active: !item.is_active }).eq('id', item.id);
        if (!error) setVacancies(prev => prev.map(v => v.id === item.id ? { ...v, is_active: !v.is_active } : v));
    };

    const isDeadlinePast = (deadline: string) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    return (
        <div className={styles.page}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search vacancies..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.addBtn} onClick={openAdd}>
                    <Plus size={18} /> Post Vacancy
                </button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{vacancies.length}</span>
                    <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{vacancies.filter(v => v.is_active !== false).length}</span>
                    <span className={styles.statLabel}>Active</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{vacancies.filter(v => v.deadline && isDeadlinePast(v.deadline)).length}</span>
                    <span className={styles.statLabel}>Expired</span>
                </div>
            </div>

            {/* Vacancies Grid */}
            {loading ? (
                <div className={styles.loader}><Loader2 className={styles.spin} size={24} /> Loading vacancies...</div>
            ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                    <Briefcase size={56} strokeWidth={1} />
                    <p>{searchQuery ? 'No vacancies match your search.' : 'No vacancies posted yet. Click "Post Vacancy" to add one.'}</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filtered.map(item => (
                        <div key={item.id} className={`${styles.card} ${item.is_active === false ? styles.cardHidden : ''}`}>
                            <div className={styles.cardTop}>
                                <div className={styles.cardIcon}>
                                    <Briefcase size={20} />
                                </div>
                                <div className={styles.cardMeta}>
                                    <span className={`${styles.typeBadge} ${styles[`type_${item.type?.replace('-', '').replace(' ', '')}`]}`}>{item.type}</span>
                                    {item.is_active === false && <span className={styles.hiddenTag}>Hidden</span>}
                                    {item.deadline && isDeadlinePast(item.deadline) && <span className={styles.expiredTag}>Expired</span>}
                                </div>
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <div className={styles.cardDetails}>
                                <span><Building2 size={13} /> {item.department}</span>
                                <span><MapPin size={13} /> {item.location}</span>
                                <span><CalendarCheck size={13} /> Experience: {item.experience || '1+ Year'}</span>
                                {item.deadline && <span><CalendarCheck size={13} /> Deadline: {new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                            </div>
                            {item.description && (
                                <p className={styles.cardDesc}>{item.description.slice(0, 120)}{item.description.length > 120 ? '…' : ''}</p>
                            )}
                            <div className={styles.cardActions}>
                                <button className={styles.iconBtn} title={item.is_active !== false ? 'Hide' : 'Show'} onClick={() => toggleActive(item)}>
                                    {item.is_active !== false ? <EyeOff size={15} /> : <Eye size={15} />}
                                    {item.is_active !== false ? 'Hide' : 'Show'}
                                </button>
                                <button className={styles.iconBtn} onClick={() => openEdit(item)}>
                                    <Edit2 size={15} /> Edit
                                </button>
                                <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item.id, item.title)}>
                                    <Trash2 size={15} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                                    <h2>{editingId ? 'Edit Vacancy' : 'Post New Vacancy'}</h2>
                                    <p>{editingId ? 'Update the job vacancy details.' : 'Fill in details to publish a new job opening.'}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={closeModal}><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSave} className={styles.form}>
                                {/* Job Title */}
                                <div className={styles.fieldGroup}>
                                    <label><Briefcase size={14} /> Job Title <span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Mathematics Teacher"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Department + Type */}
                                <div className={styles.row2}>
                                    <div className={styles.fieldGroup}>
                                        <label><Building2 size={14} /> Department <span>*</span></label>
                                        <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required>
                                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label><Clock size={14} /> Job Type <span>*</span></label>
                                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                                            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Location + Deadline */}
                                <div className={styles.row2}>
                                    <div className={styles.fieldGroup}>
                                        <label><MapPin size={14} /> Location</label>
                                        <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label><CalendarCheck size={14} /> Experience Required</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 2+ Years / Freshers welcome"
                                            value={formData.experience}
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div className={styles.fieldGroup}>
                                    <label><CalendarCheck size={14} /> Application Deadline</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div className={styles.fieldGroup}>
                                    <label><AlignLeft size={14} /> Job Description <span>*</span></label>
                                    <textarea
                                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                {/* Requirements */}
                                <div className={styles.fieldGroup}>
                                    <label><ListChecks size={14} /> Requirements & Qualifications</label>
                                    <textarea
                                        placeholder="e.g. B.Ed / M.Ed required, minimum 2 years experience, TGT/PGT certified..."
                                        value={formData.requirements}
                                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                {/* Visibility toggle */}
                                <div className={styles.toggleRow}>
                                    <label className={styles.toggleLabel}>
                                        <div className={`${styles.toggle} ${formData.is_active ? styles.toggleOn : ''}`} onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
                                            <div className={styles.toggleThumb} />
                                        </div>
                                        <span>{formData.is_active ? 'Visible on website (accepting applications)' : 'Hidden from website'}</span>
                                    </label>
                                </div>

                                <div className={styles.formFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                                        {saving ? <Loader2 className={styles.spin} size={16} /> : <Save size={16} />}
                                        {editingId ? 'Update' : 'Post Vacancy'}
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

export default ManageVacancies;
