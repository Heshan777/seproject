import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();

    useEffect(() => {
        // Query for companies where verificationStatus is 'pending'
        const q = query(collection(db, "companies"), where("verificationStatus", "==", "pending"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const companies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingCompanies(companies);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const handleVerification = async (companyId, newStatus) => {
        const companyRef = doc(db, 'companies', companyId);
        try {
            await updateDoc(companyRef, {
                verificationStatus: newStatus
            });
            alert(`Company has been ${newStatus}.`);
        } catch (error) {
            console.error("Error updating verification status:", error);
            alert("Failed to update status.");
        }
    };

    return (
        <div className="page-container">
            <h1>Admin Dashboard</h1>
            
            <div className="admin-section">
                <h2>Pending Company Approvals</h2>
                {loading ? <p>Loading...</p> : pendingCompanies.length > 0 ? (
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingCompanies.map(company => (
                                    <tr key={company.id}>
                                        <td>{company.companyName}</td>
                                        <td>{company.email}</td>
                                        <td className="action-buttons">
                                            <button onClick={() => handleVerification(company.id, 'approved')} className="approve-btn">Approve</button>
                                            <button onClick={() => handleVerification(company.id, 'rejected')} className="reject-btn">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No companies are currently pending approval.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;