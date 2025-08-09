import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const CategoriesBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  return (
    <section className={`hidden md:block w-full py-4 sm:py-8 mb-6 shadow-md border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-yellow-100'}`}>
      <div className="max-w-[1312px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <nav className={`flex gap-4 lg:gap-8 text-lg lg:text-xl font-medium font-[Noor] ${isDarkMode ? 'text-purple-200' : 'text-gray-800'}`}>
            <a 
              href="/cars" 
              className={`transition ${location.pathname === '/cars' ? 'text-yellow-500' : isDarkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}`}
            >
              سيارات
            </a>
            <a 
              href="/buildingsAndLands" 
              className={`transition ${location.pathname === '/buildingsAndLands' ? 'text-yellow-500' : isDarkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}`}
            >
              أراضي و مباني
            </a>
            <a 
              href="/propertiesForRent" 
              className={`transition ${location.pathname === '/propertiesForRent' ? 'text-yellow-500' : isDarkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}`}
            >
              عقارات للإيجار
            </a>
            <a 
              href="/propertiesForSale" 
              className={`transition ${location.pathname === '/propertiesForSale' ? 'text-yellow-500' : isDarkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}`}
            >
              عقارات للبيع
            </a>
          </nav>
          <button 
            onClick={() => navigate('/categories-landing')}
            className={`rounded-full px-6 lg:px-10 py-2.5 lg:py-3.5 text-base lg:text-xl font-bold flex items-center gap-2 lg:gap-3 transition font-[Noor] ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-black text-yellow-400 hover:bg-gray-900'}`}
          >
            إنشاء إعلان <span className="text-yellow-400 text-xl lg:text-2xl">+</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesBar; 