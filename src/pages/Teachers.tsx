import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, X, BookOpen, Users, Filter } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import PageHeader from '../components/PageHeader';
import logo from '../assets/logo.png';
import styles from './Teachers.module.css';

const Teachers = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [activeLevel, setActiveLevel] = useState('All');
    const [activeSubject, setActiveSubject] = useState('All Subjects');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const levels = ['All', 'Primary', 'Middle School', 'Secondary', 'Administration'];

    useEffect(() => {
        const fetchTeachers = async () => {
            const { data } = await supabase.from('teachers').select('*').order('name');
            if (data) {
                setTeachers(data);
            }
            setLoading(false);
        };
        fetchTeachers();
    }, []);

    // Extract unique subjects for the filter
    const subjects = useMemo(() => {
        const set = new Set<string>();
        teachers.forEach(t => {
            if (t.subjects && Array.isArray(t.subjects)) {
                t.subjects.forEach((s: string) => set.add(s));
            }
        });
        return ['All Subjects', ...Array.from(set).sort()];
    }, [teachers]);

    const filteredAndGrouped = useMemo(() => {
        let result = teachers;

        // Filter by Level
        if (activeLevel !== 'All') {
            result = result.filter(t => t.level === activeLevel);
        }

        // Filter by Subject
        if (activeSubject !== 'All Subjects') {
            result = result.filter(t => t.subjects?.includes(activeSubject));
        }

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.dept.toLowerCase().includes(query) ||
                t.subjects?.some((s: string) => s.toLowerCase().includes(query))
            );
        }

        // Group by Subject
        const groups: any = {};
        result.forEach(t => {
            const mainSubject = t.subjects && t.subjects.length > 0 ? t.subjects[0] : 'General';
            if (!groups[mainSubject]) groups[mainSubject] = [];
            groups[mainSubject].push(t);
        });

        return groups;
    }, [activeLevel, activeSubject, searchQuery, teachers]);

    return (
        <div className={styles.page}>
            <PageHeader
                title="Our Educators"
                subtitle="Dedicated professionals shaping the future with excellence and care."
            />

            <div className="container section">
                <div className={styles.controlsWrapper}>
                    <div className={styles.searchBox}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search by name, subject, or qualification..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className={styles.filterSection}>
                        <div className={styles.tabsContainer}>
                            <span className={styles.filterLabel}><Filter size={14} /> Level:</span>
                            <div className={styles.tabs}>
                                {levels.map(l => (
                                    <button
                                        key={l}
                                        className={`${styles.tab} ${activeLevel === l ? styles.active : ''}`}
                                        onClick={() => setActiveLevel(l)}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.tabsContainer}>
                            <span className={styles.filterLabel}><BookOpen size={14} /> Subject:</span>
                            <div className={styles.tabs}>
                                {subjects.map(s => (
                                    <button
                                        key={s}
                                        className={`${styles.tab} ${activeSubject === s ? styles.active : ''}`}
                                        onClick={() => setActiveSubject(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>
                        <Loader2 className="spinner" size={40} />
                        <p>Loading Faculty...</p>
                    </div>
                ) : (
                    <div className={styles.groupsContainer}>
                        {Object.keys(filteredAndGrouped).length > 0 ? (
                            Object.entries(filteredAndGrouped).map(([subject, members]: [string, any]) => (
                                <section key={subject} className={styles.subjectGroup}>
                                    <div className={styles.groupHeader}>
                                        <BookOpen size={20} />
                                        <h2>{subject}</h2>
                                        <span className={styles.count}>{members.length} {members.length === 1 ? 'Teacher' : 'Teachers'}</span>
                                    </div>
                                    <motion.div className={styles.grid} layout>
                                        <AnimatePresence mode="popLayout">
                                            {members.map((teacher: any) => (
                                                <motion.div
                                                    key={teacher.id}
                                                    className={styles.card}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                >
                                                    <div className={styles.imageWrapper}>
                                                        <img
                                                            src={teacher.image_url || logo}
                                                            alt={teacher.name}
                                                            className={!teacher.image_url ? styles.fallbackLogo : ''}
                                                        />
                                                    </div>
                                                    <div className={styles.info}>
                                                        <div className={styles.roleBadge}>{teacher.role}</div>
                                                        <h3 className={styles.name}>{teacher.name}</h3>
                                                        <p className={styles.qual}>{teacher.dept}</p>

                                                        {teacher.classes && teacher.classes.length > 0 && (
                                                            <div className={styles.classes}>
                                                                <Users size={14} />
                                                                <span>{teacher.classes.join(', ')}</span>
                                                            </div>
                                                        )}

                                                        <div className={styles.subjectsTags}>
                                                            {teacher.subjects?.map((s: string) => (
                                                                <span key={s} className={styles.subjectTag}>{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                </section>
                            ))
                        ) : (
                            <motion.div
                                className={styles.emptyState}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h3>No results found</h3>
                                <p>We couldn't find any educators matching your current search or filters.</p>
                                <button className="btn btn-secondary" onClick={() => { setActiveLevel('All'); setActiveSubject('All Subjects'); setSearchQuery(''); }}>
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teachers;
