import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarForAdmin from '../components/navbarForAdmin';
import ListingByIdHook from '../Hook/listing/listingByIdHook';
import AccepteListingHook from '../Hook/admin/AccepteListingHook';
import RejectListingHook from '../Hook/admin/rejectListingHook';
import notify from '../Hook/useNotifaction';

const ListingDetailsBuildingsForAdmin = () => {
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

  // Check if this is a buildings/lands listing
  const isBuildingsLandsListing = (data) => {
    if (!data) return false;
    
    // Check for buildings/lands specific fields
    const hasPropertyType = data["property type"];
    const hasNoRooms = !data["number of rooms"] && !data["number of bathrooms"];
    const hasArea = data.area || data["property area"];
    const hasPrice = data.price;
    
    // Buildings/lands typically have property type and area but no rooms/bathrooms
    return hasPropertyType && hasNoRooms && hasArea && hasPrice;
  };

  // Redirect if not a buildings/lands listing
  useEffect(() => {
    if (listingData && !isBuildingsLandsListing(listingData)) {
      navigate('/listing-details-admin/' + id);
    }
  }, [listingData, id, navigate]);

  // Map API data to form data structure for buildings/lands
  const mapApiDataToFormData = (data) => {
    if (!data) return {};
    
    // Handle area field more robustly
    const areaValue = data.area || data["property area"] || data["مساحة"] || '';
    
    // Handle publishedBy field more robustly
    const publishedByValue = data.publishedVia || data["published by"] || data["تم النشر من قبل"] || '';
    
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
    
    // Handle deedType field more robustly
    const deedTypeValue = data.deedType || data["deed type"] || data["نوع الطابو"] || '';
    
    return {
      propertyType: data["property type"] || '',
      regulationStatus: mappedRegulationStatus,
      area: areaValue,
      buildingAge: data.year || data["building age"] || '',
      price: data.price || '',
      currency: data.currency || '',
      paymentMethod: data["payment method"] ? [data["payment method"]] : [],
      location: {
        address: data["property location"] || data.city || '',
        lat: data.lat || 0,
        lng: data.long || 0
      },
      governorate: data.city || '',
      'ad title': data["ad title"] || data.title || data.name || '',
      description: data.description || '',
      publishedBy: publishedByValue,
      isNegotiable: data.negotiable || false,
      name: data.name || data["contact name"] || '',
      phone: data["phone number"] || data.phone || '',
      contactMethod: data["contact method"] || []
    };
  };

  const formData = mapApiDataToFormData(listingData);

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

  // Options arrays for buildings/lands
  const propertyTypes = [
    'زراعية', 'تجارية', 'سكنية', 'صناعية'
  ];
  const regulationOptions = ['داخل التنظيم', 'خارج التنظيم'];
  const buildingAgeOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const currencyOptions = [
    { value: 'ليرة', label: 'ليرة سورية', flag: '🇸🇾' },
    { value: 'دولار', label: 'دولار أمريكي', flag: '🇺🇸' }
  ];
  const paymentOptions = ['كاش', 'تقسيط', 'كاش أو تقسيط'];
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
  const publisherOptions = ['المالك', 'الوكيل'];
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

  // If not a buildings/lands listing, show loading while redirecting
  if (listingData && !isBuildingsLandsListing(listingData)) {
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
        {/* Back to Listings Button */}
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
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-right">تفاصيل المباني والأراضي</h2>
              
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

              {/* Price */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>السعر</label>
                <div className="w-full p-4 border-2 border-gray-300 rounded-2xl text-base font-[Noor] font-normal text-right bg-gray-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.price ? `${formData.price}` : 
                     listingData?.price ? `${listingData.price}` : 
                     'لم يتم تحديد السعر'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-gray-600 font-medium">السعر</span>
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

              {/* Payment Method */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة الدفع</label>
                <div className="flex gap-6 flex-wrap">
                  {paymentOptions.map(opt => (
                    <div key={opt} className={`flex flex-row-reverse items-center gap-2 font-[Noor] font-normal text-base text-black`}>
                      <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.paymentMethod.includes(opt) 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {formData.paymentMethod.includes(opt) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
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
                <div className="flex gap-6 flex-wrap">
                  {publisherOptions.map(opt => (
                    <div key={opt} className={`flex flex-row-reverse items-center gap-2 font-[Noor] font-normal text-base text-black`}>
                      <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.publishedBy === opt 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {formData.publishedBy === opt && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiable */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>&nbsp;</label>
                <div className={`flex items-center gap-3 font-[Noor] font-normal text-black`}>
                  <div className="relative">
                    <div className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.isNegotiable 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {formData.isNegotiable && (
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

export default ListingDetailsBuildingsForAdmin; 