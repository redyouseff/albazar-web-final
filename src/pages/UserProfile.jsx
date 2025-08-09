import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUserById } from '../redux/Actions/UserActions';
import Spinner from '../components/ui/spinner';
import { useGetData } from '../hooks/UseGetData';
import icon2 from "/images/user/Vector (1).png";
import icon3 from "/images/user/What's App Icon.svg"; 
import CategoriesBar from '../components/CategoriesBar';
import { useDarkMode } from '../context/DarkModeContext';

const PropertyCard = ({ listing }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <Link to={`/property/${listing._id}`} className="block">
      <div className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-purple-200' : 'bg-white'}`}>
        {/* Image Container */}
        <div className="relative">
          <img 
            src={listing.images?.[0] || `https://picsum.photos/seed/${listing._id}/800/600`} 
            alt={listing["ad title"] || 'عنوان المنشور'} 
            className="w-full h-48 object-cover" 
          />
        </div>
        {/* Content */}
        <div className="p-4">
          <div className={`text-xl font-bold mb-2 text-right ${isDarkMode ? 'text-purple-200' : ''}`}>
            {listing.price ? `${listing.price} ${listing.currency || 'ليرة'}` : 'السعر غير محدد'}
          </div>
          <h3 className={`font-bold text-lg mb-2 text-right ${isDarkMode ? 'text-purple-200' : ''}`}>
            {listing["ad title"] || 'عنوان المنشور'}
          </h3>
          <p className={`text-sm text-right leading-relaxed line-clamp-3 ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
            {listing.description || 'وصف العقار'}
          </p>
        </div>
      </div>
    </Link>
  );
};

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  
  // Get user data from Redux
  const userResponse = useSelector((state) => state.user.userById);
  
  // Local state
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [id, dispatch]);

  // Handle user data response
  useEffect(() => {
    if (userResponse) {
      setUserLoading(false);
      if (userResponse.status === 200 && userResponse.data?.data) {
        setUserData(userResponse.data.data);
      } else {
        console.error('Error fetching user:', userResponse);
      }
    }
  }, [userResponse]);

  // Fetch user listings using the correct API endpoint
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!id) return;
      
      try {
        setListingsLoading(true);
        setListingsError(null);
        
        const response = await useGetData(`/api/listing?user=${id}`);
        
        if (response?.status === 200 && response?.data?.data) {
          setUserListings(response.data.data);
        } else {
          setUserListings([]);
        }
      } catch (error) {
        console.error('❌ Error fetching user listings:', error);
        setListingsError('حدث خطأ في تحميل الإعلانات');
        setUserListings([]);
      } finally {
        setListingsLoading(false);
      }
    };

    fetchUserListings();
  }, [id]);

  // Show loading spinner while user data is loading
  if (userLoading) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner size="large" />
        </div>
      </Layout>
    );
  }

  // Show error if user not found
  if (!userData) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl font-medium mb-4">لم يتم العثور على المستخدم</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-black text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className={`${isDarkMode ? 'bg-gray-900 min-h-screen text-purple-200' : 'bg-gray-50 min-h-screen'}`}>

       <CategoriesBar></CategoriesBar>

        
      <div className="container mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className={`rounded-[30px] shadow-lg hover:shadow-xl transition-shadow px-8 py-14 mb-8 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            {/* Right Section: Image and Name */}
            <div className="flex items-center gap-4">
              <img
                src={userData.profileImage || "https://picsum.photos/seed/profile/200/200"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="text-right">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-purple-200' : ''}`}>
                  {`${userData.firstname || ''} ${userData.lastname || ''}`.trim() || 'اسم المستخدم'}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
                  عضو منذ {userData.createdAt ? new Date(userData.createdAt).getFullYear() : '20xx'}
                </p>
              </div>
            </div>
            {/* Center Section: Stats */}
            <div className="flex gap-6 flex-1 justify-center">
              <div className={`rounded-xl px-12 py-4 text-center shadow-md hover:shadow-lg transition-shadow flex-1 max-w-[200px] border-2 ${isDarkMode ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-100 border-yellow-200'}`}>
                <div className={`text-lg ${isDarkMode ? 'text-yellow-400' : ''}`}>عدد الإعلانات</div>
                <div className={`font-bold text-2xl ${isDarkMode ? 'text-yellow-400' : ''}`}>
                  {listingsLoading ? (
                    <div className="w-8 h-8 mx-auto">
                      <Spinner size="small" />
                    </div>
                  ) : (
                    userListings.length
                  )}
                </div>
              </div>
              <div className={`rounded-xl px-12 py-4 text-center shadow-md hover:shadow-lg transition-shadow flex-1 max-w-[200px] border-2 ${isDarkMode ? 'bg-gray-900 border-yellow-400' : 'bg-yellow-100 border-yellow-200'}`}>
                <div className={`text-lg ${isDarkMode ? 'text-yellow-400' : ''}`}>متابعين</div>
                <div className={`font-bold text-2xl ${isDarkMode ? 'text-yellow-400' : ''}`}>{userData.followers?.length || 0}</div>
              </div>
            </div>
            {/* Left Section: Menu */}
            <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`}>
              <BsThreeDotsVertical size={28} />
            </button>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-6 mt-24 justify-center">
            <Link 
              to={`/chat?userId=${userData._id}&userName=${encodeURIComponent(`${userData.firstname || ''} ${userData.lastname || ''}`.trim() || 'مستخدم')}&userImage=${encodeURIComponent(userData.profileImage || '')}`}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full w-[280px] shadow-lg hover:shadow-xl transition-all font-bold text-lg ${isDarkMode ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
            >
              <img src={icon2} alt="دردشة" className="w-6 h-6" />
              <span>دردشة</span>
            </Link>
            <a 
              href={`https://wa.me/${userData.phone?.replace(/^\+/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full w-[280px] shadow-lg hover:shadow-xl transition-all font-bold text-lg ${isDarkMode ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
            >
              <img src={icon3} alt="واتساب" className="w-6 h-6" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
        {/* Property Grid Section */}
        <div className={`rounded-[30px] shadow-lg px-8 py-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-2xl font-bold mb-6 text-right ${isDarkMode ? 'text-purple-200' : ''}`}>إعلانات المستخدم</h3>
          {/* Loading State for Listings */}
          {listingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Spinner size="large" />
                <p className={`mt-4 ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>جاري تحميل الإعلانات...</p>
              </div>
            </div>
          ) : listingsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">{listingsError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.length > 0 ? (
                userListings.map((listing) => (
                  <PropertyCard 
                    key={listing._id} 
                    listing={listing}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className={`text-lg ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>لا توجد إعلانات لهذا المستخدم</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default UserProfile; 