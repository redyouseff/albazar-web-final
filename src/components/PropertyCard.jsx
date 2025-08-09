import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Car, Home, Route, MapPin, Building, Store, Bed, Bath, Maximize, DollarSign } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserFavourite, addToFavourite, deleteFavourite } from '../redux/Actions/FavouriteActions';

const PropertyCard = ({ 
  property, 
  layout = 'vertical',
  isFavorite = false,
  isLoading = false,
  onFavoriteClick
}) => {
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFavoriteState, setIsFavorite] = useState(false);
  const favouriteList = useSelector((state) => state.favourite.getLoggedUserFavourite?.data || []);
  const deleteResponse = useSelector((state) => state.favourite.deleteFavourite);
  const addResponse = useSelector((state) => state.favourite.addToFavourite);

  // جلب قائمة المفضلة عند تحميل الكومبوننت
  useEffect(() => {
    const getFavorites = async () => {
      if (!loading) {
        setLoading(true);
        await dispatch(getLoggedUserFavourite);
        setLoading(false);
      }
    };
    getFavorites();
  }, [dispatch]);

  // تحديث حالة القلب عند تغير قائمة المفضلة
  useEffect(() => {
    if (favouriteList && Array.isArray(favouriteList)) {
      const isInFavorites = favouriteList.some(fav => fav._id === property.id);
      setIsFavorite(isInFavorites);
    }
  }, [favouriteList, property.id]);

  // مراقبة استجابة الحذف والإضافة
  useEffect(() => {
    if (deleteResponse?.status === 200 || addResponse?.status === 200) {
      dispatch(getLoggedUserFavourite);
    }
  }, [deleteResponse, addResponse, dispatch]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      // تحديث الحالة فوراً للتجربة المستخدم السريعة
      setIsFavorite(!isFavoriteState);
      
      if (!isFavoriteState) {
        await dispatch(addToFavourite(property.id));
      } else {
        await dispatch(deleteFavourite(property.id));
      }
    } catch (error) {
      // في حالة الخطأ، نعيد الحالة لما كانت عليه
      setIsFavorite(isFavoriteState);
      console.error('Error handling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (e) => {
    navigate(`/property/${property.id}`);
  };

  if (layout === 'horizontal') {
    return (
      <div 
        onClick={handleCardClick}
        className={`block w-full rounded-none md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border cursor-pointer transform hover:scale-[1.01] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex flex-col sm:flex-row sm:min-h-[300px]">
          {/* Image Section */}
          <div className="relative w-full sm:w-1/2 h-[200px] sm:h-auto sm:flex-1">
            <img
              src={property.image || "/api/placeholder/300/200"}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300"
            />
            <button
              onClick={handleFavoriteClick}
              disabled={loading}
              className={`absolute top-3 left-3 p-2 rounded-full z-20 shadow-md transition-all duration-200 ${
                isFavoriteState 
                  ? 'bg-black text-white scale-110' 
                  : isDarkMode ? 'bg-gray-900/80 text-gray-300 hover:bg-gray-900' : 'bg-white/90 text-gray-600 hover:bg-white'
              } hover:scale-110 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart 
                className="h-5 w-5" 
                fill={isFavoriteState ? 'currentColor' : 'none'} 
              />
            </button>
          </div>
          {/* Content Section */}
          <div className={`w-full sm:w-1/2 p-5 sm:p-6 md:p-7 flex flex-col justify-between text-right sm:flex-1 ${isDarkMode ? 'text-gray-200' : ''}`}>
            <div className="flex-1">
              {/* السعر */}
              <div className="text-right mb-3">
                <span className={`text-2xl sm:text-2xl md:text-3xl font-bold font-[Cairo] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  السعر: {property.price}
                </span>
              </div>
              {/* عنوان المنشور */}
              <h3 className={`font-bold text-xl sm:text-xl md:text-2xl font-[Cairo] hover:text-yellow-500 transition-colors leading-tight mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {property.title}
              </h3>
              {/* الوصف */}
              <p className={`text-sm sm:text-base md:text-base font-[Cairo] leading-relaxed mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {property.description}
              </p>
              {/* رقم الإعلان */}
              <div className={`text-sm sm:text-base font-[Cairo] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>رقم الإعلان: {String(property.id).padStart(5, '0')}</span>
              </div>
              {/* تاريخ الإعلان */}
              <div className={`text-sm sm:text-base font-[Cairo] mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>تاريخ الإعلان: {property.createdAt}</span>
              </div>
              {/* الموقع الجغرافي */}
              {property.locationName && (
                <div className={`flex items-center text-sm sm:text-base font-[Cairo] mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>{property.locationName}</span>
                </div>
              )}
            </div>
            {/* الأيقونات والمعلومات */}
            <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className={`flex items-center justify-between text-sm sm:text-base font-[Cairo] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {property.type === 'سيارة' ? (
                  <>
                    <div className="flex items-center">
                      <Car className={`h-5 w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>{property.originalData?.brand || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className={`h-5 w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>سنة {property.year}</span>
                    </div>
                    {property.originalData?.kilometers && (
                      <div className="flex items-center">
                        <Route className={`h-5 w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span>{property.originalData.kilometers} كم</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      {property.icon || <Home className={`h-5 w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                      <span>{property.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize className={`h-5 w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>{property.area}</span>
                    </div>
                    {property.rooms && property.rooms !== 'غير محدد' && (
                      <div className="flex items-center">
                        <Bed className={`h-5 w-5 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span>{property.rooms} غرف</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (default) - موحد للصفحة الرئيسية
  return (
    <div 
      onClick={handleCardClick}
      className={`block w-full md:w-auto rounded-none md:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border cursor-pointer transform hover:scale-[1.02] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
    >
      <div className="relative">
        <img
          src={property.image || "/api/placeholder/300/200"}
          alt={property.title}
          className="w-full h-[200px] sm:h-[240px] object-cover transition-transform duration-300"
        />
        <button
          onClick={handleFavoriteClick}
          disabled={loading}
          className={`absolute top-3 left-3 p-2 rounded-full z-20 shadow-md transition-all duration-200 ${
            isFavoriteState 
              ? 'bg-black text-white scale-110' 
              : isDarkMode ? 'bg-gray-900/80 text-gray-300 hover:bg-gray-900' : 'bg-white/90 text-gray-600 hover:bg-white'
          } hover:scale-110 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart 
            className="h-5 w-5" 
            fill={isFavoriteState ? 'currentColor' : 'none'} 
          />
        </button>
      </div>
      <div className={`p-4 sm:p-5 text-right ${isDarkMode ? 'text-gray-200' : ''}`}>
        {/* السعر */}
        <div className="text-right mb-2">
          <span className={`text-base sm:text-lg font-bold font-[Cairo] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            السعر: {property.price}
          </span>
        </div>
        {/* عنوان المنشور */}
        <h3 className={`font-bold text-base sm:text-lg font-[Cairo] hover:text-yellow-500 transition-colors leading-tight mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {property.title}
        </h3>
        {/* الوصف */}
        <p className={`text-sm font-[Cairo] leading-relaxed mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {property.description}
        </p>
        {/* رقم الإعلان */}
        <div className={`text-xs sm:text-sm font-[Cairo] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>رقم الإعلان: {String(property.id).padStart(5, '0')}</span>
        </div>
        {/* تاريخ الإعلان */}
        <div className={`text-xs sm:text-sm font-[Cairo] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>تاريخ الإعلان: {property.createdAt}</span>
        </div>
        {/* الموقع الجغرافي */}
        {property.locationName && (
          <div className={`flex items-center text-xs sm:text-sm font-[Cairo] mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <MapPin className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>{property.locationName}</span>
          </div>
        )}
        {/* الأيقونات في صف واحد */}
        <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className={`flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-[Cairo] flex-wrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {property.type === 'سيارة' ? (
              <>
                <div className="flex items-center">
                  <Car className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>{property.originalData?.brand || 'غير محدد'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>سنة {property.year}</span>
                </div>
                {property.originalData?.kilometers && (
                  <div className="flex items-center">
                    <Route className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span>{property.originalData.kilometers} كم</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center">
                  {property.icon || <Home className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                  <span>{property.type}</span>
                </div>
                <div className="flex items-center">
                  <Maximize className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>{property.area}</span>
                </div>
                {property.rooms && property.rooms !== 'غير محدد' && (
                  <div className="flex items-center">
                    <Bed className={`h-4 w-4 ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span>{property.rooms} غرف</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
