import PageHeader from '../components/PageHeader';
import styles from './About.module.css';
import logo from '../assets/logo.png';

const Management = () => {
    const members = [
        { title: "Chairman", name: "Mr. Rajesh Baruah", role: "Trustee & Visionary" },
        { title: "Secretary", name: "Mrs. Meena Sharma", role: "Educational Consultant" },
        { title: "Member", name: "Dr. Vikram Gogoi", role: "Academic Advisor" },
    ];

    return (
        <div>
            <PageHeader title="Management & Trust" subtitle="The pillars of Trinity Academy" />
            <div className="container section">
                <div className={styles.intro}>
                    <h2>Dedicated <span>Leadership</span></h2>
                    <p>Trinity Academy Silapathar is governed by a board of experienced educators and social workers committed to making quality education accessible to every child in our region.</p>
                </div>

                <div className={styles.teamGrid}>
                    {members.map((member, index) => (
                        <div key={index} className={styles.teamCard}>
                            <div className={styles.avatarPlaceholder}>
                                <img src={logo} alt="Logo" className={styles.watermark} />
                            </div>
                            <h3>{member.name}</h3>
                            <p className={styles.designation}>{member.title}</p>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Management;
