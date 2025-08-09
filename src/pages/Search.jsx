
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { useDarkMode } from '../context/DarkModeContext';
import SearchHook from '../Hook/search/SearchHook';
import { Car, Building, Home, Store, MapPin, Bed, Bath, Maximize, DollarSign, Calendar } from 'lucide-react';

const Search = () => {
  const [filters, setFilters] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const searchQuery = searchParams.get('q') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);   

  const { loading, error, listings, page, limit, totalPages, handlePageChange, handleLimitChange } = SearchHook(searchQuery);

  // Update local search query when URL changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, []);

  // Function to handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    
    // Clear existing timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set new timeout for search
    window.searchTimeout = setTimeout(() => {
      if (value.trim()) {
        navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      } else {
        navigate('/search');
      }
    }, 500); // 500ms delay
  };



  // Function to get appropriate icon based on category and property type
  const getPropertyIcon = (category, propertyType) => {
    if (category === '67f02b93a52c9287a418ede6') return <Car className="w-5 h-5" />; // Cars
    if (propertyType === 'شقة') return <Home className="w-5 h-5" />; // Apartment
    if (propertyType === 'تجارية') return <Store className="w-5 h-5" />; // Commercial
    return <Building className="w-5 h-5" />; // Default building
  };

  // Function to format price with currency
  const formatPrice = (price, currency) => {
    if (!price) return 'غير محدد';
    return `${price} ${currency || ''}`;
  };

  // Function to get property type in Arabic
  const getPropertyTypeText = (category, propertyType, saleOrRent) => {
    if (category === '67f02b93a52c9287a418ede6') return 'سيارة';
    if (saleOrRent === 'sale' || saleOrRent === 'بيع') return 'عقار للبيع';
    if (saleOrRent === 'rent') return 'عقار للإيجار';
    return 'عقار';
  };

  // Transform API data to PropertyCard format
  const properties = listings?.data?.map((item) => ({
    id: item._id,
    title: item['ad title'] || 'عنوان الإعلان',
    description: item.description || 'لا يوجد وصف',
    price: formatPrice(item.price || item['rental fees'], item.currency),
    location: item['property location'] || item.city || 'غير محدد',
    rooms: item['number of rooms'] || item['number of sets'] || 'غير محدد',
    year: item['Manufacturing Year'] || item['building age'] || 'غير محدد',
    type: getPropertyTypeText(item.category, item['property type'], item['sale or rent']),
    image: item.images?.[0] || '/api/placeholder/300/200',
    icon: getPropertyIcon(item.category, item['property type']),
    area: item.area || item['Engine Capacity'] || 'غير محدد',
    bathrooms: item['number of bathrooms'] || 'غير محدد',
    negotiable: item.negotiable,
    contactMethod: item['contact method'] || [],
    amenities: item.amenities || [],
    propertyCondition: item['property condition'] || 'غير محدد',
    paymentMethod: item['payment method'] || 'غير محدد',
    originalData: item // Keep original data for additional details
  })) || [];
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search Bar */}
        <div className="sm:hidden mb-6">
          <input
            type="text"
            value={localSearchQuery}
            onChange={handleSearchChange}
            placeholder="ابحث عن عقارات، سيارات، أراضي..."
            className={`w-full px-4 py-3 rounded-full border-2 transition-all focus:outline-none focus:border-yellow-400 font-noon ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400' 
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 font-cairo`}>
            نتائج البحث عن "{searchQuery}"
          </h1>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              جاري تحميل النتائج...
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              حدث خطأ في تحميل النتائج
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              لا توجد نتائج للبحث
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {listings?.paginate && listings.paginate.numbeOfPage > 1 && (
          <div className="flex justify-center items-center space-x-reverse space-x-2 mt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className={`px-3 py-1 rounded ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-yellow-500'}`}
            >
              السابق
            </button>
            
            {/* Show limited page numbers for better UX */}
            {(() => {
              const totalPages = listings.paginate.numbeOfPage;
              const currentPage = page;
              const pagesToShow = [];
              
              // Always show first page
              pagesToShow.push(1);
              
              // Show pages around current page
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              
              if (start > 2) {
                pagesToShow.push('...');
              }
              
              for (let i = start; i <= end; i++) {
                if (i > 1 && i < totalPages) {
                  pagesToShow.push(i);
                }
              }
              
              if (end < totalPages - 1) {
                pagesToShow.push('...');
              }
              
              // Always show last page if more than 1 page
              if (totalPages > 1) {
                pagesToShow.push(totalPages);
              }
              
              return pagesToShow.map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                  disabled={pageNum === '...'}
                  className={`w-8 h-8 rounded ${
                    pageNum === '...' 
                      ? `${isDarkMode ? 'text-gray-500' : 'text-gray-400'} cursor-default`
                      : pageNum === currentPage 
                        ? 'bg-yellow-400 text-gray-900' 
                        : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`
                  } border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  {pageNum}
                </button>
              ));
            })()}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= listings.paginate.numbeOfPage}
              className={`px-3 py-1 rounded ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${page >= listings.paginate.numbeOfPage ? 'opacity-50 cursor-not-allowed' : 'hover:text-yellow-500'}`}
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
