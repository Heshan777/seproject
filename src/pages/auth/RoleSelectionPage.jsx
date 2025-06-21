import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelectionPage = () => {
  return (
    <div className="auth-container role-selection">
      <div className="auth-form">
        <h2>Welcome to InternLink</h2>
        <p>Connecting Students with Companies</p>
        <div className="role-buttons">
          <Link to="/student/login" className="role-button">
            I am a Student
          </Link>
          <Link to="/company/login" className="role-button">
            I am a Company
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RoleSelectionPage;