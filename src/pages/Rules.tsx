import PageHeader from '../components/PageHeader';
import { ShieldAlert, Info } from 'lucide-react';

const Rules = () => {
    const rules = [
        "Students must abide by the rules and regulations of the school at all times.",
        "The school diary should be brought to school every day.",
        "The student's personal record page must have all the required information regarding him/her.",
        "Leave from school should be applied in advance by the parents. It should be written in the \"Notes from parents\" page in the school diary. Exceptions are there only in case of an emergency.",
        "Students are not allowed to leave the school premises before due time without the prior permission of the principal.",
        "Record of absence from school should be written in the \"Absence Record\" page along with the reason.",
        "Students should wear the prescribed school uniform without any changes in colour and design. The uniform should always be neat and tidy.",
        "Students are asked not to bring any gadget or valuable item to the school.",
        "They should maintain a kind, gentle and helpful attitude towards everyone and at all time.",
        "Everyone must reflect high moral values and high standard of behavior inside and outside the school premises.",
        "Use of abusive language, bullying and torturing fellow students, etc. are strictly prohibited. Strict action must be taken against anyone found involved in such activities.",
        "Maintenance of cleanliness in and around the school premises is every student's responsibility. Thus, throwing of litters, pieces of paper, etc. anywhere else except the dustbin provided, must be avoided.",
        "All students must reach school on time and participate in the morning assembly.",
        "All students must actively participate in the co-curricular activities of the school.",
        "Maintain proper discipline and decorum in the school.",
        "Loitering here and there and running or playing in the corridor is strictly prohibited.",
        "Students are expected to handle the school property with utmost care. Theft or damage to the school property will be punishable.",
        "Use of unfair means in the classroom or during examinations is strictly prohibited.",
        "Homework should be completed and submitted on time.",
        "Bring textbooks and notebooks as per the daily time table or as instructed by the respective subject teacher.",
        "Overall performance of the student will be judged and the message will be given to the respective guardian during PTMs."
    ];

    return (
        <div>
            <PageHeader title="Rules & Regulations" subtitle="Maintaining a disciplined environment for growth" />
            <div className="container section">
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ background: 'var(--accent-light)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '3rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <ShieldAlert size={48} color="var(--primary)" />
                        <div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Code of Conduct</h3>
                            <p style={{ opacity: 0.8 }}>Every student is expected to maintain the highest standards of behavior and discipline to ensure a productive learning atmosphere.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {rules.map((rule, index) => (
                            <div key={index} style={{ background: 'white', padding: '1.2rem 1.5rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--secondary)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem' }}>
                                <span style={{ color: 'var(--secondary)', fontWeight: '700', minWidth: '25px' }}>{index + 1}.</span>
                                <p style={{ fontWeight: 500, margin: 0, lineHeight: '1.5' }}>{rule}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', background: 'var(--white)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                            <Info size={20} /> Note to Parents
                        </h4>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Parents are requested to cooperate with the school management in enforcing these rules for the benefit of their children's education and safety. Your support in ensuring these guidelines are followed helps us maintain a high standard of education.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rules;
