import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDarkMode } from '../../context/DarkModeContext';
import logo from "/images/Black-Yellow 3 (1).png";
import apple from "/images/App Store  White.png";
import google from "/images/Google Play.png";

const Footer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const { isDarkMode } = useDarkMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <footer 
      className={`${isDarkMode ? 'text-gray-100 bg-gray-900' : 'text-gray-900'}`} 
      style={{ background: isDarkMode ? undefined : '#FFED00' }} 
      dir="rtl"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* App Info - Right Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Albazar Logo" className="w-12 h-12" />
              <h2 className="text-2xl font-bold font-cairo">Albazar</h2>
            </div>
            <p className="text-lg leading-relaxed font-noon">
              منصة عقارية شاملة تمكنك من البحث عن العقارات المناسبة لك وبيع أو إيجار عقاراتك بسهولة وأمان
            </p>
            <div className="flex flex-row gap-4">
              <Link to="#" className="transition-transform hover:scale-105">
                <img src={google} alt="Get it on Google Play" className="h-12" />
              </Link>
              <Link to="#" className="transition-transform hover:scale-105">
                <img src={apple} alt="Download on App Store" className="h-12" />
              </Link>
            </div>
          </div>

          {/* Contact Form - Left Side */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 font-cairo">تواصل معنا الآن!</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="الاسم الأول"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg text-right transition-all focus:outline-none focus:ring-2 font-noon ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                      : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="الاسم الأخير"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg text-right transition-all focus:outline-none focus:ring-2 font-noon ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                      : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                  }`}
                />
              </div>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg text-right transition-all focus:outline-none focus:ring-2 font-noon ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                    : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                }`}
              />
              <textarea
                placeholder="اكتب رسالتك..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                className={`w-full px-4 py-3 rounded-lg text-right transition-all resize-none focus:outline-none focus:ring-2 font-noon ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                    : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                }`}
              />
              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-900 hover:bg-yellow-400' 
                    : 'bg-[#0e1414] text-yellow-400 hover:bg-gray-800'
                }`}
                style={{ 
                  fontFamily: 'Cairo',
                  backgroundColor: isDarkMode ? '#ffec00' : undefined
                }}
              >
                إرسال
              </button>
            </form>
          </div>
        </div>
        
        <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-600'} mt-8 pt-4 text-center text-sm`}>
          <p>Albazar©2024</p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
      `}</style>
    </footer>
  );
};

export default Footer; 

