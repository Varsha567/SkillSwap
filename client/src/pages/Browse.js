import Header from "../components/Header";
import SkillCard from '../components/SkillCard';
const Browse = () => {
     const skills = [
    { id: 1, title: 'UI Design', user: 'Alex', swapFor: 'Photography' },
    { id: 2, title: 'React Tutoring', user: 'Sam', swapFor: 'Copywriting' }
  ];

    return (
        <div className="browse-container">
            <Header isLoggedIn={false} />
            <h1>Browse Skills</h1> 
            <p>Explore skills available for swapping.</p>
            {/* Future implementation: Display a list of skills */}
            <main className="dashboard-main">
                <section className="hero-section">
                    <h1>Swap Your Skills Today</h1>
                    <div className="search-bar">
                        <input type="text" placeholder="Search skills..." />
                        <button className="btn-primary">Search</button>
                    </div>
                </section>
                <section className="skills-grid">
                {skills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
                ))}
                </section>
            </main>
        </div>
    );
}
export default Browse;