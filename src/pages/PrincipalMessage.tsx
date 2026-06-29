import PageHeader from '../components/PageHeader';
import principalImg from '../assets/principal.jpg';
import styles from './About.module.css';

const PrincipalMessage = () => {
    return (
        <div>
            <PageHeader title="Principal's Message" subtitle="A word from our leadership" />
            <div className="container section">
                <div className={styles.aboutGrid}>
                    <div className={styles.imageCol}>
                        <img src={principalImg} alt="Principal" className={styles.memberImg} />
                        <div className={styles.memberInfo}>
                            <h3>Mrs Sumita Sarma Upadhyaya</h3>
                            <p>Principal, Trinity Academy</p>
                        </div>
                    </div>
                    <div className={styles.contentCol}>
                        <h2>Inspiring <span>Young Learners</span></h2>
                        <p>We at Trinity Academy believe that education is not only about teaching and learning. It is also about inspiring learners to follow their dreams. Our school aims at creating young learners to be confident, compassionate, capable and curious of facing the challenges of the world.</p>

                        <p>I take this opportunity to thank all the students, teachers, parents and guardians for their unwavering love and support which motivates us to grow stronger day by day. We will continue to uphold discipline, integrity and a passion for learning amongst our students.</p>

                        <blockquote>
                            "May our students prosper and grow into responsible and respectable citizen of our country."
                        </blockquote>

                        <p>With best wishes.</p>
                        <p><strong>Mrs Sumita Sarma Upadhyaya</strong><br />Principal, Trinity Academy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrincipalMessage;
