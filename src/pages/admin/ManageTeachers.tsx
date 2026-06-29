import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Edit2, Save, X, Search, Loader2, User2, GraduationCap, BookOpen, Layers, Clock, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import styles from './ManageTeachers.module.css';

// Field MUST be defined outside the component to avoid re-creation on every render,
// which would cause React to unmount/remount inputs and steal keyboard focus.
const Field = ({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) => (
    <div className={styles.fieldGroup}>
        <label><Icon size={14} /> {label}</label>
        {children}
    </div>
);

const EMPTY_FORM = {
    name: '', dept: '', role: '', level: '', exp: '', image_url: '',
    subjects: [] as string[],
    classes: [] as string[]
};

const ManageTeachers = () => {
    const [teachers, setTeachers] = React.useState<any[]>([]);
    const [filtered, setFiltered] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState(EMPTY_FORM);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => { fetchTeachers(); }, []);

    React.useEffect(() => {
        if (!searchQuery) { setFiltered(teachers); return; }
        const q = searchQuery.toLowerCase();
        setFiltered(teachers.filter(t => t.name?.toLowerCase().includes(q) || t.dept?.toLowerCase().includes(q) || t.subjects?.some((s: string) => s.toLowerCase().includes(q))));
    }, [searchQuery, teachers]);

    const fetchTeachers = async () => {
        setLoading(true);
        const { data } = await supabase.from('teachers').select('*').order('name');
        if (data) { setTeachers(data); setFiltered(data); }
        setLoading(false);
    };

    const openModal = (teacher?: any) => {
        if (teacher) {
            setEditingId(teacher.id);
            setFormData({ name: teacher.name, dept: teacher.dept, role: teacher.role, level: teacher.level, exp: teacher.exp, image_url: teacher.image_url || '', subjects: teacher.subjects || [], classes: teacher.classes || [] });
        } else {
            setEditingId(null);
            setFormData(EMPTY_FORM);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(EMPTY_FORM); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            const { error } = await supabase.from('teachers').update(formData).eq('id', editingId);
            if (!error) { setTeachers(prev => prev.map(t => t.id === editingId ? { ...t, ...formData } : t)); closeModal(); }
        } else {
            const { data } = await supabase.from('teachers').insert([formData]).select();
            if (data) { setTeachers(prev => [...prev, data[0]]); closeModal(); }
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete faculty member "${name}"?`)) return;
        const { error } = await supabase.from('teachers').delete().eq('id', id);
        if (!error) setTeachers(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>Faculty Management</h1>
                    <p>{teachers.length} members registered</p>
                </div>
                <button className={styles.addBtn} onClick={() => openModal()}>
                    <Plus size={20} /> Add Faculty
                </button>
            </div>

            {/* Search */}
            <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search by name, department, or subject..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loader}><Loader2 className={styles.spin} size={28} /> Loading faculty...</div>
            ) : (
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Faculty Member</th>
                                <th>Department</th>
                                <th>Subjects</th>
                                <th>Classes</th>
                                <th>Experience</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(t => (
                                <tr key={t.id}>
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar} style={{ backgroundImage: `url(${t.image_url || logo})`, backgroundSize: t.image_url ? 'cover' : 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
                                            <div>
                                                <p className={styles.teacherName}>{t.name}</p>
                                                <span className={styles.roleTag}>{t.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={styles.deptBadge}>{t.dept}</span></td>
                                    <td>
                                        <div className={styles.tagList}>
                                            {t.subjects?.slice(0, 3).map((s: string) => <span key={s} className={styles.subjectTag}>{s}</span>)}
                                            {t.subjects?.length > 3 && <span className={styles.moreTag}>+{t.subjects.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tagList}>
                                            {t.classes?.slice(0, 2).map((c: string) => <span key={c} className={styles.classTag}>{c}</span>)}
                                            {t.classes?.length > 2 && <span className={styles.moreTag}>+{t.classes.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td><span className={styles.expText}>{t.exp}</span></td>
                                    <td>
                                        <div className={styles.actionBtns}>
                                            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openModal(t)} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(t.id, t.name)} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className={styles.emptyRow}>No faculty members found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, y: -30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>{editingId ? 'Edit Faculty Member' : 'Add New Faculty Member'}</h2>
                                    <p>{editingId ? 'Update the details for this member.' : 'Fill in the details to register a new faculty member.'}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={closeModal}><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGrid}>
                                    <Field icon={User2} label="Full Name">
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Rahul Sharma" required />
                                    </Field>
                                    <Field icon={GraduationCap} label="Qualification / Dept">
                                        <input value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} placeholder="e.g. M.Sc Mathematics" required />
                                    </Field>
                                    <Field icon={GraduationCap} label="Role">
                                        <input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Senior Teacher" required />
                                    </Field>
                                    <Field icon={Layers} label="Level">
                                        <input value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} placeholder="e.g. Secondary, HS" required />
                                    </Field>
                                    <Field icon={BookOpen} label="Subjects (comma separated)">
                                        <input value={formData.subjects.join(', ')} onChange={e => setFormData({ ...formData, subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="e.g. Mathematics, Science" />
                                    </Field>
                                    <Field icon={Layers} label="Classes Assigned (comma separated)">
                                        <input value={formData.classes.join(', ')} onChange={e => setFormData({ ...formData, classes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="e.g. Class 8, Class 9" />
                                    </Field>
                                    <Field icon={Clock} label="Experience">
                                        <input value={formData.exp} onChange={e => setFormData({ ...formData, exp: e.target.value })} placeholder="e.g. 10 Years" required />
                                    </Field>
                                    <Field icon={Link} label="Photo URL (optional)">
                                        <input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                                    </Field>
                                </div>

                                <div className={styles.formFooter}>
                                    <button type="button" className={styles.cancelFormBtn} onClick={closeModal}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn}>
                                        <Save size={18} />
                                        {editingId ? 'Save Changes' : 'Add Faculty Member'}
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

export default ManageTeachers;
