import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Megaphone, Users, LogOut } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import logo from "/images/Black-Yellow 3 (1).png";
const AdminLanding = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleLogout = () => {
    // Clear token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#ffe600",
          backgroundImage: "url('../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -10,
        }}
      />
      <div className="min-h-screen relative overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Albazar Logo" className="w-16 h-16" />
          </div>
        </div>

        {/* Main Buttons */}
        <div className="space-y-6 w-full max-w-sm">
          {/* Advertisements Button */}
          <button 
            onClick={() => navigate('/admin/listings')}
            className="w-full bg-black text-yellow-400 py-4 px-6 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center space-x-3 space-x-reverse"
          >
            <Megaphone className="w-6 h-6" />
            <span className="text-lg font-semibold">الإعلانات</span>
          </button>

          {/* Users Button */}
          <button 
            onClick={() => navigate('/admin/users')}
            className="w-full bg-black text-yellow-400 py-4 px-6 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center space-x-3 space-x-reverse"
          >
            <Users className="w-6 h-6" />
            <span className="text-lg font-semibold">المستخدمين</span>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="absolute bottom-6 right-6 bg-black text-yellow-400 p-3 rounded-lg shadow-lg hover:bg-gray-900 transition-all duration-300"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
    </>
  );
};

export default AdminLanding; 