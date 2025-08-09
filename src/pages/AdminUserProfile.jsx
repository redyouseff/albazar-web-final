import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building, ChevronDown } from 'lucide-react';
import GetSpesificUrerHook from '../Hook/user/GetSpesificUrerHook';

import birthDayIcon  from "/images/Vector2.svg"
import cityIcon from "/images/Vector3.svg"
import backIcon from "/images/Group4.svg"


const AdminUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use the fixed hook
  const { userData, numberOfListing, loading, error, hasUserData } = GetSpesificUrerHook(id);

  const handleBack = () => {
    navigate('/admin/users');
  };

  // Show loading spinner while user data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">جاري تحميل بيانات المستخدم...</p>
          <p className="text-gray-400 text-sm mt-2">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }

  // Show error if user not found or no data
  if (error || !hasUserData || !userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-6">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 text-xl font-medium mb-4">
            {error || "لم يتم العثور على بيانات المستخدم"}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            تأكد من صحة معرف المستخدم أو حاول مرة أخرى
          </p>
          <button 
            onClick={handleBack} 
            className="bg-black text-yellow-400 px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            العودة لقائمة المستخدمين
          </button>
        </div>  
      </div>
    );
  }

  // Only render the main content if we have valid data and not loading
  if (!userData || loading) {
    return null;   
  }

  return (
    <div className="min-h-screen bg-gray-100 font-['Cairo']">
      {/* Back Button - Outside Container */}
      <div className="p-4">
        <button
          onClick={handleBack}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <img src={backIcon} alt="رجوع" className="w-8 h-8" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 font-['Noon']">
        {/* Yellow Header Section */}
        <div className="bg-yellow-400 rounded-[3rem] p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Right Side - User Info */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* User Avatar */}
              {userData?.profileImage ? (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={userData.profileImage} 
                    alt={`${userData.firstname} ${userData.lastname}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white text-lg font-medium">
                      {userData.firstname?.charAt(0)?.toUpperCase()}{userData.lastname?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {userData?.firstname?.charAt(0)?.toUpperCase()}{userData?.lastname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* User Details */}
              <div className="text-right">
                <h1 className="text-black text-2xl font-bold mb-1">
                  {userData?.firstname} {userData?.lastname}
                </h1>
                <p className="text-black text-sm font-medium">
                  مشترك منذ {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : '20xx'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics Section */}
        <div className="bg-gray-200 rounded-[3rem] p-6 mb-6 shadow-lg">
          <h2 className="text-gray-800 text-lg font-bold mb-4 text-right">
            عدد الإعلانات الخاصة بالحساب
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-gray-700 text-sm mb-1 font-semibold">الرصيد</div>
              <div className="text-2xl font-bold text-gray-900">{userData?.Balance || 0}</div>
            </div>
            <div className="text-center relative">
              <div className="text-gray-700 text-sm mb-1 font-semibold">المتبقي</div>
              <div className="text-2xl font-bold text-gray-900">
                {numberOfListing === 0 ? "مفتوح" : numberOfListing}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-white rounded-[3rem] shadow-lg p-6">
          <div className="space-y-6">
            {/* First Name */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                الاسم الأول
              </label>
              <input
                type="text"
                value={userData?.firstname || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                placeholder="الاسم المدخل"
              />
            </div>

            {/* Last Name */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                الاسم الأخير
              </label>
              <input
                type="text"
                value={userData?.lastname || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                placeholder="الاسم المدخل"
              />
            </div>

            {/* Mobile Number */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                رقم الموبايل
              </label>
              <input
                type="tel"
                value={userData?.phone || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                placeholder="الرقم المدخل"
              />
            </div>

            {/* Email */}
            <div className="text-right">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                البريد الالكتروني
              </label>
              <input
                type="email"
                value={userData?.email || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                placeholder="الايميل المدخل"
              />
            </div>

            {/* Date of Birth */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                تاريخ الميلاد
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userData?.birthday ? new Date(userData.birthday).toLocaleDateString('ar-EG') : ''}
                  readOnly
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                  placeholder="التاريخ"
                />
                <img src={birthDayIcon} alt="تاريخ الميلاد" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
              </div>
            </div>

            {/* City */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                المدينة
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userData?.city || ''}
                  readOnly
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                  placeholder="المدينة المدخلة"
                />
                <img src={cityIcon} alt="المدينة" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
              </div>
            </div>

            {/* Account Status */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                حالة الحساب
              </label>
              <input
                type="text"
                value={userData?.active ? "نشط" : "غير نشط"}
                readOnly
                className={`w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none font-semibold ${
                  userData?.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
                placeholder="حالة الحساب"
              />
            </div>

            {/* Followers Count */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                عدد المتابعين
              </label>
              <input
                type="text"
                value={userData?.followers?.length || 0}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                placeholder="عدد المتابعين"
              />
            </div>

            {/* Following Count */}
            <div className="text-right">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                عدد المتابَعين
              </label>
              <input
                type="text"
                value={userData?.following?.length || 0}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-[3rem] text-right focus:outline-none bg-gray-50 text-gray-600 font-semibold"
                placeholder="عدد المتابَعين"
              />
            </div>
          </div>
        </div>
        
        {/* Extra spacing at bottom for scrolling */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default AdminUserProfile; 