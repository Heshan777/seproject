import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        if (!user) return;

        // Query to get all applications submitted by the current student
        const q = query(
            collection(db, "applications"), 
            where("studentId", "==", user.uid),
            orderBy("appliedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            setLoading(true);
            const appsPromises = querySnapshot.docs.map(async (appDoc) => {
                const appData = appDoc.data();
                
                // For each application, fetch the corresponding internship document
                const internshipRef = doc(db, "internships", appData.internshipId);
                const internshipSnap = await getDoc(internshipRef);
                
                const internshipData = internshipSnap.exists() ? internshipSnap.data() : {};

                return {
                    id: appDoc.id,
                    ...appData,
                    // Combine the data
                    internshipTitle: internshipData.title || appData.internshipTitle, // Use title from internship doc first
                    companyName: internshipData.companyName,
                };
            });

            // Wait for all the internship details to be fetched
            const populatedApps = await Promise.all(appsPromises);
            setApplications(populatedApps);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, db]);

    return (
        <div className="page-container">
            <h1>My Applications</h1>
            <p>Track the status of all your internship applications here.</p>
            
            {loading ? (
                <p>Loading your applications...</p>
            ) : applications.length > 0 ? (
                <div className="applications-list-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Internship Title</th>
                                <th>Company</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <Link to={`/internship/${app.internshipId}`} className="internship-title-link">
                                            {app.internshipTitle || 'Internship (Details Deleted)'}
                                        </Link>
                                    </td>
                                    <td>{app.companyName || 'N/A'}</td>
                                    <td>{app.appliedAt?.toDate().toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${app.status?.toLowerCase().replace(' ', '_')}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>You haven't applied to any internships yet. <Link to="/internships">Start browsing!</Link></p>
            )}
        </div>
    );
};

export default MyApplicationsPage;