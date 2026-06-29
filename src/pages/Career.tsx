import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Briefcase, MapPin, Clock, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import styles from './Career.module.css';

const Career = () => {
    const [jobs, setJobs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchJobs = async () => {
            const { data } = await supabase
                .from('job_vacancies')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (data) setJobs(data);
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const formatDeadline = (dead: string) => {
        if (!dead) return '';
        return new Date(dead).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div>
            <PageHeader title="Careers" subtitle="Join our dedicated faculty and staff team" />
            <div className="container section">
                <div className={styles.intro}>
                    <h2>Current <span>Vacancies</span></h2>
                    <p>We are always looking for passionate educators who want to make a difference in children's lives. Explore our current openings below.</p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>
                        <Loader2 className="animate-spin" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ marginLeft: '0.75rem', fontWeight: 500 }}>Loading openings...</span>
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '1rem', color: '#64748b' }}>
                        <Briefcase size={40} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>No active openings at the moment.</p>
                    </div>
                ) : (
                    <div className={styles.jobList}>
                        {jobs.map((job, index) => (
                            <div key={job.id || index} className={styles.jobCard}>
                                <div className={styles.jobInfo}>
                                    <div className={styles.jobHeader}>
                                        <Briefcase size={24} color="var(--primary)" />
                                        <h3>{job.title}</h3>
                                    </div>
                                    <div className={styles.jobDetails}>
                                        <span><Clock size={16} /> {job.type}</span>
                                        <span><Calendar size={16} /> Experience: {job.experience || '1+ Year'}</span>
                                        <span><MapPin size={16} /> {job.location || 'Silapathar Campus'}</span>
                                    </div>
                                </div>
                                <div className={styles.jobAction}>
                                    {job.deadline && <p className={styles.deadline}>Deadline: {formatDeadline(job.deadline)}</p>}
                                    <Link
                                        to="/career/apply"
                                        state={{ jobTitle: job.title }}
                                        className="btn btn-primary"
                                    >
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.generalApply}>
                    <h3>Don't see a matching role?</h3>
                    <p>Send your CV to <strong>careers@trinityacademysilapathar.com</strong> and we'll contact you when a relevant vacancy arises.</p>
                </div>
            </div>
        </div>
    );
};

export default Career;

