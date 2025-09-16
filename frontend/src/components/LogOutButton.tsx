
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth(); // Assuming you have a logout function in your AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="btn-primary"
      style={{ fontSize: '14px' }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;