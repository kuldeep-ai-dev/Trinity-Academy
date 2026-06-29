import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import {
    LayoutDashboard,
    Newspaper,
    Users,
    Image as ImageIcon,
    Download,
    FileText,
    LogOut,
    UserCheck,
    Megaphone,
    Briefcase,
    Award
} from 'lucide-react';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const [session, setSession] = React.useState<Session | null>(null);
    const [loading, setLoading] = React.useState(true);
    const location = useLocation();

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) return <div>Loading...</div>;

    if (!session) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Announcements', path: '/admin/news', icon: <Newspaper size={20} /> },
        { name: 'Job Vacancies', path: '/admin/vacancies', icon: <Briefcase size={20} /> },
        { name: 'Advisory Board', path: '/admin/advisory', icon: <Award size={20} /> },
        { name: 'Faculty', path: '/admin/teachers', icon: <Users size={20} /> },
        { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={20} /> },
        { name: 'Downloads', path: '/admin/downloads', icon: <Download size={20} /> },
        { name: 'Admissions', path: '/admin/admissions', icon: <UserCheck size={20} /> },
        { name: 'Job Applications', path: '/admin/jobs', icon: <FileText size={20} /> },
        { name: 'Promo Banners', path: '/admin/banners', icon: <Megaphone size={20} /> },
    ];

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Trinity <span>Admin</span></h2>
                </div>
                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>
            <main className={styles.content}>
                <header className={styles.header}>
                    <h1>{menuItems.find(m => m.path === location.pathname)?.name || 'Admin'}</h1>
                    <div className={styles.userProfile}>
                        <span>{session.user.email}</span>
                    </div>
                </header>
                <div className={styles.innerContent}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
