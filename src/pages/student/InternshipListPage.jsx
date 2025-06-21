import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const InternshipListPage = () => {
    const [allInternships, setAllInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const db = getFirestore();

    useEffect(() => {
        const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllInternships(jobs);
            setFilteredInternships(jobs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [db]);

    useEffect(() => {
        let results = allInternships;

        if (searchTerm) {
            results = results.filter(job => 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            results = results.filter(job => job.category === selectedCategory);
        }

        setFilteredInternships(results);
    }, [searchTerm, selectedCategory, allInternships]);


    return (
        <div className="page-container">
            <h1>Explore Opportunities</h1>
            <p>Find the perfect internship to kickstart your career.</p>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search by title or company..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                </select>
            </div>


            {loading ? (
                <div className="loading-container">Loading internships...</div>
            ) : (
                <div className="internship-grid">
                    {filteredInternships.length > 0 ? (
                        filteredInternships.map((job) => (
                            <Link to={`/internship/${job.id}`} key={job.id} className="internship-card">
                                <h3>{job.title}</h3>
                                <h4>{job.companyName}</h4>
                                <span className="category-tag">{job.category}</span>
                            </Link>
                        ))
                    ) : (
                        <p>No internships match your search criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default InternshipListPage;