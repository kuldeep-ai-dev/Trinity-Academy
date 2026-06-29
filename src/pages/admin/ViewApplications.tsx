import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Loader2, Mail, X, GraduationCap, Briefcase, Info, Users, Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import styles from './ManageContent.module.css';

const ViewApplications = ({ type }: { type: 'admission' | 'job' }) => {
    const [searchParams] = useSearchParams();
    const [apps, setApps] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedApp, setSelectedApp] = React.useState<any | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [actionLoading, setActionLoading] = React.useState(false);

    const table = type === 'admission' ? 'admission_applications' : 'job_applications';

    React.useEffect(() => {
        setError(null);
        setSelectedApp(null);
        fetchApps();
    }, [type]);

    // Handle deep linking from dashboard
    React.useEffect(() => {
        const id = searchParams.get('id');
        if (id && apps.length > 0) {
            const app = apps.find(a => a.id === id);
            if (app) setSelectedApp(app);
        }
    }, [searchParams, apps]);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setApps(data || []);
        } catch (err: any) {
            console.error('Error fetching applications:', err);
            setError(err.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setActionLoading(true);
        try {
            const { error: updateError } = await supabase
                .from(table)
                .update({ status: newStatus })
                .eq('id', id);

            if (updateError) throw updateError;

            // Refresh local state
            setApps(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
            setSelectedApp((prev: any) => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
        } catch (err: any) {
            alert('Error updating status: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the application for "${name}"?`)) {
            setActionLoading(true);
            try {
                const { error: deleteError } = await supabase.from(table).delete().eq('id', id);
                if (deleteError) throw deleteError;
                setApps(prev => prev.filter(app => app.id !== id));
                if (selectedApp?.id === id) setSelectedApp(null);
            } catch (err: any) {
                alert('Error deleting application: ' + err.message);
            } finally {
                setActionLoading(false);
            }
        }
    };

    const getInitial = (name?: string) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    const getStatusClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return styles.statusAccepted;
            case 'rejected': return styles.statusRejected;
            case 'review': return styles.statusReview;
            default: return styles.statusPending;
        }
    };

    const isSelectionValid = () => {
        if (!selectedApp) return false;
        if (type === 'admission') return 'student_name' in selectedApp;
        if (type === 'job') return 'full_name' in selectedApp;
        return false;
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={20} />
                    <input type="text" placeholder={`Search ${type} applications...`} />
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.contentList}>
                    {loading ? (
                        <div className={styles.loader}><Loader2 className={styles.spinner} /> Loading...</div>
                    ) : error ? (
                        <div className={styles.loader} style={{ color: '#ef4444' }}>{error}</div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>{type === 'admission' ? 'Grade' : 'Position'}</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apps.map(app => (
                                        <tr
                                            key={app.id}
                                            className={selectedApp?.id === app.id ? styles.selectedRow : ''}
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <td className={styles.nameCell}>
                                                <div className={styles.avatar}>
                                                    {getInitial(type === 'admission' ? app.student_name : app.full_name)}
                                                </div>
                                                {type === 'admission' ? app.student_name : app.full_name}
                                            </td>
                                            <td>
                                                <span className={styles.gradeBadge}>
                                                    {type === 'admission' ? `Class ${app.grade}` : app.job_title}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusIndicator} ${getStatusClass(app.status)}`}>
                                                    {app.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className={styles.actions}>
                                                <div className={styles.actionsCell}>
                                                    <button
                                                        className={styles.actionBtnSmall}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className={`${styles.actionBtnSmall} ${styles.deleteBtnSmall}`}
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(app.id, type === 'admission' ? app.student_name : app.full_name); }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {apps.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                No {type} applications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isSelectionValid() && (
                        <div className={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
                            <motion.div
                                className={styles.modalContent}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className={styles.detailsHeader}>
                                    <div className={styles.headerInfo}>
                                        <div className={styles.largeAvatar}>
                                            {getInitial(type === 'admission' ? selectedApp.student_name : selectedApp.full_name)}
                                        </div>
                                        <div>
                                            <h3>{type === 'admission' ? selectedApp.student_name : selectedApp.full_name}</h3>
                                            <p>{type === 'admission' ? `Admission for Class ${selectedApp.grade}` : selectedApp.job_title}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span className={`${styles.statusIndicator} ${getStatusClass(selectedApp.status)}`} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                            {selectedApp.status || 'pending'}
                                        </span>
                                        <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}><X size={24} /></button>
                                    </div>
                                </div>

                                <div className={styles.detailsBody}>
                                    {/* Decision Actions Section - ALWAYS ON TOP */}
                                    <div className={styles.decisionSection}>
                                        <p>Application Action</p>
                                        <div className={styles.decisionButtons}>
                                            <button
                                                className={styles.acceptBtn}
                                                onClick={() => updateStatus(selectedApp.id, 'accepted')}
                                                disabled={actionLoading || selectedApp.status === 'accepted'}
                                            >
                                                <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                                Accept Admission
                                            </button>
                                            <button
                                                className={styles.rejectBtn}
                                                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                                disabled={actionLoading || selectedApp.status === 'rejected'}
                                            >
                                                <XCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                                Reject Admission
                                            </button>
                                            <button
                                                className={styles.reviewBtn}
                                                onClick={() => updateStatus(selectedApp.id, 'review')}
                                                disabled={actionLoading || selectedApp.status === 'review'}
                                            >
                                                <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                                Mark for Review
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.detailSection}>
                                        <h4><Info size={16} /> Basic Information</h4>
                                        <div className={styles.detailGrid}>
                                            <div className={styles.detailItem}>
                                                <label>Full Name</label>
                                                <p>{type === 'admission' ? selectedApp.student_name : selectedApp.full_name}</p>
                                            </div>
                                            {type === 'admission' && (
                                                <div className={styles.detailItem}>
                                                    <label>Date of Birth</label>
                                                    <p>{selectedApp.dob ? new Date(selectedApp.dob).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            )}
                                            <div className={styles.detailItem}>
                                                <label>Gender</label>
                                                <p style={{ textTransform: 'capitalize' }}>{selectedApp.gender || 'N/A'}</p>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <label>Date Applied</label>
                                                <p>{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.detailSection}>
                                        <h4><Mail size={16} /> Contact Details</h4>
                                        <div className={styles.detailGrid}>
                                            <div className={styles.detailItem}>
                                                <label>Email Address</label>
                                                <p>{selectedApp.email || 'N/A'}</p>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <label>Phone Number</label>
                                                <p>{type === 'admission' ? selectedApp.contact_primary : selectedApp.phone || 'N/A'}</p>
                                            </div>
                                            <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                                                <label>Residential Address</label>
                                                <p>{selectedApp.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {type === 'admission' ? (
                                        <>
                                            <div className={styles.detailSection}>
                                                <h4><Users size={16} /> Family Information</h4>
                                                <div className={styles.detailGrid}>
                                                    <div className={styles.detailItem}>
                                                        <label>Father's Name</label>
                                                        <p>{selectedApp.father_name || 'N/A'}</p>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <label>Mother's Name</label>
                                                        <p>{selectedApp.mother_name || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.detailSection}>
                                                <h4><GraduationCap size={16} /> Academic Background</h4>
                                                <div className={styles.detailGrid}>
                                                    <div className={styles.detailItem}>
                                                        <label>Previous School</label>
                                                        <p>{selectedApp.previous_school || 'N/A'}</p>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <label>Last Grade Completed</label>
                                                        <p>{selectedApp.last_grade || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={styles.detailSection}>
                                                <h4><Briefcase size={16} /> Professional Background</h4>
                                                <div className={styles.detailGrid}>
                                                    <div className={styles.detailItem}>
                                                        <label>Highest Degree</label>
                                                        <p>{selectedApp.highest_degree || 'N/A'}</p>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <label>Total Experience</label>
                                                        <p>{selectedApp.total_exp} Years</p>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <label>Current Location</label>
                                                        <p>{selectedApp.current_location || 'N/A'}</p>
                                                    </div>
                                                    <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                                                        <label>Role Summary</label>
                                                        <p>{selectedApp.role_description || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.detailSection}>
                                                <a href={selectedApp.cv_url} target="_blank" rel="noreferrer" className={styles.cvButton}>
                                                    View Resume / CV
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ViewApplications;
