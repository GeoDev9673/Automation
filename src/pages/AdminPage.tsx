import React, { useState, useEffect } from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { AdminLogin } from '../components/AdminLogin';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if session is already active in localStorage
    const auth = localStorage.getItem('paralife_admin_auth') === 'true';
    setIsAuthenticated(auth);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleExit = () => {
    localStorage.removeItem('paralife_admin_auth');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#0e0f12] text-[#F2EEE8] selection:bg-[#FF2D85]/30">
      {isAuthenticated ? (
        <AdminPanel onClose={handleExit} />
      ) : (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onCancel={() => {
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
};
