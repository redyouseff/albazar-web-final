import { Link } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext';
import ContactHook from '../../Hook/contact/ContactHook';
import logo from "/images/Black-Yellow 3 (1).png";
import apple from "/images/App Store  White.png";
import google from "/images/Google Play.png";

const Footer = () => {
  const { isDarkMode } = useDarkMode();
  const { formData, loading, updateFormData, submitForm } = ContactHook();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
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
              <a 
                href="https://play.google.com/store/apps/details?id=com.mohassan.albazar_ap&pcampaignid=web_share" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img src={google} alt="Get it on Google Play" className="h-12" />
              </a>
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
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg text-right transition-all focus:outline-none focus:ring-2 font-noon ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                      : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <input
                  type="text"
                  placeholder="الاسم الأخير"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg text-right transition-all focus:outline-none focus:ring-2 font-noon ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                      : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg text-right transition-all focus:outline-none focus:ring-2 font-noon ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                    : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <textarea
                placeholder="اكتب رسالتك..."
                value={formData.message}
                onChange={(e) => updateFormData('message', e.target.value)}
                disabled={loading}
                rows="4"
                className={`w-full px-4 py-3 rounded-lg text-right transition-all resize-none focus:outline-none focus:ring-2 font-noon ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-yellow-400 border border-gray-600' 
                    : 'bg-white text-black placeholder-black focus:ring-yellow-400'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : isDarkMode 
                      ? 'text-gray-900 hover:bg-yellow-400' 
                      : 'bg-[#0e1414] text-yellow-400 hover:bg-gray-800'
                }`}
                style={{ 
                  fontFamily: 'Cairo',
                  backgroundColor: isDarkMode ? '#ffec00' : undefined
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال'
                )}
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

