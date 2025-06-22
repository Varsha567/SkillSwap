        import React, { useState, useEffect } from 'react';
        // Header is rendered by Layout, so no Header import needed here
        import SkillCard from '../components/SkillCard'; // Make sure SkillCard exists
        import { Link } from 'react-router-dom'; // Keep Link for routing
        // No need for useAuth here unless specific Browse content changes based on auth status

        const Browse = () => { // No longer accepts isAuthenticated, onLogout props
            const [skills, setSkills] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [searchTerm, setSearchTerm] = useState('');

            useEffect(() => {
                const fetchSkills = async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        const response = await fetch('http://localhost:5000/api/skills');
                        const data = await response.json();

                        if (response.ok) {
                            setSkills(data.listings || []);
                        } else {
                            setError(data.message || 'Failed to fetch skills.');
                            console.error('Failed to fetch skills:', data);
                        }
                    } catch (err) {
                        console.error('Network error fetching skills:', err);
                        setError('An error occurred while fetching skills. Please try again later.');
                    } finally {
                        setLoading(false);
                    }
                };

                fetchSkills();
            }, []);

            const handleSearchChange = (e) => {
                setSearchTerm(e.target.value);
            };

            const handleSearchSubmit = (e) => {
                e.preventDefault();
                console.log("Searching for:", searchTerm);
                // Future: Implement actual search logic by refetching skills with a query parameter
            };

            if (loading) {
                return (
                    <main className="flex-grow flex justify-center items-center bg-gray-100 py-8">
                        <p>Loading skills...</p>
                    </main>
                );
            }

            if (error) {
                return (
                    <main className="flex-grow flex justify-center items-center bg-gray-100 py-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </main>
                );
            }

            return (
                <main className="flex-grow py-8 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <section className="hero-section text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">Swap Your Skills Today</h1>
                            <p className="text-lg text-gray-600 mb-6">Explore skills available for swapping.</p>
                            <form onSubmit={handleSearchSubmit} className="search-bar flex justify-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="shadow appearance-none border rounded w-full max-w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Search
                                </button>
                            </form>
                        </section>

                        <section className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.length > 0 ? (
                                skills.map(skill => (
                                    <SkillCard key={skill._id} skill={skill} />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-600">No skills available to browse yet.</p>
                            )}
                        </section>
                    </div>
                </main>
            );
        };

        export default Browse;
        