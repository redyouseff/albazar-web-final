import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import NavbarForAdmin from '../components/navbarForAdmin';
import ShowListingForAdminHook from '../Hook/admin/ShowListingForAdminHook';
import { CATEGORY_CAR_ID, CATEGORY_LAND_ID, CATEGORY_RENT_ID, CATEGORY_SELL_ID } from '../redux/Type';

const AllListingForAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Use the hook
  const {
    listings,
    loading,
    error,
    activeCategory,
    handleCategoryClick,
    handleSearch
  } = ShowListingForAdminHook();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Map tab IDs to category IDs
    const categoryMap = {
      'سيارات':  CATEGORY_CAR_ID, // Replace with actual car category ID
      'أراضي و مباني':  CATEGORY_LAND_ID, // Replace with actual land category ID
      'عقارات للإيجار': CATEGORY_RENT_ID, // Replace with actual rent category ID
      'عقارات للبيع':  CATEGORY_SELL_ID // Replace with actual sell category ID
    };
    
    const categoryId = categoryMap[tabId] || '';
    handleCategoryClick(categoryId);
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleListingClick = (listingId) => {
    navigate(`/listing-details-admin/${listingId}`);
  };

  console.log(listings)

  return (
    <div className="min-h-screen bg-white !bg-white">
      <div className="mt-8">
        <NavbarForAdmin activeTab={activeTab} onTabClick={handleTabClick} />
      </div>

      {/* Search Field */}
      <div className="max-w-7xl mx-auto px-6 rounded-3xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الإعلانات المعلقة</h1>
        </div>
        
        <div className="relative max-w-md mx-auto ">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="ابحث في الإعلانات المعلقة..."
            className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-3xl bg-white text-right placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm text-gray-900"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            <p className="mt-2 text-gray-600">جاري التحميل...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">حدث خطأ: {error}</p>
          </div>
        )}

        {/* Grid of Listing Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.data && listings?.data?.length > 0 ? (
              listings?.data.map((listing) => (
                <div 
                  key={listing._id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => handleListingClick(listing._id)}
                >
                  {/* Images Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-4 grid-rows-2 gap-2">
                      {listing.images && listing.images.length > 0 ? (
                        listing.images.slice(0, 8).map((image, imageIndex) => (
                          <div key={imageIndex} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`صورة ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        // Placeholder images if no images
                        Array(8).fill(null).map((_, imageIndex) => (
                          <div key={imageIndex} className="aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">لا توجد صورة</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-right">
                      {listing['ad title'] || listing.adTitle || listing.title || 'عنوان المنشور'}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-right">
                      {listing.description || 'لا يوجد وصف متاح'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">لا توجد إعلانات معلقة متاحة</p>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToAdmin}
            className="bg-black text-yellow-400 px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium text-lg"
          >
            العودة للوحة الإدارة
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllListingForAdmin; 