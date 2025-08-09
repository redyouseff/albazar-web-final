import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Home, Car, Building, MapPin, Heart, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLoggedInUser } from '../../redux/Actions/AuthActions';
import { useDarkMode } from '../../context/DarkModeContext';
import logo from "/images/navbar/Black-Yellow 2.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIconsMenuOpen, setIsIconsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const response = useSelector((state) => state.auth.getLoggedInUser);
  const user = response?.data?.data;
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    dispatch(getLoggedInUser);
  }, [dispatch]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  // Update search query when URL changes
  useEffect(() => {
    const queryFromURL = searchParams.get('q') || '';
    setSearchQuery(queryFromURL);
    
    // Auto focus search input when on search page
    if (location.pathname === '/search' && queryFromURL) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          // Place cursor at the end of the text
          searchInputRef.current.setSelectionRange(searchInputRef.current.value.length, searchInputRef.current.value.length);
        }
      }, 100);
    }
  }, [searchParams, location.pathname]);

  // Additional focus effect when component mounts on search page
  useEffect(() => {
    if (location.pathname === '/search' && searchQuery) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.setSelectionRange(searchInputRef.current.value.length, searchInputRef.current.value.length);
        }
      }, 200);
    }
  }, [location.pathname, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Navigate to search page after a delay
    window.searchTimeout = setTimeout(() => {
      // Only navigate if we're not already on the search page with the same query
      const currentQuery = searchParams.get('q') || '';
      if (currentQuery !== query) {
        if (query.trim()) {
          navigate(`/search?q=${encodeURIComponent(query)}`);
        } else {
          // If search is empty, navigate to search page without query parameter
          navigate('/search');
        }
      }
    }, 500); // 500ms delay
  };

  // Handle search on Enter key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Clear timeout to prevent double navigation
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
      // Only navigate if we're not already on the search page with the same query  
      const currentQuery = searchParams.get('q') || '';
      if (searchQuery.trim()) {
        if (currentQuery !== searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
      } else {
        // If search is empty, navigate to search page without query parameter
        if (currentQuery !== '') {
          navigate('/search');
        }
      }
    }
  };

  const menuItems = [
    {
      title: 'الرئيسية',
      icon: <Home className="w-5 h-5" />,
      path: '/',
      description: 'العودة للصفحة الرئيسية'
    },
    {
      title: 'عقارات للبيع',
      icon: <Building className="w-5 h-5" />,
      path: '/propertiesForSale',
      description: 'تصفح العقارات المعروضة للبيع'
    },
    {
      title: 'عقارات للإيجار',
      icon: <Building className="w-5 h-5" />,
      path: '/propertiesForRent',
      description: 'تصفح العقارات المعروضة للإيجار'
    },
    {
      title: 'مباني وأراضي',
      icon: <Building className="w-5 h-5" />,
      path: '/buildingsAndLands',
      description: 'تصفح المباني والأراضي المعروضة'
    },
    {
      title: 'سيارات',
      icon: <Car className="w-5 h-5" />,
      path: '/cars',
      description: 'تصفح السيارات المعروضة'
    }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm sticky top-0 z-50`}>
      <div className="max-w-[1920px] mx-auto" dir="rtl">
        <div className="flex justify-between items-center h-[70px] sm:h-[90px] lg:h-[110px] px-4 sm:px-8 lg:px-16">
          {/* Right Section - Menu Icon and Logo */}
          <div className="flex items-center gap-1 relative">
            <button 
              className={`${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} p-2 sm:p-2.5 rounded-full transition-colors duration-200`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
            >
              <svg width="24" height="24" className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-72 sm:w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} py-2 z-50`}>
                <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                  <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>أقسام الموقع</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 font-noon`}>اختر القسم الذي تريد تصفحه</p>
                </div>
                
                <div className="py-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-yellow-50'} transition-colors duration-200 group`}
                    >
                      <div className={`p-1.5 sm:p-2 ${isDarkMode ? 'bg-yellow-600 group-hover:bg-yellow-500' : 'bg-yellow-100 group-hover:bg-yellow-200'} rounded-lg transition-colors duration-200`}>
                        <div className="text-black">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>{item.title}</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 font-noon`}>{item.description}</p>
                      </div>
                      <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                
                <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} px-4 py-3`}>
                  <Link
                    to="/categories-landing"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 hover:opacity-80 transition-opacity duration-200`}
                  >
                    <div className={`p-1.5 sm:p-2 ${isDarkMode ? 'bg-green-600' : 'bg-green-100'} rounded-lg`}>
                      <Plus className={`w-3 h-3 sm:w-4 sm:h-4 text-black`} />
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>إنشاء إعلان</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-noon`}>أضف إعلانك الجديد</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Logo */}
            <Link to="/" className="mr-1">
              <img src={logo} alt="البازار" className="h-8 w-auto sm:h-10 lg:h-12" />
            </Link>
          </div>

          {/* Center Section: Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-[600px] mx-6">
            <div className="relative w-full">
              <div className={`flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FB]'} rounded-full h-11 border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'} transition-colors duration-200`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="البحث عن عقار او سيارة ..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  className={`w-full px-12 h-full rounded-full bg-transparent focus:outline-none text-right font-noon text-[15px] ${isDarkMode ? 'placeholder-gray-400 text-gray-100' : 'placeholder-[#1E1E1E] placeholder-opacity-40 text-[#1E1E1E]'}`}
                  style={{ direction: 'rtl' }}
                />
                <button
                  onClick={() => {
                    if (window.searchTimeout) {
                      clearTimeout(window.searchTimeout);
                    }
                    // Only navigate if we're not already on the search page with the same query
                    const currentQuery = searchParams.get('q') || '';
                    if (searchQuery.trim()) {
                      if (currentQuery !== searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    } else {
                      // If search is empty, navigate to search page without query parameter
                      if (currentQuery !== '') {
                        navigate('/search');
                      }
                    }
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-[#1E1E1E] opacity-40'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Icons - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}  
              <div className="flex items-center">
                <button 
                  onClick={toggleDarkMode}
                  className={`p-2 sm:p-2.5 ${isDarkMode ? 'hover:bg-gray-700 bg-gray-700' : 'hover:bg-gray-100 bg-gray-50/50'} rounded-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-200`}
                  aria-label="تغيير المظهر"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {isDarkMode ? (
                      // Moon icon for dark mode
                      <svg width="20" height="20" className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      // Sun icon for light mode
                      <svg width="20" height="20" className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="4" stroke="#1E1E1E" strokeWidth="2"/>
                        <path d="M12 4V2" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 22V20" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20 12L22 12" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M2 12L4 12" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17.6569 6.34315L19.0711 4.92893" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4.92893 19.0711L6.34315 17.6569" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17.6569 17.6569L19.0711 19.0711" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4.92893 4.92893L6.34315 6.34315" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? 'bg-gray-400' : 'bg-yellow-400'} rounded-full shadow-sm`}></div>
                  </div>
                </button>
              </div>

              {/* Favorites Icon - Only show when user is logged in */}
              {user && (
                <Link 
                  to="/favorites"
                  className={`p-2 sm:p-2.5 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200`}
                  aria-label="المفضلة"
                >
                  <Heart 
                    className={`w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                  />
                </Link>
              )}

              {/* Chat Icon */}
              <Link 
                to="/chat"
                className={`p-2 sm:p-2.5 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200`}
                aria-label="الرسائل"
              >
                <svg width="20" height="20" className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C10.2289 21 8.57736 20.4884 7.18497 19.605L3 21L4.39499 16.815C3.51156 15.4226 3 13.7711 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Mobile Icons Menu */}
            <div className="md:hidden relative">
              <button 
                onClick={() => setIsIconsMenuOpen(!isIconsMenuOpen)}
                className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200`}
                aria-label="القائمة"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="1" fill={isDarkMode ? "#E5E7EB" : "#1E1E1E"}/>
                  <circle cx="19" cy="12" r="1" fill={isDarkMode ? "#E5E7EB" : "#1E1E1E"}/>
                  <circle cx="5" cy="12" r="1" fill={isDarkMode ? "#E5E7EB" : "#1E1E1E"}/>
                </svg>
              </button>
              
              {/* Mobile Icons Dropdown */}
              {isIconsMenuOpen && (
                <div className={`absolute top-full left-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} py-2 z-50`}>
                  {/* Theme Toggle */}
                  <button 
                    onClick={() => {
                      toggleDarkMode();
                      setIsIconsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}
                  >
                    <div className={`p-2 ${isDarkMode ? 'bg-yellow-600' : 'bg-yellow-100'} rounded-lg`}>
                      {isDarkMode ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="4" stroke="#1E1E1E" strokeWidth="2"/>
                          <path d="M12 4V2" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 22V20" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M20 12L22 12" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M2 12L4 12" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M17.6569 6.34315L19.0711 4.92893" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M4.92893 19.0711L6.34315 17.6569" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M17.6569 17.6569L19.0711 19.0711" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M4.92893 4.92893L6.34315 6.34315" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>
                      {isDarkMode ? 'الوضع العادي' : 'الوضع المظلم'}
                    </span>
                  </button>

                  {/* Favorites Icon - Only show when user is logged in */}
                  {user && (
                    <Link 
                      to="/favorites"
                      onClick={() => setIsIconsMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}
                    >
                      <div className={`p-2 ${isDarkMode ? 'bg-red-600' : 'bg-red-100'} rounded-lg`}>
                        <Heart className={`w-4 h-4 ${isDarkMode ? 'text-red-200' : 'text-red-600'}`} />
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>المفضلة</span>
                    </Link>
                  )}

                  {/* Chat Icon */}
                  <Link 
                    to="/chat"
                    onClick={() => setIsIconsMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}
                  >
                    <div className={`p-2 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} rounded-lg`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C10.2289 21 8.57736 20.4884 7.18497 19.605L3 21L4.39499 16.815C3.51156 15.4226 3 13.7711 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>الرسائل</span>
                  </Link>

                  {/* Search Icon */}
                  <Link 
                    to="/search"
                    onClick={() => setIsIconsMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}
                  >
                    <div className={`p-2 ${isDarkMode ? 'bg-green-600' : 'bg-green-100'} rounded-lg`}>
                      <Search className={`w-4 h-4 ${isDarkMode ? 'text-green-200' : 'text-green-600'}`} />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-cairo`}>البحث</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Dashboard Icon - Only show for admin users */}
            {user && user.role === 'admin' && (
              <Link 
                to="/admin"
                className={`p-2 sm:p-2.5 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200`}
                aria-label="لوحة التحكم"
              >
                <svg width="20" height="20" className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}

            {/* Profile Icon/Image - Always visible */}
            <Link 
              to="/my-account"
              className={`p-2 sm:p-2.5 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200 overflow-hidden`}
              aria-label="الملف الشخصي"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={`${user.firstname} ${user.lastname}`}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                />
              ) : (
                <svg width="20" height="20" className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2"/>
                  <circle cx="12" cy="8" r="4.5" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2"/>
                  <path d="M20 19C18.8792 16.1988 15.5436 14 12 14C8.45638 14 5.12076 16.1988 4 19" stroke={isDarkMode ? "#E5E7EB" : "#1E1E1E"} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </Link>
          </div>
        </div>

        {/* Click outside to close menus */}
        {(isMenuOpen || isIconsMenuOpen) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsMenuOpen(false);
              setIsIconsMenuOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar; 