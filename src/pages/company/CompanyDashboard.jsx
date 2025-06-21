import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const CompanyDashboard = () => {
    const { user } = useAuth();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();

    // The logic to fetch internships remains the same
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "internships"), where("companyId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInternships(jobs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, db]);

    const renderVerificationStatus = () => {
        switch (user?.verificationStatus) {
            case 'approved':
                return (
                    <Link to="/company/post-internship" className="cta-button">
                        Post New Internship
                    </Link>
                );
            case 'pending':
                return <p className="status-badge status-under_review">Your profile is pending admin approval. You cannot post jobs yet.</p>;
            case 'rejected':
                return <p className="status-badge status-rejected">Your profile was rejected. Please contact support.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Company Dashboard</h1>
            <h2>Welcome, {user?.companyName || user?.email}!</h2>
            
            {renderVerificationStatus()}

            <div className="posted-internships">
                {/* ... internship list logic remains the same ... */}
            </div>
        </div>
    );
};

export default CompanyDashboard;