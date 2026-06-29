import PageHeader from '../components/PageHeader';
import directorImg from '../assets/director.jpg';
import styles from './About.module.css';

const DirectorMessage = () => {
    return (
        <div>
            <PageHeader title="Director's Message" subtitle="Vision for a brighter future" />
            <div className="container section">
                <div className={styles.aboutGrid}>
                    <div className={styles.imageCol}>
                        <img src={directorImg} alt="Director" className={styles.memberImg} />
                        <div className={styles.memberInfo}>
                            <h3>Mr. Pankaj Upadhyaya</h3>
                            <p>Director, Trinity Academy</p>
                        </div>
                    </div>
                    <div className={styles.contentCol}>
                        <h2>Education as a <span>Powerful Weapon</span></h2>
                        <p>“Education is the most powerful weapon which you can use to change the world”. These inspiring words by Nelson Mandela reminds us that school plays a vital role in shaping the future of a country.</p>

                        <p>Our institution is committed in providing quality education in a safe, caring and disciplined environment. We believe that education is not limited to textbooks. It goes beyond textbook to develop confidence, moral values, leadership qualities and a sense of responsibility towards society. We at Trinity Academy encourage our students to dream big, aim higher and work harder to achieve their goals.</p>

                        <blockquote>
                            "I wish all our students a bright future filled with knowledge, success and happiness."
                        </blockquote>

                        <p>With best wishes.</p>
                        <p><strong>Pankaj Upadhyaya</strong><br />Director, Trinity Academy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorMessage;
