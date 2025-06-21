import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const InternshipDetailPage = () => {
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState(null);
    
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const fetchInternshipAndCheckApplication = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "internships", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setInternship({ id: docSnap.id, ...docSnap.data() });
                    if (user && user.role === 'students') {
                        const applicationsQuery = query(collection(db, "applications"), where("internshipId", "==", id), where("studentId", "==", user.uid));
                        const querySnapshot = await getDocs(applicationsQuery);
                        if (!querySnapshot.empty) setApplied(true);
                    }
                } else console.log("No such document!");
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not load internship details.");
            } finally {
                setLoading(false);
            }
        };
        fetchInternshipAndCheckApplication();
    }, [id, db, user]);

    const handleApply = async () => {
        if (!user) {
            setError("Please log in to apply.");
            navigate('/student/login');
            return;
        }

        if (!user.fullName || !internship?.companyId) {
            setError("Cannot apply: User or company data is missing.");
            return;
        }
        
        setApplying(true);
        setError(null);
        try {
            await addDoc(collection(db, "applications"), {
                internshipId: id,
                internshipTitle: internship.title,
                studentId: user.uid,
                studentName: user.fullName,
                studentEmail: user.email,
                companyId: internship.companyId,
                status: 'Applied',
                appliedAt: serverTimestamp(),
            });
            setApplied(true);
        } catch (err) {
            console.error("Error submitting application:", err);
            setError("Failed to submit application. Please check your permissions and try again.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!internship) return <div className="page-container"><h2>Internship not found</h2></div>;

    const postedDate = internship.postedAt?.toDate().toLocaleDateString();

    return (
        <div className="page-container detail-page-container">
            <div className="detail-card">
                <span className="category-tag">{internship.category}</span>
                <h1>{internship.title}</h1>
                <h2>{internship.companyName}</h2>
                <p className="posted-date">Posted on: {postedDate}</p>
                <hr />
                <h3>Job Description</h3>
                <p className="description-text">{internship.description}</p>
                
                {user?.role === 'students' && (
                    <button 
                        onClick={handleApply} 
                        className="cta-button apply-button" 
                        disabled={applied || applying}
                    >
                        {applying ? 'Submitting...' : applied ? 'Applied' : 'Apply Now'}
                    </button>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default InternshipDetailPage;
