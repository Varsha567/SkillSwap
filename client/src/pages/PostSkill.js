import Header from "../components/Header";
const PostSkill = () => {
    return (
        <div className="browse-container">
             <Header isLoggedIn={false} />
            <h1>Post Skills</h1>
            <p>Explore skills available for swapping.</p>
            {/* Future implementation: Display a list of skills */}
        </div>
    );
}
export default PostSkill;