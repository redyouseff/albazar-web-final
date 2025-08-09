import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser as updateUserAction } from '../redux/Actions/UserActions';
import { toast } from "../components/ui/sonner";
import icon1 from "/images/my-account/Vector.png"
import icon2 from "/images/my-account/Frame 246.png"
import icon3 from "/images/my-account/Vector (1).png"

import icon4 from "/images/my-account/uil_calender.png"
import icon5 from "/images/my-account/1.png"
import icon6 from "/images/my-account/1.png"
import icon7 from "/images/my-account/2.png"

import icon8 from "/images/my-account/Vector (2).png"
import icon9 from "/images/my-account/Vector (3).png"
import { GetLogedUserHook } from '../Hook/user/GetLogedUserHook';
import ChangePasswordHook from '../Hook/user/ChangePasswordHook';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import LogoutDarkmode from "/images/Logout Icon.svg";
import TelephoneDarkmode from "/images/Telephone Yellow.svg";
import MyAccountIconDarkmode from "/images/my-account/My Account.svg";


const MyAccount = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  
  // استخدام useSelector للحصول على حالة الطلب من Redux
  const updateUserResponse = useSelector((state) => state.user.updateUser);
  
  const {
    user,
    loading: userLoading,
    error: userError,
    refetch,
    isAuthenticated,
    hasUserData
  } = GetLogedUserHook();

  const {
    updatePassword,
    loading,
    error,
    success,
    formErrors,
    clearState,
  } = ChangePasswordHook();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    about: '',
    email: '',
    phone: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    city: '',
    profileImage: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // مراقبة استجابة تحديث المستخدم من Redux
  useEffect(() => {
    if (updateUserResponse && isUpdating) {
      console.log('Update response:', updateUserResponse);
      
      if (updateUserResponse.status === 200) {
        // نجح التحديث
        setShowSuccessMessage(true);
        setIsUpdating(false);
        
        // تحديث localStorage
        try {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const updatedUser = {
            ...currentUser,
            ...form,
            profileImage: updateUserResponse.data?.profileImage || currentUser.profileImage
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
        
        toast("تم تحديث البيانات", {
          description: "تم تحديث معلومات حسابك بنجاح",
          duration: 3000,
          style: { 
            background: '#10B981',
            color: 'white',
            direction: 'rtl'
          }
        });
        
        // إخفاء رسالة النجاح بعد 3 ثوان
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // تحديث بيانات المستخدم
        refetch();
        
      } else if (updateUserResponse.status >= 400 || updateUserResponse.response?.status >= 400) {
        // فشل التحديث
        setIsUpdating(false);
        const errorMessage = updateUserResponse.data?.message || 
                           updateUserResponse.response?.data?.message || 
                           "حدث خطأ في تحديث البيانات";
        
        toast("خطأ في التحديث", {
          description: errorMessage,
          duration: 3000,
          style: { 
            background: '#EF4444',
            color: 'white',
            direction: 'rtl'
          }
        });
      }
    }
  }, [updateUserResponse, isUpdating]);

  // Update form when user data is loaded
  useEffect(() => {
    if (hasUserData && user?.data) {
      // تنسيق التاريخ بشكل صحيح
      let formattedBirthday = '';
      if (user.data.birthday) {
        try {
          const date = new Date(user.data.birthday);
          if (!isNaN(date.getTime())) {
            formattedBirthday = date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error('Error formatting birthday:', error);
        }
      }
      
      setForm(prev => ({
        ...prev,
        firstname: user.data.firstname || '',
        lastname: user.data.lastname || '',
        about: user.data.about || '',
        email: user.data.email || '',
        phone: user.data.phone || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
        birthday: formattedBirthday,
        city: user.data.city || '',
        profileImage: user.data.profileImage || ''
      }));
      
      // Set image preview if user has profile image
      if (user.data.profileImage) {
        setImagePreview(user.data.profileImage);
      }
    }
  }, [user, hasUserData]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear success message when user starts typing
    if (showSuccessMessage) {
      setShowSuccessMessage(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setValidationErrors(prev => ({ ...prev, image: 'يجب اختيار صورة صحيحة' }));
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({ ...prev, image: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' }));
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (validationErrors.image) {
        setValidationErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!form.firstname.trim()) {
      errors.firstname = 'الاسم الأول مطلوب';
    }
    
    if (!form.lastname.trim()) {
      errors.lastname = 'الاسم الأخير مطلوب';
    }
    
    if (!form.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!form.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isUpdating) return; // منع التقديم المتعدد
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Prepare data for API
    const updateData = {
      firstname: form.firstname,
      lastname: form.lastname,
      about: form.about,
      email: form.email,
      phone: form.phone,
      city: form.city,
      birthday: form.birthday
    };
    
    // إعداد البيانات للإرسال
    let formData;
    if (selectedImage) {
      formData = new FormData();
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
          formData.append(key, updateData[key]);
        }
      });
      formData.append('profileImage', selectedImage);
    } else {
      formData = Object.keys(updateData).reduce((acc, key) => {
        if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
          acc[key] = updateData[key];
        }
        return acc;
      }, {});
    }
    
    setIsUpdating(true);
    dispatch(updateUserAction(formData));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Check if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>يجب تسجيل الدخول أولاً</h2>
            <button 
              onClick={() => window.location.href = "/login"}
              className="bg-black text-yellow-400 px-6 py-2 rounded-lg"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Loading state
  if (userLoading) {
    return (
      <Layout>
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>جاري تحميل البيانات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (userError) {
    return (
      <Layout>
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {userError}
            </div>
            <button 
              onClick={refetch}
              className="bg-black text-yellow-400 px-6 py-2 rounded-lg"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (  
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-20`} dir="rtl">
        {/* Header */}
        <div className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-[#F6F9FE]'} border-t-2 border-yellow-300 shadow-md flex flex-col items-center py-4 mb-8`}>
          <span className={`flex items-center gap-3 text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <img src={isDarkMode ? MyAccountIconDarkmode : icon1} alt="حسابي" className="w-10 h-10" />
            <span style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: 24 }}>حسابي</span>
          </span>
        </div>
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
              تم تحديث البيانات بنجاح!
            </div>
          )}
          
          {/* User Info Box */}
          <div className={`w-full flex flex-row-reverse items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-[#F6F9FE]'} rounded-full px-8 py-4 mb-4`}>
            <div className="flex flex-row-reverse items-center gap-4 w-full">
              <div className="flex flex-col items-end w-full">
                <span className={`text-xl ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-right w-full`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>
                  {hasUserData ? `${user.data.firstname} ${user.data.lastname}` : 'اسم المستخدم'}
                </span>
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1 text-right w-full`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>
                  {hasUserData ? `مشترك منذ ${new Date(user.data.createdAt).getFullYear()}` : 'مشترك منذ 20xx'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image-upload"
                />
                <label
                  htmlFor="profile-image-upload"
                  className={`flex items-center justify-center w-12 h-12 cursor-pointer rounded-full overflow-hidden hover:opacity-80 transition-opacity border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-yellow-400' : 'border-gray-300 hover:border-yellow-400'}`}
                  title="اضغط لتغيير الصورة الشخصية"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="الصورة الشخصية" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <img src={icon2} alt="اسم المستخدم" className="w-6 h-6 opacity-70" />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>صورة</span>
                    </div>
                  )}
                </label>
                {validationErrors.image && (
                  <span className="absolute -bottom-4 right-0 text-red-500 text-xs whitespace-nowrap">
                    {validationErrors.image}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* My Ads Box */}
          <Link
          to="/my-ads"
                           
          >
          <div className={`w-full flex flex-row-reverse justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-[#F6F9FE]'} rounded-full px-6 py-3 mb-8`}>
            <span className="flex items-center justify-center w-8 h-8">
              <img src={icon3} alt="سهم إعلاناتي" className="w-3 h-3" />
            </span>
            <span className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>إعلاناتي</span>
          </div>
          
          </Link>
         
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Account Name */}
            <div>
              <label className={`block text-[20px] mb-2 text-right ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>اسم الحساب</label>
              <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4 text-right`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>هذا الاسم سوف يظهر على الحساب</span>
              <div className="flex gap-4 flex-row-reverse">
                <div className="relative w-1/2">
                  <label htmlFor="firstname" className={`absolute right-4 -top-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Noor', fontWeight: 400, pointerEvents: 'none' }}>الاسم الأول</label>
                  <input 
                    type="text" 
                    id="firstname" 
                    value={form.firstname}
                    onChange={(e) => handleFieldChange('firstname', e.target.value)}
                    className={`w-full p-4 pt-6 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.firstname ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                    style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                  />
                  {validationErrors.firstname && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.firstname}</span>}
                </div>
                <div className="relative w-1/2">
                  <label htmlFor="lastname" className={`absolute right-4 -top-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Noor', fontWeight: 400, pointerEvents: 'none' }}>الاسم الأخير</label>
                  <input 
                    type="text" 
                    id="lastname" 
                    value={form.lastname}
                    onChange={(e) => handleFieldChange('lastname', e.target.value)}
                    className={`w-full p-4 pt-6 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.lastname ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                    style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                  />
                  {validationErrors.lastname && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.lastname}</span>}
                </div>
              </div>
            </div>
            {/* Password */}
            <div>
              <label className={`block text-[20px] mb-6 text-right ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تغيير كلمة مرور جديدة</label>
              <div className="relative w-full mb-6">
                <label htmlFor="currentPassword" className={`absolute right-4 -top-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Noor', fontWeight: 400, pointerEvents: 'none' }}>كلمة المرور الحالية</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  value={form.currentPassword}
                  onChange={(e) => handleFieldChange('currentPassword', e.target.value)}
                  className={`w-full p-4 pt-6 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.currentPassword ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                  style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                />
                {validationErrors.currentPassword && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.currentPassword}</span>}
              </div>
              <div className="relative w-full mb-6">
                <label htmlFor="password" className={`absolute right-4 -top-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Noor', fontWeight: 400, pointerEvents: 'none' }}>كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  id="password" 
                  value={form.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  className={`w-full p-4 pt-6 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.password ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                  style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                />
                {validationErrors.password && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.password}</span>}
              </div>
              <div className="relative w-full mb-4">
                <label htmlFor="confirmPassword" className={`absolute right-4 -top-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Noor', fontWeight: 400, pointerEvents: 'none' }}>تأكيد كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={form.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  className={`w-full p-4 pt-6 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.confirmPassword ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                  style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                />
                {validationErrors.confirmPassword && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.confirmPassword}</span>}
              </div>
              <button 
                type="button"
                onClick={async () => {
                  const result = await updatePassword(form.currentPassword, form.password, form.confirmPassword);
                  
                  if (result.success) {
                    // مسح حقول كلمة المرور
                    setForm(prev => ({ 
                      ...prev, 
                      currentPassword: '',
                      password: '', 
                      confirmPassword: '' 
                    }));
                    setValidationErrors({});
                    
                    // عرض رسالة نجاح لثانيتين ثم التحويل لصفحة تسجيل الدخول
                    setTimeout(() => {
                      // مسح بيانات المستخدم وتسجيل الخروج
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      // التحويل لصفحة تسجيل الدخول
                      window.location.href = "/login";
                    }, 2000);
                    
                  } else if (result.errors) {
                    setValidationErrors(result.errors);
                  }
                }}
                disabled={loading || !form.currentPassword || !form.password || !form.confirmPassword}
                className="w-full bg-black text-[#FFD700] py-3 rounded-xl text-base font-bold transition-all duration-200 hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{ fontFamily: 'Cairo', fontWeight: 700 }}
              >
                {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
              </button>
            </div>
            {/* Account Details */}
            <div>
              <label className={`block text-[20px] mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تفاصيل الحساب</label>
              <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>هذه المعلومات لا تظهر للمستخدمين</span>
              <div className="space-y-4">
                <div className="relative w-full">
                  <label htmlFor="birthday" className={`block mb-2 px-2 text-base ${isDarkMode ? 'text-gray-300 bg-gray-900' : 'text-gray-600 bg-white'} text-right`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>تاريخ الميلاد</label>
                  <div className="relative w-full">
                    <img src={icon4} alt="تاريخ الميلاد" className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7" />
                    <input 
                      type="date" 
                      id="birthday" 
                      value={form.birthday}
                      onChange={(e) => handleFieldChange('birthday', e.target.value)}
                      className={`w-full p-4 pt-6 pr-4 pl-14 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-[#F9FAFB] text-gray-900 border-gray-400'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right`} 
                      style={{ 
                        fontFamily: 'Noor', 
                        fontWeight: 400,
                        direction: 'ltr',
                        textAlign: 'right'
                      }}
                      lang="ar"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="relative w-full">
                  <label htmlFor="phone" className={`block mb-2 px-2 text-base ${isDarkMode ? 'text-gray-300 bg-gray-900' : 'text-gray-600 bg-white'} text-right`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>رقم الموبايل الاساسي</label>
                  <div className="relative w-full">
                    <img src={icon5} alt="رقم الموبايل الاساسي" className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7" />
                    <input 
                      type="text" 
                      id="phone" 
                      value={form.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className={`w-full p-4 pt-6 pr-4 pl-14 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.phone ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                      style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                    />
                    {validationErrors.phone && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.phone}</span>}
                  </div>
                </div>
                <div className="relative w-full">
                  <label htmlFor="email" className={`block mb-2 px-2 text-base ${isDarkMode ? 'text-gray-300 bg-gray-900' : 'text-gray-600 bg-white'} text-right`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>البريد الالكتروني</label>
                  <div className="relative w-full">
                    <img src={icon6} alt="البريد الالكتروني" className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7" />
                    <input 
                      type="email" 
                      id="email" 
                      value={form.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className={`w-full p-4 pt-6 pr-4 pl-14 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-[#F9FAFB] text-gray-900'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right ${validationErrors.email ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                      style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                    />
                    {validationErrors.email && <span className="text-red-500 text-sm mt-1 block text-right">{validationErrors.email}</span>}
                  </div>
                </div>
                <div className="relative w-full">
                  <label htmlFor="city" className={`block mb-2 px-2 text-base ${isDarkMode ? 'text-gray-300 bg-gray-900' : 'text-gray-600 bg-white'} text-right`} style={{ fontFamily: 'Noor', fontWeight: 400 }}>المدينة</label>
                  <div className="relative w-full">
                    <img src={icon7} alt="المدينة" className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7" />
                    <input 
                      type="text" 
                      id="city" 
                      value={form.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      className={`w-full p-4 pt-6 pr-4 pl-14 rounded-2xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-[#F9FAFB] text-gray-900 border-gray-400'} text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 text-right`} 
                      style={{ fontFamily: 'Noor', fontWeight: 400 }} 
                    />
                  </div>
                </div>
              
              </div>
            </div>
            {/* Support & Logout */}
            <div className="flex flex-col gap-6 mt-12">
              <div 
                className={`flex items-center gap-3 text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} self-start cursor-pointer hover:opacity-80 transition-opacity`} 
                style={{ fontFamily: 'Cairo', fontWeight: 700 }}
                onClick={() => {
                  const phoneNumber = '+905379264680';
                  const message = 'مرحباً، أحتاج إلى دعم أو تواصل أو إعلان';
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <img src={isDarkMode ? TelephoneDarkmode : icon8} alt="دعم" className="w-8 h-8" />
                <span>للدعم و التواصل و الإعلان</span>
              </div>
              <div 
                className={`flex items-center gap-3 text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} cursor-pointer self-start hover:text-red-600 transition-colors`} 
                style={{ fontFamily: 'Noor', fontWeight: 400 }}
                onClick={handleLogout}
              >
                <img src={isDarkMode ? LogoutDarkmode : icon9} alt="تسجيل خروج" className="w-8 h-8" />
                <span style={{ fontFamily: 'Noor', fontWeight: 400 }}>تسجيل خروج</span>
              </div>
            </div>
            {/* Update Button */}
            <div className="flex justify-center mt-14 mb-4">
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full bg-black text-[#FFD700] py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ fontFamily: 'Cairo', fontWeight: 700 }}
              >
                {isUpdating ? 'جاري التحديث...' : 'تحديث المعلومات'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx global>{`
        /* تحسين عرض حقل التاريخ */
        input[type="date"] {
          direction: ltr !important;
          text-align: right !important;
          font-family: 'Noor', Arial, sans-serif !important;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${isDarkMode ? 'invert(1)' : 'none'};
        }
        
        input[type="date"]::-webkit-datetime-edit {
          direction: ltr !important;
          text-align: right !important;
        }
        
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          direction: ltr !important;
          text-align: right !important;
        }
        
        input[type="date"]::-webkit-datetime-edit-text {
          direction: ltr !important;
          text-align: right !important;
        }
        
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          direction: ltr !important;
          text-align: right !important;
        }
        
        /* تحسين عرض التاريخ على الموبايل */
        @media (max-width: 768px) {
          input[type="date"] {
            font-size: 16px !important; /* منع التكبير التلقائي على iOS */
            -webkit-appearance: none !important;
            appearance: none !important;
          }
        }
        
        /* إخفاء أيقونة التقويم الافتراضية وإضافة أيقونة مخصصة */
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        /* تحسين عرض النص داخل حقل التاريخ */
        input[type="date"]::-webkit-datetime-edit {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
    </Layout>
  );
};

export default MyAccount; 