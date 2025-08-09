import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarForAdmin from '../components/navbarForAdmin';
import ListingByIdHook from '../Hook/listing/listingByIdHook';
import AccepteListingHook from '../Hook/admin/AccepteListingHook';
import RejectListingHook from '../Hook/admin/rejectListingHook';
import { CATEGORY_RENT_ID } from '../redux/Type';
import notify from '../Hook/useNotifaction';

const ListingDetailsRentForAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the hook to get listing data
  const { loading, error, listing, isSuccess } = ListingByIdHook(id);

  // Use the AccepteListingHook
  const { 
    loading: acceptLoading, 
    error: acceptError, 
    success: acceptSuccess, 
    acceptListingHandler, 
    isSuccess: isAcceptSuccess, 
    hasError: hasAcceptError 
  } = AccepteListingHook(id);

  // Use the RejectListingHook
  const { 
    loading: rejectLoading, 
    error: rejectError, 
    success: rejectSuccess, 
    rejectListingHandler, 
    isSuccess: isRejectSuccess, 
    hasError: hasRejectError 
  } = RejectListingHook(id);

  // مراقبة حالة النجاح من الهوك
  useEffect(() => {
    if (acceptSuccess && isAcceptSuccess) {
      notify('تم قبول الإعلان بنجاح', 'success');
      setTimeout(() => {
        navigate('/admin/listings');
      }, 2000);
    } else if (hasAcceptError && acceptError) {
      notify(acceptError, 'error');
    }
  }, [acceptSuccess, isAcceptSuccess, hasAcceptError, acceptError, navigate]);

  // مراقبة حالة النجاح من رفض الإعلان
  useEffect(() => {
    if (rejectSuccess && isRejectSuccess) {
      notify('تم رفض الإعلان بنجاح', 'success');
      setTimeout(() => {
        navigate('/admin/listings');
      }, 2000);
    } else if (hasRejectError && rejectError) {
      notify(rejectError, 'error');
    }
  }, [rejectSuccess, isRejectSuccess, hasRejectError, rejectError, navigate]);

  // إعادة تعيين حالة النجاح عند تغيير الـ ID
  useEffect(() => {
    // إعادة تعيين حالة المعالجة عند تغيير الإعلان
    setIsProcessing(false);
  }, [id]);

  // Get the actual listing data from the response
  const listingData = listing?.data || listing;

  // Debug: Log the raw listing data to understand the structure
  useEffect(() => {
    if (listingData) {
      console.log('Raw Listing Data:', listingData);
      console.log('Rental Rate Data:', {
        rentalRate: listingData.rentalRate,
        arabicRentalRate: listingData["معدل الإيجار"],
        rentalRateField: listingData["rental rate"]
      });
      console.log('Published By Data:', {
        publishedBy: listingData.publishedBy,
        publishedVia: listingData.publishedVia,
        arabicPublishedBy: listingData["تم النشر من قبل"],
        publishedByField: listingData["published by"],
        publisher: listingData.publisher,
        arabicPublisher: listingData["ناشر"]
      });
    }
  }, [listingData]);

  // Check if this is a rental property listing
  const isRentalListing = (data) => {
    if (!data) return false;
    
    // Check for rental-specific fields
    const hasRentalFees = data["rental fees"] || data.rentalFees;
    const isRentType = data["sale or rent"] === "rent" || data["sale or rent"] === "إيجار";
    const hasRentalRate = data.rentalRate || data["rental rate"];
    
    return hasRentalFees || isRentType || hasRentalRate;
  };

  // Redirect if not a rental listing
  useEffect(() => {
    if (listingData && !isRentalListing(listingData)) {
      navigate('/listing-details-admin/' + id);
    }
  }, [listingData, id, navigate]);

  // Map API data to form data structure for rental properties
  const mapApiDataToFormData = (data) => {
    if (!data) return {};
    
    // Handle area field more robustly
    const areaValue = data.area || data["property area"] || data["مساحة"] || '';
    
    // Handle publishedBy field more robustly with better mapping
    const publishedByValue = data.publishedVia || 
                            data["published by"] || 
                            data["تم النشر من قبل"] || 
                            data.publishedBy || 
                            data.publisher ||
                            data["ناشر"] || '';
    
    // Map publishedBy values to match our options
    let mappedPublishedBy = '';
    if (publishedByValue) {
      if (publishedByValue.includes('مالك') || publishedByValue.includes('owner')) {
        mappedPublishedBy = 'مالك';
      } else if (publishedByValue.includes('وكيل') || publishedByValue.includes('agent')) {
        mappedPublishedBy = 'وكيل';
      } else {
        mappedPublishedBy = publishedByValue; // Keep original if no match
      }
    }
    
    // Debug: Log the publishedBy mapping
    console.log('PublishedBy Mapping:', {
      originalData: data,
      publishedVia: data.publishedVia,
      publishedBy: data["published by"],
      arabic: data["تم النشر من قبل"],
      publishedByField: data.publishedBy,
      publisher: data.publisher,
      arabicPublisher: data["ناشر"],
      originalValue: publishedByValue,
      mappedValue: mappedPublishedBy
    });
    
    // Handle numberOfRooms field more robustly
    const numberOfRoomsValue = data["number of rooms"] || data["numberOfRooms"] || data["غرف"] || '';
    
    // Handle regulationStatus field more robustly
    const regulationStatusValue = data.regulationStatus || data["regulation status"] || data["داخل/خارج التنظيم"] || '';
    
    // Smart mapping for regulation status
    let mappedRegulationStatus = '';
    if (regulationStatusValue) {
      if (regulationStatusValue.includes('داخل') || regulationStatusValue.includes('inside')) {
        mappedRegulationStatus = 'داخل التنظيم';
      } else if (regulationStatusValue.includes('خارج') || regulationStatusValue.includes('outside')) {
        mappedRegulationStatus = 'خارج التنظيم';
      }
    }
    
    // Handle rental rate more robustly - handle both string and array
    const rentalRateValue = data.rentalRate || data["rental rate"] || data["معدل الإيجار"] || '';
    let rentalRateArray = [];
    
    if (rentalRateValue) {
      if (Array.isArray(rentalRateValue)) {
        rentalRateArray = rentalRateValue;
      } else if (typeof rentalRateValue === 'string') {
        // Split by common separators and clean up
        rentalRateArray = rentalRateValue.split(/[,،\s]+/).filter(item => item.trim());
      } else {
        rentalRateArray = [String(rentalRateValue)];
      }
    }
    
    // Debug: Log the rental rate mapping
    console.log('Rental Rate Mapping:', {
      originalData: data,
      rentalRate: data.rentalRate,
      arabic: data["معدل الإيجار"],
      originalValue: rentalRateValue,
      finalArray: rentalRateArray
    });
    
    // Handle isNegotiable more robustly
    const isNegotiableValue = data.negotiable !== undefined ? data.negotiable : 
                             data.isNegotiable !== undefined ? data.isNegotiable : 
                             data["قابل للتفاوض"] !== undefined ? data["قابل للتفاوض"] : 
                             data["negotiable"] !== undefined ? data["negotiable"] : false;
    
    // Debug: Log the isNegotiable mapping
    console.log('IsNegotiable Mapping:', {
      originalData: data,
      negotiable: data.negotiable,
      isNegotiable: data.isNegotiable,
      arabic: data["قابل للتفاوض"],
      negotiableField: data["negotiable"],
      finalValue: isNegotiableValue
    });
    
    return {
      propertyType: data["property type"] || '',
      regulationStatus: mappedRegulationStatus,
      area: areaValue,
      floor: data.floor || '',
      numberOfBuildingFloors: data["number of building floors"] || '',
      numberOfRooms: numberOfRoomsValue,
      numberOfLivingRooms: data["number of livingRooms"] || '',
      numberOfBathrooms: data["number of bathrooms"] || '',
      buildingAge: data.year || data["building age"] || '',
      amenities: data.amenities || [],
      isFurnished: data.furnishing !== undefined ? data.furnishing : null,
      rentalFees: data["rental fees"] || data.rentalFees || '',
      rentalRate: rentalRateArray,
      currency: data.currency || '',
      securityDeposit: data["security deposit"] || data.securityDeposit || '',
      location: {
        address: data["property location"] || data.city || '',
        lat: data.lat || 0,
        lng: data.long || 0
      },
      governorate: data.city || '',
      'ad title': data["ad title"] || data.title || data.name || '',
      description: data.description || '',
      publishedBy: mappedPublishedBy,
      isNegotiable: isNegotiableValue,
      name: data.name || data["contact name"] || '',
      phone: data["phone number"] || data.phone || '',
      contactMethod: data["contact method"] || []
    };
  };

  const formData = mapApiDataToFormData(listingData);

  // Helper function to check if a value matches any option (case-insensitive and flexible)
  const matchesOption = (value, options) => {
    if (!value || !options) return false;
    const normalizedValue = String(value).trim().toLowerCase();
    
    return options.some(option => {
      const normalizedOption = String(option).toLowerCase();
      
      // Exact match
      if (normalizedValue === normalizedOption) return true;
      
      // Contains match
      if (normalizedValue.includes(normalizedOption) || normalizedOption.includes(normalizedValue)) return true;
      
      // Handle Arabic text variations
      const arabicVariations = {
        'مالك': ['مالك', 'المالك', 'owner'],
        'وكيل': ['وكيل', 'الوكيل', 'agent'],
        'يومي': ['يومي', 'يومية', 'daily'],
        'أسبوعي': ['أسبوعي', 'أسبوعية', 'weekly'],
        'شهري': ['شهري', 'شهرية', 'monthly'],
        'سنوي': ['سنوي', 'سنوية', 'yearly']
      };
      
      // Check for Arabic variations
      for (const [key, variations] of Object.entries(arabicVariations)) {
        if (variations.includes(normalizedOption)) {
          if (variations.some(variation => normalizedValue.includes(variation))) {
            return true;
          }
        }
      }
      
      return false;
    });
  };

  // Function to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    if (!lat || !lng) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setResolvedAddress(data.display_name);
        return data.display_name;
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
    }
  };

  // Get address from coordinates when component loads
  useEffect(() => {
    if (listingData?.lat && listingData?.long) {
      getAddressFromCoordinates(listingData.lat, listingData.long);
    }
  }, [listingData]);

  // Options arrays for rental properties
  const propertyTypes = [
    'شقة', 'فيلا', 'بناء', 'بيت عربي',  'محل', 'مستودع', 'مكتب', 'مصنع', 'مقهى'
  ];
  const regulationOptions = ['داخل التنظيم', 'خارج التنظيم'];
  const floorOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  const roomOptions = ['1', '2', '3', '4', '5', '6', '7'];
  const livingRoomOptions = ['1', '2', '3', '4'];
  const bathroomOptions = ['1', '2', '3', '4', '5', '6', '7'];
  const buildingAgeOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const amenities = [
    'بلكونة', 'حديقة خاصة', 'أجهزة المطبخ', 'موقف خاص', 'غرفة خادمة', 'غاز مركزي', 'حمام سباحة', 'مصعد', 'تدفئة مركزية', 'تكييف مركزي'
  ];
  const currencyOptions = [
    { value: 'ليرة', label: 'ليرة سورية', flag: '🇸🇾' },
    { value: 'دولار', label: 'دولار أمريكي', flag: '🇺🇸' }
  ];
  const rentPeriods = ['يومي', 'أسبوعي', 'شهري', 'سنوي'];
  const governorateOptions = [
    'دمشق',
    'ريف دمشق',
    'القنيطرة',
    'درعا',
    'السويداء',
    'حمص',
    'طرطوس',
    'اللاذقية',
    'حماة',
    'إدلب',
    'حلب',
    'الرقة',
    'دير الزور',
    'الحسكة',
  ];
  const publisherOptions = ['مالك', 'وكيل'];
  const contactOptions = ['موبايل', 'شات', 'الاتنين'];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleBackToListings = () => {
    navigate('/admin/listings');
  };

  const handleAcceptListing = async () => {
    if (isProcessing || acceptLoading) return;
    
    setIsProcessing(true);
    try {
      // استخدام الهوك الجديد لقبول الإعلان
      await acceptListingHandler();
    } catch (error) {
      console.error('Error accepting listing:', error);
      notify('حدث خطأ أثناء قبول الإعلان', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectListing = async () => {
    if (isProcessing || rejectLoading) return;
    
    setIsProcessing(true);
    try {
      // استخدام الهوك الجديد لرفض الإعلان
      await rejectListingHandler();
    } catch (error) {
      console.error('Error rejecting listing:', error);
      notify('حدث خطأ أثناء رفض الإعلان', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !listingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">لم يتم العثور على الإعلان</p>
          <button
            onClick={handleBackToListings}
            className="mt-4 bg-black text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  // If not a rental listing, show loading while redirecting
  if (listingData && !isRentalListing(listingData)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="mt-2 text-gray-600">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="mt-8">
        <NavbarForAdmin activeTab={activeTab} onTabClick={handleTabClick} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/listings')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            ← العودة للقائمة
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Section - Detailed Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-right">تفاصيل عقار للإيجار</h2>
              
              {/* Property Type */}
              <div className="space-y-3 mb-6">
                <label className="block text-base sm:text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>نوع العقار</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                  {propertyTypes.map(type => (
                    <div key={type} className={`flex items-center gap-0.5 sm:gap-2 font-[Noor] font-normal text-xs sm:text-sm leading-tight text-black`}>
                      <span className={`w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.propertyType === type 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {formData.propertyType === type && (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="line-clamp-1">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulation Status */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>داخل/خارج التنظيم</label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-md">
                  {regulationOptions.map(type => (
                    <div key={type} className={`flex items-center gap-0.5 font-[Noor] font-normal text-sm leading-tight text-black`}>
                      <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.regulationStatus === type 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {formData.regulationStatus === type && (
                          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المساحة (م²)</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.area ? `${formData.area} متر مربع` : 
                     listingData?.area ? `${listingData.area} متر مربع` : 
                     'لم يتم تحديد المساحة'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="text-yellow-600 font-medium">المساحة</span>
                  </div>
                </div>
              </div>

              {/* Floor */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الطابق</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.floor ? `الطابق ${formData.floor}` : 
                     listingData?.floor ? `الطابق ${listingData.floor}` : 
                     'لم يتم تحديد الطابق'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-yellow-600 font-medium">الطابق</span>
                  </div>
                </div>
              </div>

              {/* Number of Building Floors */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد طوابق المبنى</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.numberOfBuildingFloors ? `${formData.numberOfBuildingFloors} طوابق` : 
                     listingData?.["number of building floors"] ? `${listingData["number of building floors"]} طوابق` : 
                     'لم يتم تحديد عدد الطوابق'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-yellow-600 font-medium">عدد الطوابق</span>
                  </div>
                </div>
              </div>

              {/* Number of Rooms */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الغرف</label>
                <div className="flex gap-3 flex-wrap">
                  {roomOptions.map(opt => (
                    <div
                      key={opt}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-[Noor] font-normal text-base ${
                        formData.numberOfRooms === opt || formData.numberOfRooms === String(opt) || String(formData.numberOfRooms) === opt
                          ? 'bg-yellow-400 border-yellow-400 text-black' 
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}
                    >
                      {(formData.numberOfRooms === opt || formData.numberOfRooms === String(opt) || String(formData.numberOfRooms) === opt) && (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      <span className="w-full text-center">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Number of Living Rooms */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الصالونات</label>
                <div className="flex gap-3 flex-wrap">
                  {livingRoomOptions.map(opt => (
                    <div
                      key={opt}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-[Noor] font-normal text-base ${
                        formData.numberOfLivingRooms === opt || formData.numberOfLivingRooms === String(opt) || String(formData.numberOfLivingRooms) === opt
                          ? 'bg-yellow-400 border-yellow-400 text-black' 
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}
                    >
                      {(formData.numberOfLivingRooms === opt || formData.numberOfLivingRooms === String(opt) || String(formData.numberOfLivingRooms) === opt) && (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      <span className="w-full text-center">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Number of Bathrooms */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الحمامات</label>
                <div className="flex gap-3 flex-wrap">
                  {bathroomOptions.map(opt => (
                    <div
                      key={opt}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-[Noor] font-normal text-base ${
                        formData.numberOfBathrooms === opt || formData.numberOfBathrooms === String(opt) || String(formData.numberOfBathrooms) === opt
                          ? 'bg-yellow-400 border-yellow-400 text-black' 
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}
                    >
                      {(formData.numberOfBathrooms === opt || formData.numberOfBathrooms === String(opt) || String(formData.numberOfBathrooms) === opt) && (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      <span className="w-full text-center">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Building Age */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عمر المبنى</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.buildingAge ? `${formData.buildingAge} سنة` : 
                     listingData?.year ? `${listingData.year} سنة` : 
                     'لم يتم تحديد عمر المبنى'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-600 font-medium">العمر</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الكماليات</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
                  {amenities.map(am => (
                    <div
                      key={am}
                      className={`px-4 py-2 rounded-full border-2 font-[Noor] font-normal text-sm flex items-center justify-center gap-2 ${
                        formData.amenities.includes(am) 
                          ? 'bg-yellow-400 border-yellow-400 text-black' 
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}
                    >
                      {formData.amenities.includes(am) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      {am}
                    </div>
                  ))}
                </div>
              </div>

              {/* Furnished */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الفرش</label>
                <div className="flex gap-4">
                  <div className={`flex items-center gap-2 font-[Noor] font-normal text-base ${
                    formData.isFurnished === true 
                      ? 'bg-yellow-400 border-yellow-400 text-black' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`} style={{ borderRadius: '9999px', border: '2px solid', padding: '8px 32px', minWidth: 80, justifyContent: 'center' }}>
                    <span>نعم</span>
                  </div>
                  <div className={`flex items-center gap-2 font-[Noor] font-normal text-base ${
                    formData.isFurnished === false 
                      ? 'bg-yellow-400 border-yellow-400 text-black' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`} style={{ borderRadius: '9999px', border: '2px solid', padding: '8px 32px', minWidth: 80, justifyContent: 'center' }}>
                    <span>لا</span>
                  </div>
                </div>
              </div>

              {/* Rental Rate */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>معدل الإيجار</label>
                <div className="flex gap-6 flex-wrap">
                  {rentPeriods.map(opt => {
                    // Use the helper function for flexible matching
                    const isSelected = formData.rentalRate.some(rate => matchesOption(rate, [opt])) ||
                                     matchesOption(listingData?.rentalRate, [opt]) ||
                                     matchesOption(listingData?.["rental rate"], [opt]) ||
                                     matchesOption(listingData?.["معدل الإيجار"], [opt]);
                    return (
                      <div key={opt} className={`flex flex-row-reverse items-center gap-2 font-[Noor] font-normal text-base text-black`}>
                        <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                          isSelected
                            ? 'bg-yellow-400 border-yellow-400' 
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          {isSelected && (
                          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Show actual rental rate value if it doesn't match predefined options */}
                {(formData.rentalRate.length > 0 || listingData?.rentalRate || listingData?.["rental rate"] || listingData?.["معدل الإيجار"]) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>القيمة الفعلية لمعدل الإيجار:</strong> {
                        formData.rentalRate.length > 0 ? formData.rentalRate.join(', ') :
                        listingData?.rentalRate ? (Array.isArray(listingData.rentalRate) ? listingData.rentalRate.join(', ') : listingData.rentalRate) :
                        listingData?.["rental rate"] ? (Array.isArray(listingData["rental rate"]) ? listingData["rental rate"].join(', ') : listingData["rental rate"]) :
                        listingData?.["معدل الإيجار"] ? (Array.isArray(listingData["معدل الإيجار"]) ? listingData["معدل الإيجار"].join(', ') : listingData["معدل الإيجار"]) :
                        'غير محدد'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Rental Fees */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>رسوم الإيجار</label>
                <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.rentalFees ? `${formData.rentalFees}` : 
                     listingData?.["rental fees"] ? `${listingData["rental fees"]}` : 
                     'لم يتم تحديد رسوم الإيجار'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-gray-600 font-medium">رسوم الإيجار</span>
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>العملة</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-900 font-semibold">
                    {currencyOptions.find(opt => opt.value === formData.currency) ? (
                      <>
                        <span className="text-lg">{currencyOptions.find(opt => opt.value === formData.currency).flag}</span>
                        <span>{currencyOptions.find(opt => opt.value === formData.currency).label}</span>
                      </>
                    ) : formData.currency ? (
                      <span>{formData.currency}</span>
                    ) : (
                      <span>لم يتم تحديد العملة</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-yellow-600 font-medium">العملة</span>
                  </div>
                </div>
              </div>

              {/* Security Deposit */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>التأمين</label>
                <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.securityDeposit ? `${formData.securityDeposit}` : 
                     listingData?.["security deposit"] ? `${listingData["security deposit"]}` : 
                     'لم يتم تحديد مبلغ التأمين'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 font-medium">التأمين</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>موقع العقار</label>
                <div className="relative w-[85%]">
                  <div className="w-full p-3.5 border border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50 flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-grow text-right">
                      <div className="text-gray-900 font-semibold">
                        {resolvedAddress || formData.location.address || listingData?.['property location'] || 'لم يتم تحديد الموقع'}
                      </div>
                      {(listingData?.lat && listingData?.long) && (
                        <div className="text-gray-600 text-sm mt-1">
                          الإحداثيات: {listingData.lat.toFixed(6)}, {listingData.long.toFixed(6)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Governorate */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المحافظة</label>
                <div className="w-[85%] p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.governorate || listingData?.city || 'لم يتم تحديد المحافظة'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-yellow-600 font-medium">المحافظة</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عنوان الإعلان</label>
                <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50">
                  <span className="text-gray-900 font-semibold">
                    {formData['ad title'] || listingData?.['ad title'] || 'لم يتم تحديد عنوان الإعلان'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>وصف الإعلان</label>
                <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50">
                  <p className="text-gray-900 font-semibold text-right leading-relaxed">
                    {formData.description || listingData?.description || 'لم يتم تحديد وصف الإعلان'}
                  </p>
                </div>
              </div>

              {/* Published By */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تم النشر من قبل</label>
                
                {/* Show predefined options */}
                <div className="flex gap-6 flex-wrap">
                  {publisherOptions.map(opt => {
                    // Use the helper function for flexible matching
                    const isSelected = matchesOption(formData.publishedBy, [opt]) ||
                                     matchesOption(listingData?.publishedBy, [opt]) ||
                                     matchesOption(listingData?.publishedVia, [opt]) ||
                                     matchesOption(listingData?.["تم النشر من قبل"], [opt]) ||
                                     matchesOption(listingData?.["published by"], [opt]) ||
                                     matchesOption(listingData?.publisher, [opt]) ||
                                     matchesOption(listingData?.["ناشر"], [opt]);
                    return (
                      <div key={opt} className={`flex flex-row-reverse items-center gap-2 font-[Noor] font-normal text-base text-black`}>
                        <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                          isSelected
                            ? 'bg-yellow-400 border-yellow-400' 
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          {isSelected && (
                          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Show actual value if it doesn't match predefined options */}
                {(formData.publishedBy || listingData?.publishedBy || listingData?.publishedVia || listingData?.["تم النشر من قبل"] || listingData?.["published by"] || listingData?.publisher || listingData?.["ناشر"]) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>القيمة الفعلية:</strong> {
                        formData.publishedBy || 
                        listingData?.publishedBy || 
                        listingData?.publishedVia || 
                        listingData?.["تم النشر من قبل"] || 
                        listingData?.["published by"] || 
                        listingData?.publisher || 
                        listingData?.["ناشر"] || 
                        'غير محدد'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Negotiable */}          
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>&nbsp;</label>
                
                <div className={`flex items-center gap-3 font-[Noor] font-normal text-black`}>
                  <div className="relative">
                    <div className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.isNegotiable || 
                      listingData?.negotiable || 
                      listingData?.isNegotiable ||
                      listingData?.["قابل للتفاوض"] ||
                      listingData?.["negotiable"]
                        ? 'bg-yellow-400 border-yellow-400' 
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {(formData.isNegotiable || 
                        listingData?.negotiable || 
                        listingData?.isNegotiable ||
                        listingData?.["قابل للتفاوض"] ||
                        listingData?.["negotiable"]) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span>قابل للتفاوض</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-24">
                <h2 className="text-lg font-medium mb-6 text-gray-800" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>معلومات التواصل</h2>
                
                <div className="space-y-3">
                  <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الاسم</label>
                  <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50 flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      {formData.name || listingData?.name || 'لم يتم تحديد الاسم'}
                    </span>
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-600 font-medium">الاسم</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>رقم الهاتف المحمول</label>
                  <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50 flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      {formData.phone || listingData?.['phone number'] || 'لم يتم تحديد رقم الهاتف'}
                    </span>
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600 font-medium">الهاتف</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة التواصل</label>
                  <div className="flex gap-12">
                    {contactOptions.map(opt => (
                      <div key={opt} className={`flex flex-row-reverse items-center gap-2 font-[Noor] font-normal text-base text-black`}>
                        <span className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                          formData.contactMethod.includes(opt) 
                            ? 'bg-yellow-400 border-yellow-400' 
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          {formData.contactMethod.includes(opt) && (
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                      </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                  {/* Action Buttons */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={handleAcceptListing}
                  disabled={isProcessing || acceptLoading}
                  className={`px-8 py-3 rounded-lg transition-colors duration-200 font-medium text-lg ${
                    isProcessing || acceptLoading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isProcessing || acceptLoading ? 'جاري المعالجة...' : 'قبول الإعلان'}
                </button>
                <button
                  onClick={handleRejectListing}
                  disabled={isProcessing || rejectLoading}
                  className={`px-8 py-3 rounded-lg transition-colors duration-200 font-medium text-lg ${
                    isProcessing || rejectLoading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isProcessing || rejectLoading ? 'جاري المعالجة...' : 'رفض الإعلان'}
                </button>
              </div>

             
            </div>
          </div>

          {/* Right Section - Images Grid */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Images from the listing data */}
              {listingData.images && listingData.images.length > 0 ? (
                listingData.images.slice(0, 8).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                // Fallback images if no images in listing
                Array(8).fill(null).map((_, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">لا توجد صورة</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsRentForAdmin;    