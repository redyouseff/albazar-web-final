import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BarChart3, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import showUsersForAdminHook from '../Hook/admin/showUsersForAdminHook';

import backIcon from "/images/Group4.svg"

const ShowUsersForAdmin = () => {

  
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();  

  const {
    loading,
    users,
    currentPage,    
    limit,
    paginate,
    handlePageChange,
    handleSearch,
    searchKeyword
  } = showUsersForAdminHook();
  
  console.log('Page Debug:', {
    loading,
    users: users?.length,
    searchKeyword,
    paginate
  });
  
  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleViewProfile = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    handleSearch(value);
  };
     
  return (
    <div className="min-h-screen bg-gray-100 p-4">   
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBackToAdmin}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <img src={backIcon} alt="رجوع" className="w-8 h-8" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto">
        {/* Yellow Header Section */}
        <div className="bg-yellow-400 rounded-xl p-6 mb-6 shadow-lg">    
          <div className="flex items-center justify-between">
            {/* Right Side - Users Icon and Text */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <Users className="w-8 h-8 text-black" />
              <span className="text-black text-xl font-semibold">عدد المستخدمين</span>   
            </div>
            
            {/* Left Side - Count and Chart Icon */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-black text-2xl font-bold">({(paginate?.totalResults || 0).toString().padStart(7, '0')})</span>
              <BarChart3 className="w-6 h-6 text-black" />
            </div>
          </div>     
        </div>

        {/* Search Field */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="البحث عن مستخدم..."
              dir="rtl"
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-[2rem] text-right focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white shadow-sm text-gray-900"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Users List Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-500">جاري تحميل المستخدمين...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id || user.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      {/* Right Side - User Info */}
                      <div className="flex items-center space-x-4 space-x-reverse">
                        {/* User Avatar */}
                        {user.profileImage ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={user.profileImage} 
                              alt={`${user.firstname} ${user.lastname}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center" style={{display: 'none'}}>
                              <span className="text-white text-sm font-medium">
                                {user.firstname?.charAt(0)?.toUpperCase()}{user.lastname?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.firstname?.charAt(0)?.toUpperCase()}{user.lastname?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        {/* User Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {user.firstname} {user.lastname}
                          </h3>
                          <p className="text-sm text-gray-500">
                            مشترك منذ {new Date(user.createdAt).getFullYear()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Left Side - View Profile Link */}
                      <button
                        onClick={() => handleViewProfile(user._id || user.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                      >
                        عرض الملف
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">لا يوجد مستخدمين</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {paginate && paginate.numbeOfPage > 1 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                عرض {((currentPage - 1) * limit) + 1} إلى {Math.min(currentPage * limit, paginate.totalResults)} من {paginate.totalResults} مستخدم
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage <= 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  صفحة {currentPage} من {paginate.numbeOfPage}
                </span>
                
                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= paginate.numbeOfPage}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage >= paginate.numbeOfPage
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowUsersForAdmin; 