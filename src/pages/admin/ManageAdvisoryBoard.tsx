import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Edit2, X, Search, Loader2, User, Briefcase, GraduationCap, Quote, Image as ImageIcon, Save, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ManageAdvisoryBoard.module.css';

const EMPTY_FORM = {
    name: '',
    role: '',
    edu: '',
    vision: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
};

const ManageAdvisoryBoard = () => {
    const [members, setMembers] = React.useState<any[]>([]);
    const [filtered, setFiltered] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState(EMPTY_FORM);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => { fetchMembers(); }, []);

    React.useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFiltered(q ? members.filter(m =>
            m.name?.toLowerCase().includes(q) ||
            m.role?.toLowerCase().includes(q)
        ) : members);
    }, [searchQuery, members]);

    const fetchMembers = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('advisory_board')
            .select('*')
            .order('sort_order', { ascending: true });
        if (data) { setMembers(data); setFiltered(data); }
        setLoading(false);
    };

    const openAdd = () => {
        setEditingId(null);
        setFormData({ ...EMPTY_FORM, sort_order: members.length + 1 });
        setIsModalOpen(true);
    };

    const openEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({
            name: item.name || '',
            role: item.role || '',
            edu: item.edu || '',
            vision: item.vision || '',
            image_url: item.image_url || '',
            sort_order: item.sort_order ?? 0,
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
            const { error } = await supabase.from('advisory_board').update(formData).eq('id', editingId);
            if (!error) {
                setMembers(prev => prev.map(m => m.id === editingId ? { ...m, ...formData } : m));
                closeModal();
            }
        } else {
            const { data } = await supabase.from('advisory_board').insert([formData]).select();
            if (data) {
                setMembers(prev => [...prev, data[0]].sort((a, b) => a.sort_order - b.sort_order));
                closeModal();
            }
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Remove "${name}" from the Advisory Board?`)) return;
        const { error } = await supabase.from('advisory_board').delete().eq('id', id);
        if (!error) setMembers(prev => prev.filter(m => m.id !== id));
    };

    const toggleActive = async (item: any) => {
        const { error } = await supabase
            .from('advisory_board')
            .update({ is_active: !item.is_active })
            .eq('id', item.id);
        if (!error) setMembers(prev => prev.map(m => m.id === item.id ? { ...m, is_active: !m.is_active } : m));
    };

    const moveOrder = async (item: any, direction: 'up' | 'down') => {
        const idx = members.findIndex(m => m.id === item.id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= members.length) return;

        const swapItem = members[swapIdx];
        const updatedList = [...members];
        updatedList[idx] = { ...item, sort_order: swapItem.sort_order };
        updatedList[swapIdx] = { ...swapItem, sort_order: item.sort_order };
        updatedList.sort((a, b) => a.sort_order - b.sort_order);
        setMembers(updatedList);

        await supabase.from('advisory_board').update({ sort_order: swapItem.sort_order }).eq('id', item.id);
        await supabase.from('advisory_board').update({ sort_order: item.sort_order }).eq('id', swapItem.id);
    };

    return (
        <div className={styles.page}>
            <div className={styles.toolbar}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.addBtn} onClick={openAdd}>
                    <Plus size={18} /> Add Member
                </button>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{members.length}</span>
                    <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{members.filter(m => m.is_active !== false).length}</span>
                    <span className={styles.statLabel}>Active</span>
                </div>
            </div>

            {loading ? (
                <div className={styles.loader}><Loader2 className={styles.spin} size={24} /> Loading members...</div>
            ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                    <User size={56} strokeWidth={1} />
                    <p>{searchQuery ? 'No members match your search.' : 'No advisory board members yet.'}</p>
                </div>
            ) : (
                <div className={styles.memberList}>
                    {filtered.map((item, idx) => (
                        <div key={item.id} className={`${styles.memberCard} ${item.is_active === false ? styles.cardHidden : ''}`}>
                            <div className={styles.memberAvatar}>
                                {item.image_url
                                    ? <img src={item.image_url} alt={item.name} />
                                    : <span>{item.name?.charAt(0)}</span>
                                }
                            </div>
                            <div className={styles.memberInfo}>
                                <h3 className={styles.memberName}>{item.name}</h3>
                                <p className={styles.memberRole}>{item.role}</p>
                                <p className={styles.memberEdu}>{item.edu}</p>
                                <p className={styles.memberVision}>"{item.vision}"</p>
                            </div>
                            <div className={styles.memberActions}>
                                <div className={styles.orderBtns}>
                                    <button className={styles.orderBtn} onClick={() => moveOrder(item, 'up')} disabled={idx === 0} title="Move up">
                                        <ArrowUp size={14} />
                                    </button>
                                    <button className={styles.orderBtn} onClick={() => moveOrder(item, 'down')} disabled={idx === filtered.length - 1} title="Move down">
                                        <ArrowDown size={14} />
                                    </button>
                                </div>
                                <button className={styles.iconBtn} title={item.is_active !== false ? 'Hide' : 'Show'} onClick={() => toggleActive(item)}>
                                    {item.is_active !== false ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                                <button className={styles.iconBtn} onClick={() => openEdit(item)}>
                                    <Edit2 size={15} />
                                </button>
                                <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item.id, item.name)}>
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                                    <h2>{editingId ? 'Edit Member' : 'Add Board Member'}</h2>
                                    <p>{editingId ? 'Update this advisory board member.' : 'Add a new member to the advisory board.'}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={closeModal}><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSave} className={styles.form}>
                                <div className={styles.row2}>
                                    <div className={styles.fieldGroup}>
                                        <label><User size={14} /> Full Name <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Dr. Arvind Kashyap"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label><Briefcase size={14} /> Role / Designation <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Chief Academic Advisor"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><GraduationCap size={14} /> Education / Qualification <span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Ph.D. in Education Policy, IIT Delhi"
                                        value={formData.edu}
                                        onChange={e => setFormData({ ...formData, edu: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><Quote size={14} /> Vision Statement <span>*</span></label>
                                    <textarea
                                        placeholder="Their vision or message for Trinity Academy..."
                                        value={formData.vision}
                                        onChange={e => setFormData({ ...formData, vision: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className={styles.row2}>
                                    <div className={styles.fieldGroup}>
                                        <label><ImageIcon size={14} /> Photo URL (optional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={formData.image_url}
                                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label>Display Order</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={formData.sort_order}
                                            onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.toggleRow}>
                                    <label className={styles.toggleLabel}>
                                        <div className={`${styles.toggle} ${formData.is_active ? styles.toggleOn : ''}`} onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
                                            <div className={styles.toggleThumb} />
                                        </div>
                                        <span>{formData.is_active ? 'Visible on website' : 'Hidden from website'}</span>
                                    </label>
                                </div>

                                <div className={styles.formFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                                        {saving ? <Loader2 className={styles.spin} size={16} /> : <Save size={16} />}
                                        {editingId ? 'Update' : 'Add Member'}
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

export default ManageAdvisoryBoard;
