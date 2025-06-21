import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const ViewApplicantsPage = () => {
    const [applicants, setApplicants] = useState([]);
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { internshipId } = useParams();
    const { user } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        if (!user) return;

        const fetchInternshipDetails = async () => {
            const docRef = doc(db, 'internships', internshipId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setInternship(docSnap.data());
        };
        fetchInternshipDetails();

        const q = query(
            collection(db, "applications"), 
            where("internshipId", "==", internshipId),
            where("companyId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            setLoading(true);
            const applicantPromises = querySnapshot.docs.map(async (appDoc) => {
                const appData = appDoc.data();
                
                // For each application, fetch the applicant's student profile
                const studentRef = doc(db, "students", appData.studentId);
                const studentSnap = await getDoc(studentRef);
                const studentData = studentSnap.exists() ? studentSnap.data() : {};

                return {
                    id: appDoc.id,
                    ...appData,
                    resumeUrl: studentData.resumeUrl || null // Get the resume URL from the student's profile
                };
            });

            const applicantList = await Promise.all(applicantPromises);
            setApplicants(applicantList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [internshipId, db, user]);

    // ... handleStatusChange function remains the same ...
    const handleStatusChange = async (applicationId, newStatus) => {
        const appDocRef = doc(db, 'applications', applicationId);
        try {
            await updateDoc(appDocRef, {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };


    return (
        <div className="page-container">
            <Link to="/company/dashboard">&larr; Back to Dashboard</Link>
            <h1>Applicants for {internship?.title || 'Internship'}</h1>
            
            {loading ? <p>Loading applicants...</p> : applicants.length > 0 ? (
                <div className="applicants-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Resume</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map(app => (
                                <tr key={app.id}>
                                    <td>{app.studentName}</td>
                                    <td>{app.studentEmail}</td>
                                    <td>
                                        {app.resumeUrl ? (
                                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-link">View Resume</a>
                                        ) : (
                                            'Not Provided'
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${app.status?.toLowerCase().replace(' ', '_')}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            value={app.status} 
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Under Review">Under Review</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>There are no applicants for this position yet.</p>
            )}
        </div>
    );
};

export default ViewApplicantsPage;