// 1. NEW FILE: src/pages/company/PostInternshipPage.jsx
// This is the new page with the form for creating an internship.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const PostInternshipPage = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Technology'); // Default category
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!user) {
            setError("You must be logged in to post an internship.");
            setLoading(false);
            return;
        }

        try {
            // Add a new document to the 'internships' collection
            await addDoc(collection(db, 'internships'), {
                title,
                category,
                description,
                companyId: user.uid, // Link the internship to the logged-in company
                companyName: user.companyName,
                postedAt: serverTimestamp(), // Use server time for consistency
            });

            // On success, navigate back to the company dashboard
            navigate('/company/dashboard');

        } catch (err) {
            console.error("Error posting internship:", err);
            setError("Failed to post internship. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form internship-form">
                <h2>Post a New Internship</h2>
                
                <div className="form-group">
                    <label htmlFor="title">Internship Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Software Engineering Intern"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the role, responsibilities, and requirements."
                        rows="6"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Internship'}
                </button>
            </form>
        </div>
    );
};

export default PostInternshipPage;