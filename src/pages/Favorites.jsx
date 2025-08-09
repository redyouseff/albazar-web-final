import { useEffect } from 'react';
import Layout from '../components/Layout';
import { Heart, MapPin, Bath, Maximize } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserFavourite, deleteFavourite } from '../redux/Actions/FavouriteActions';
import blackHeart from "/images/Favorites/Vector.png";
import redHeart from "/images/Favorites/Vector (1).png";

const Favorites = () => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const { data: favorites, loading } = useSelector((state) => state.favourite.getLoggedUserFavourite || {});

  useEffect(() => {
    dispatch(getLoggedUserFavourite);
  }, [dispatch]);

  const handleRemoveFromFavorites = async (id) => {
    try {
      await dispatch(deleteFavourite(id));
      await dispatch(getLoggedUserFavourite);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} dir="rtl">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
          <div className="max-w-[1440px] mx-auto px-8 py-6">
            <div className="flex items-center justify-center gap-3">
              <Heart className={`w-8 h-8 ${isDarkMode ? 'text-purple-300' : 'text-gray-800'}`} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>المفضلة</h1>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          {loading ? (
            <div className={`text-center ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>جاري التحميل...</div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((item) => (
                <div 
                  key={item._id} 
                  className={`${
                    isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-gray-200'
                  } rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]`}
                >
                  <div className="relative">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/400'} 
                      alt={item['ad title']} 
                      className="w-full h-64 object-cover"
                    />
                    <button 
                      onClick={() => handleRemoveFromFavorites(item._id)}
                      className="absolute top-4 left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200"
                    >
                      <Heart className="w-6 h-6 text-white fill-current" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>
                        {item['ad title']}
                      </h3>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>
                        السعر: {item['rental fees'] || item.price} {item.currency}
                      </span>
                    </div>
                    <p className={`text-sm mb-5 line-clamp-2 ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                    <div className={`flex flex-wrap items-center gap-4 ${isDarkMode ? 'text-purple-300' : 'text-gray-700'}`}>
                      {item['property location'] && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          <span className="text-sm">{item['property location']}</span>
                        </div>
                      )}
                      {item['number of rooms'] && (
                        <div className="flex items-center gap-2">
                          <Bath className="w-5 h-5" />
                          <span className="text-sm">{item['number of rooms']} غرف</span>
                        </div>
                      )}
                      {item['number of bathrooms'] && (
                        <div className="flex items-center gap-2">
                          <Bath className="w-5 h-5" />
                          <span className="text-sm">{item['number of bathrooms']} حمام</span>
                        </div>
                      )}
                      {item.area && (
                        <div className="flex items-center gap-2">
                          <Maximize className="w-5 h-5" />
                          <span className="text-sm">{item.area} متر مربع</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>
              لا توجد عقارات في المفضلة
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
