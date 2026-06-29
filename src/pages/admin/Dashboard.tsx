import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, Newspaper, GraduationCap, Clock, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({
        news: 0,
        teachers: 0,
        admissions: 0,
        jobs: 0
    });
    const [recentApps, setRecentApps] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [
            { count: newsCount },
            { count: teachersCount },
            { count: admissionsCount },
            { count: jobsCount },
            { data: apps }
        ] = await Promise.all([
            supabase.from('news').select('*', { count: 'exact', head: true }),
            supabase.from('teachers').select('*', { count: 'exact', head: true }),
            supabase.from('admission_applications').select('*', { count: 'exact', head: true }),
            supabase.from('job_applications').select('*', { count: 'exact', head: true }),
            supabase.from('admission_applications').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
            news: newsCount || 0,
            teachers: teachersCount || 0,
            admissions: admissionsCount || 0,
            jobs: jobsCount || 0
        });
        setRecentApps(apps || []);
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the application for "${name}"?`)) {
            const { error } = await supabase.from('admission_applications').delete().eq('id', id);
            if (!error) {
                setRecentApps(prev => prev.filter(app => app.id !== id));
            } else {
                alert('Error deleting application: ' + error.message);
            }
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return styles.badgeAccepted;
            case 'rejected': return styles.badgeRejected;
            case 'review': return styles.badgeReview;
            default: return styles.badgePending;
        }
    };

    if (loading) return <div className={styles.loader}>Loading statistical data...</div>;

    const statCards = [
        { name: 'Admissions', value: stats.admissions, icon: <GraduationCap />, color: '#0ea5e9', link: '/admin/admissions' },
        { name: 'Job Applications', value: stats.jobs, icon: <Users />, color: '#10b981', link: '/admin/jobs' },
        { name: 'News Updates', value: stats.news, icon: <Newspaper />, color: '#f59e0b', link: '/admin/news' },
        { name: 'Total Faculty', value: stats.teachers, icon: <Users />, color: '#6366f1', link: '/admin/teachers' },
    ];

    return (
        <div className={styles.dashboard}>
            <div className={styles.statsGrid}>
                {statCards.map((card) => (
                    <div
                        key={card.name}
                        className={styles.statCard}
                        onClick={() => navigate(card.link)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={styles.statIcon} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{card.value}</h3>
                            <p>{card.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.recentSection}>
                    <div className={styles.sectionHeader}>
                        <Clock size={18} />
                        <h2>Recent Admissions</h2>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Grade</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApps.map((app) => (
                                    <tr key={app.id}>
                                        <td>{app.student_name}</td>
                                        <td>Class {app.grade}</td>
                                        <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={getStatusBadgeClass(app.status)}>
                                                {app.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionsCell}>
                                                <button
                                                    className={`${styles.actionBtnSmall} ${styles.viewBtn}`}
                                                    title="View Details"
                                                    onClick={() => navigate(`/admin/admissions?id=${app.id}`)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtnSmall} ${styles.deleteBtn}`}
                                                    title="Delete Application"
                                                    onClick={() => handleDelete(app.id, app.student_name)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {recentApps.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No recent applications found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.quickActions}>
                    <h2>Quick Actions</h2>
                    <div className={styles.actionButtons}>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/news')}>Post New Announcement</button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/teachers')}>Add Faculty Member</button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/gallery')}>Upload Gallery Photos</button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/downloads')}>Manage Downloads</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
