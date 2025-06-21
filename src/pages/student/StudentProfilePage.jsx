import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '../../hooks/useAuth';

const StudentProfilePage = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ fullName: '', skills: '', education: '', resumeUrl: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    
    const db = getFirestore();
    const storage = getStorage();

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            setLoading(true);
            const docRef = doc(db, 'students', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData({
                    fullName: data.fullName || '',
                    skills: data.skills || '',
                    education: data.education || '',
                    resumeUrl: data.resumeUrl || '',
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user, db]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return;
        setUploading(true);
        // Create a storage reference: 'resumes/USER_ID/FILENAME'
        const storageRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
        
        try {
            // Upload the file
            await uploadBytes(storageRef, resumeFile);
            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            
            // Save the URL to the user's profile in Firestore
            const docRef = doc(db, 'students', user.uid);
            await updateDoc(docRef, { resumeUrl: downloadURL });

            setProfileData({...profileData, resumeUrl: downloadURL});
            alert("Resume uploaded successfully!");
            setResumeFile(null); // Clear the file input
        } catch (error) {
            console.error("Error uploading resume: ", error);
            alert("Failed to upload resume.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const docRef = doc(db, 'students', user.uid);
        try {
            await updateDoc(docRef, {
                fullName: profileData.fullName,
                skills: profileData.skills,
                education: profileData.education
            });
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
            <h1>My Profile</h1>
            <div className="profile-card">
                {!editing ? (
                    <div>
                        <p><strong>Full Name:</strong> {profileData.fullName}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Skills:</strong> {profileData.skills || 'Not set'}</p>
                        <p><strong>Education:</strong> {profileData.education || 'Not set'}</p>
                        <p><strong>Resume:</strong> 
                            {profileData.resumeUrl 
                                ? <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a> 
                                : 'Not uploaded'
                            }
                        </p>
                        <button onClick={() => setEditing(true)} className="cta-button">Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleSave}>
                        {/* ... form fields for fullName, skills, education ... */}
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Skills</label>
                            <textarea value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})} placeholder="e.g., React, Node.js, Python" />
                        </div>
                        <div className="form-group">
                            <label>Education</label>
                            <textarea value={profileData.education} onChange={(e) => setProfileData({...profileData, education: e.target.value})} placeholder="e.g., B.Sc. in Computer Science" />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="cta-button">Save Changes</button>
                            <button type="button" onClick={() => setEditing(false)} className="secondary-button">Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Resume Upload Section */}
            <div className="profile-card resume-upload-section">
                <h3>Upload or Replace Resume</h3>
                <p>Please upload your resume in PDF format.</p>
                <input type="file" onChange={handleFileChange} accept=".pdf" />
                <button onClick={handleResumeUpload} disabled={!resumeFile || uploading} className="cta-button">
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </div>
    );
};

export default StudentProfilePage;