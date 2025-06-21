import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

const CompanyProfilePage = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ companyName: '', website: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const db = getFirestore();

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            const docRef = doc(db, 'companies', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData({
                    companyName: data.companyName || '',
                    website: data.website || '',
                    description: data.description || '',
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user, db]);

    const handleSave = async (e) => {
        e.preventDefault();
        const docRef = doc(db, 'companies', user.uid);
        try {
            await updateDoc(docRef, profileData);
            alert("Profile updated successfully!");
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };
    
    if (loading) return <div className="loading-container">Loading Profile...</div>

    return (
        <div className="page-container">
            <h1>Company Profile</h1>
            <div className="profile-card">
                {!editing ? (
                    <div>
                        <p><strong>Company Name:</strong> {profileData.companyName}</p>
                        <p><strong>Website:</strong> {profileData.website ? <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a> : 'Not set'}</p>
                        <p><strong>Description:</strong> {profileData.description || 'Not set'}</p>
                        <button onClick={() => setEditing(true)} className="cta-button">Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" value={profileData.companyName} onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Website</label>
                            <input type="url" value={profileData.website} onChange={(e) => setProfileData({...profileData, website: e.target.value})} placeholder="[https://example.com](https://example.com)" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={profileData.description} onChange={(e) => setProfileData({...profileData, description: e.target.value})} rows="5" />
                        </div>
                        <button type="submit" className="cta-button">Save Changes</button>
                        <button type="button" onClick={() => setEditing(false)} className="secondary-button">Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CompanyProfilePage;