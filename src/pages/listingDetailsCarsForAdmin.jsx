import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarForAdmin from '../components/navbarForAdmin';
import ListingByIdHook from '../Hook/listing/listingByIdHook';
import AccepteListingHook from '../Hook/admin/AccepteListingHook';
import RejectListingHook from '../Hook/admin/rejectListingHook';
import notify from '../Hook/useNotifaction';

const ListingDetailsCarsForAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe) {
      // Right to left swipe - go back to listings
      navigate('/admin/listings');
    }
  };

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
      console.log('Raw Car Listing Data:', listingData);
      console.log('Fuel Type Data:', {
        fuelType: listingData["fuel type"],
        arabicFuelType: listingData["نوع الوقود"]
      });
      console.log('Transmission Data:', {
        transmission: listingData.transmission,
        arabicTransmission: listingData["ناقل الحركة"],
        carTransmission: listingData["car transmission"],
        transmissionField: listingData["transmission"],
        transmissionType: listingData["transmission type"],
        // Check all possible transmission fields
        allTransmissionFields: {
          transmission: listingData.transmission,
          carTransmission: listingData["car transmission"],
          arabicTransmission: listingData["ناقل الحركة"],
          transmissionField: listingData["transmission"],
          transmissionType: listingData["transmission type"],
          gearbox: listingData.gearbox,
          gearBox: listingData.gearBox,
          gear_box: listingData["gear_box"],
          gearboxType: listingData.gearboxType,
          transmissionTypeField: listingData.transmissionType
        },
        // Check for combined transmission options
        combinedTransmission: {
          manualAutomatic: listingData["manual/automatic"],
          manualAutomaticField: listingData["manual automatic"],
          manualOrAutomatic: listingData["manual or automatic"],
          arabicCombined: listingData["يدوى/عادى"],
          arabicCombinedAlt: listingData["يدوي/عادي"]
        }
      });
      console.log('Condition Data:', {
        condition: listingData.condition,
        arabicCondition: listingData["حالة السيارة"],
        carCondition: listingData["car condition"],
        type: listingData.type
      });
      console.log('Published By Data:', {
        publishedBy: listingData.publishedBy,
        publishedVia: listingData.publishedVia,
        arabicPublishedBy: listingData["تم النشر من قبل"],
        publishedByField: listingData["published by"]
      });
    }
  }, [listingData]);

  // Check if this is a car listing
  const isCarListing = (data) => {
    if (!data) return false;
    
    // Check for car-specific fields
    const hasBrand = data.brand || data["Car Type"];
    const hasModel = data.model || data["car model"];
    const hasYear = data.year || data["car year"];
    const hasTransmission = data["transmission type"] || data.transmission || data["car transmission"];
    const hasMileage = data.kilometers || data.mileage || data["car mileage"];
    const hasHorsepower = data.Horsepower;
    const hasEngineCapacity = data["Engine Capacity"];
    const hasDrivetrain = data.Drivetrain;
    const hasColor = data.color || data["car color"];
    const hasVersion = data.version;
    const hasImported = data.Imported;
    const hasNumberOfDoors = data["number of doors"];
    const hasNumberOfSets = data["number of sets"];
    
    // Check if it's NOT a property listing (to avoid confusion)
    const hasPropertyType = data["property type"];
    const hasArea = data.area || data["property area"];
    const hasRooms = data["number of rooms"];
    const hasBathrooms = data["number of bathrooms"];
    const hasFloor = data.floor;
    const hasBuildingFloors = data["number of building floors"];
    const hasRegulationStatus = data["regulation status"] || data["داخل/خارج التنظيم"];
    
    // If it has property-specific fields, it's NOT a car
    if (hasPropertyType || hasArea || hasRooms || hasBathrooms || hasFloor || hasBuildingFloors || hasRegulationStatus) {
      console.log('Not a car - has property fields:', {
        hasPropertyType,
        hasArea,
        hasRooms,
        hasBathrooms,
        hasFloor,
        hasBuildingFloors,
        hasRegulationStatus
      });
      return false;
    }
    
    // Must have at least 2 car-specific fields to be considered a car
    const carFields = [hasBrand, hasModel, hasYear, hasTransmission, hasMileage, hasHorsepower, hasEngineCapacity, hasDrivetrain, hasColor, hasVersion, hasImported, hasNumberOfDoors, hasNumberOfSets];
    const carFieldsCount = carFields.filter(Boolean).length;
    
    console.log('Car Listing Check:', {
      data,
      hasBrand,
      hasModel,
      hasYear,
      hasTransmission,
      hasMileage,
      hasHorsepower,
      hasEngineCapacity,
      hasDrivetrain,
      hasColor,
      hasVersion,
      hasImported,
      hasNumberOfDoors,
      hasNumberOfSets,
      hasPropertyType,
      hasArea,
      hasRooms,
      hasBathrooms,
      hasFloor,
      hasBuildingFloors,
      hasRegulationStatus,
      carFieldsCount,
      isCar: carFieldsCount >= 2 && !hasPropertyType
    });
    
    return carFieldsCount >= 2 && !hasPropertyType;
  };

  // Redirect if not a car listing
  useEffect(() => {
    if (listingData && !isCarListing(listingData)) {
      console.log('Redirecting from car page - not a car listing:', listingData);
      
      // Check what type of listing it is and redirect accordingly
      const hasPropertyType = listingData["property type"];
      const hasArea = listingData.area || listingData["property area"];
      const hasRooms = listingData["number of rooms"];
      const hasBathrooms = listingData["number of bathrooms"];
      const hasRentalFees = listingData["rental fees"];
      const category = listingData.category;
      
      let redirectPath = '/listing-details-admin/' + id; // Default to sale page
      
      // If it has property fields, it's a property listing
      if (hasPropertyType || hasArea || hasRooms || hasBathrooms) {
        if (hasRentalFees) {
          redirectPath = '/listing-details-rent-admin/' + id;
        } else {
          redirectPath = '/listing-details-admin/' + id;
        }
      }
      
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath);
    }
  }, [listingData, id, navigate]);

  // Map API data to form data structure for cars
  const mapApiDataToFormData = (data) => {
    if (!data) return {};
    
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
        mappedPublishedBy = 'المالك';
      } else if (publishedByValue.includes('وكيل') || publishedByValue.includes('agent')) {
        mappedPublishedBy = 'الوكيل';
      } else {
        mappedPublishedBy = publishedByValue; // Keep original if no match
      }
    }
    
    // Handle fuel type more robustly
    const fuelTypeValue = data["fuel type"] || data["نوع الوقود"] || data.fuelType || '';
    let fuelTypeArray = [];
    
    if (fuelTypeValue) {
      if (Array.isArray(fuelTypeValue)) {
        fuelTypeArray = fuelTypeValue;
      } else if (typeof fuelTypeValue === 'string') {
        // Split by common separators and clean up
        fuelTypeArray = fuelTypeValue.split(/[,،\s]+/).filter(item => item.trim());
      } else {
        fuelTypeArray = [String(fuelTypeValue)];
      }
    }
    
    // Handle transmission more robustly
    const transmissionValue = data.transmission || 
                             data["car transmission"] || 
                             data["ناقل الحركة"] || 
                             data["transmission"] || 
                             data["transmission type"] ||
                             data.gearbox ||
                             data.gearBox ||
                             data["gear_box"] ||
                             data.gearboxType ||
                             data.transmissionType ||
                             data["ناقل"] ||
                             data["ناقل الحركة"] ||
                             data["manual/automatic"] ||
                             data["manual automatic"] ||
                             data["manual or automatic"] ||
                             data["يدوى/عادى"] ||
                             data["يدوي/عادي"] ||
                             '';
    
    // Debug: Log the transmission mapping
    console.log('Transmission Mapping:', {
      originalData: data,
      transmission: data.transmission,
      carTransmission: data["car transmission"],
      arabicTransmission: data["ناقل الحركة"],
      transmissionField: data["transmission"],
      transmissionType: data["transmission type"],
      gearbox: data.gearbox,
      gearBox: data.gearBox,
      gear_box: data["gear_box"],
      gearboxType: data.gearboxType,
      transmissionTypeField: data.transmissionType,
      arabicNakel: data["ناقل"],
      // Combined transmission options
      manualAutomatic: data["manual/automatic"],
      manualAutomaticField: data["manual automatic"],
      manualOrAutomatic: data["manual or automatic"],
      arabicCombined: data["يدوى/عادى"],
      arabicCombinedAlt: data["يدوي/عادي"],
      finalValue: transmissionValue
    });
    
    // Handle condition more robustly
    const conditionValue = data.condition || 
                          data["car condition"] || 
                          data["حالة السيارة"] || 
                          data["condition"] || 
                          data.type ||
                          '';
    
    // Debug: Log the mapping
    console.log('Car Data Mapping:', {
      fuelType: {
        original: fuelTypeValue,
        final: fuelTypeArray
      },
      transmission: {
        original: transmissionValue,
        final: transmissionValue
      },
      condition: {
        original: conditionValue,
        final: conditionValue,
        type: data.type,
        condition: data.condition,
        carCondition: data["car condition"],
        arabicCondition: data["حالة السيارة"]
      },
      publishedBy: {
        original: publishedByValue,
        mapped: mappedPublishedBy
      }
    });
    
    return {
      brand: data.brand || data["Car Type"] || '',
      model: data.model || data["car model"] || '',
      year: data.year || data["car year"] || '',
      mileage: data.mileage || data["car mileage"] || '',
      fuelType: fuelTypeArray,
      transmission: transmissionValue,
      color: data.color || data["car color"] || '',
      condition: conditionValue,
      price: data.price || '',
      currency: data.currency || '',
      paymentMethod: data["payment method"] ? 
        (Array.isArray(data["payment method"]) ? data["payment method"] : [data["payment method"]]) : [],
      location: {
        address: data["property location"] || data.city || '',
        lat: data.lat || 0,
        lng: data.long || 0
      },
      governorate: data.city || '',
      'ad title': data["ad title"] || data.title || data.name || '',
      description: data.description || '',
      publishedBy: mappedPublishedBy,
      isNegotiable: data.negotiable || data.isNegotiable || data["قابل للتفاوض"] || false,
      name: data.name || data["contact name"] || '',
      phone: data["phone number"] || data.phone || '',
      contactMethod: data["contact method"] ? 
        (Array.isArray(data["contact method"]) ? data["contact method"] : [data["contact method"]]) : []
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
        'المالك': ['مالك', 'المالك', 'owner'],
        'الوكيل': ['وكيل', 'الوكيل', 'agent'],
        'بنزين': ['بنزين', 'بنزين', 'gasoline', 'petrol'],
        'ديزل': ['ديزل', 'ديزل', 'diesel'],
        'كهرباء': ['كهرباء', 'كهربائي', 'electric'],
        'هجين': ['هجين', 'هجينة', 'hybrid'],
        'غاز طبيعي': ['غاز طبيعي', 'غاز', 'natural gas'],
        'يدوي': ['يدوي', 'يدوية', 'manual', 'manual transmission', 'mt', 'manual gearbox', 'manual gear box'],
        'أوتوماتيك': ['أوتوماتيك', 'أوتوماتيكي', 'automatic', 'automatic transmission', 'at', 'auto', 'automatic gearbox', 'automatic gear box'],
        'يدوى/عادى': ['يدوى/عادى', 'يدوي/عادي', 'يدوى عادى', 'يدوي عادي', 'manual/automatic', 'manual automatic', 'manual or automatic'],
        'جديد': ['جديد', 'جديدة', 'new'],
        'مستعمل': ['مستعمل', 'مستعملة', 'used']
      };
      
      // Check for Arabic variations
      for (const [key, variations] of Object.entries(arabicVariations)) {
        if (variations.includes(normalizedOption)) {
          if (variations.some(variation => normalizedValue.includes(variation))) {
            return true;
          }
        }
      }
      
      // Special handling for transmission variations
      if (normalizedOption === 'يدوي' && (
        normalizedValue.includes('manual') || 
        normalizedValue.includes('mt') || 
        normalizedValue.includes('gear') && normalizedValue.includes('manual')
      )) {
        return true;
      }
      
      if (normalizedOption === 'أوتوماتيك' && (
        normalizedValue.includes('automatic') || 
        normalizedValue.includes('auto') || 
        normalizedValue.includes('at') || 
        normalizedValue.includes('gear') && normalizedValue.includes('auto')
      )) {
        return true;
      }
      
      if (normalizedOption === 'يدوى/عادى' && (
        normalizedValue.includes('manual') && normalizedValue.includes('automatic') ||
        normalizedValue.includes('manual/automatic') ||
        normalizedValue.includes('manual automatic') ||
        normalizedValue.includes('manual or automatic') ||
        normalizedValue.includes('يدوى') && normalizedValue.includes('عادى') ||
        normalizedValue.includes('يدوي') && normalizedValue.includes('عادي')
      )) {
        return true;
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

  // Options arrays for cars
  const brandOptions = [
    'تويوتا', 'هوندا', 'نيسان', 'مازدا', 'سوزوكي', 'ميتسوبيشي', 'سوبارو', 'دايهاتسو', 'هيونداي', 'كيا', 'شيفروليه', 'فورد', 'دودج', 'جيب', 'بي إم دبليو', 'مرسيدس', 'أودي', 'فولكس فاجن', 'سكودا', 'سيتروين', 'بيجو', 'رينو', 'فيات', 'ألفا روميو', 'لانشيا', 'فيراري', 'لامبورغيني', 'بورش', 'أستون مارتن', 'جاكوار', 'لاند روفر', 'رولز رويس', 'بنتلي', 'مازيراتي', 'ألبا روميو', 'لوتس', 'مكلارين', 'باجاني', 'كويج', 'بوجاتي', 'كاديلاك', 'لينكولن', 'بونتياك', 'أولدزموبيل', 'بليموث', 'ساتورن', 'هيومر', 'ساب', 'فولفو', 'سيات', 'ألبا روميو', 'لانشيا', 'فيراري', 'لامبورغيني', 'مازيراتي', 'أستون مارتن', 'بنتلي', 'رولز رويس', 'جاكوار', 'لاند روفر', 'لوتس', 'مكلارين', 'باجاني', 'كويج', 'بوجاتي', 'كاديلاك', 'لينكولن', 'بونتياك', 'أولدزموبيل', 'بليموث', 'ساتورن', 'هيومر', 'ساب', 'فولفو', 'سيات'
  ];
  const fuelTypeOptions = ['بنزين', 'ديزل', 'كهرباء', 'هجين', 'غاز طبيعي'];
  const transmissionOptions = ['يدوي', 'أوتوماتيك', 'يدوى/عادى'];
  const colorOptions = [
    'أبيض', 'أسود', 'أحمر', 'أزرق', 'أخضر', 'أصفر', 'برتقالي', 'بنفسجي', 'وردي', 'بني', 'رمادي', 'فضي', 'ذهبي', 'برونزي', 'أزرق داكن', 'أخضر داكن', 'أحمر داكن', 'أصفر داكن', 'برتقالي داكن', 'بنفسجي داكن', 'وردي داكن', 'بني داكن', 'رمادي داكن', 'فضي داكن', 'ذهبي داكن', 'برونزي داكن'
  ];
  const conditionOptions = ['جديد', 'مستعمل'];
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

  // If not a car listing, show loading while redirecting
  if (listingData && !isCarListing(listingData)) {
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
    <div 
      className="min-h-screen bg-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-right">تفاصيل السيارة</h2>
              
              {/* Brand */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الماركة</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.brand || listingData?.brand || listingData?.["Car Type"] || 'لم يتم تحديد الماركة'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-yellow-600 font-medium">الماركة</span>
                  </div>
                </div>
              </div>

              {/* Model */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الموديل</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.model || listingData?.model || listingData?.["car model"] || 'لم يتم تحديد الموديل'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-yellow-600 font-medium">الموديل</span>
                  </div>
                </div>
              </div>

              {/* Year */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>سنة الصنع</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.year || listingData?.year || listingData?.["car year"] || 'لم يتم تحديد سنة الصنع'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-600 font-medium">سنة الصنع</span>
                  </div>
                </div>
              </div>

              {/* Mileage */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الكيلومترات</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.mileage ? `${formData.mileage} كم` : 
                     listingData?.mileage ? `${listingData.mileage} كم` : 
                     listingData?.["car mileage"] ? `${listingData["car mileage"]} كم` : 
                     'لم يتم تحديد عدد الكيلومترات'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-yellow-600 font-medium">الكيلومترات</span>
                  </div>
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>نوع الوقود</label>
                <div className="flex gap-6 flex-wrap">
                  {fuelTypeOptions.map(opt => {
                    // Use the helper function for flexible matching
                    const isSelected = formData.fuelType.some(fuel => matchesOption(fuel, [opt])) ||
                                     matchesOption(listingData?.["fuel type"], [opt]) ||
                                     matchesOption(listingData?.["نوع الوقود"], [opt]) ||
                                     matchesOption(listingData?.fuelType, [opt]);
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
                
                {/* Show actual fuel type value if it doesn't match predefined options */}
                {(formData.fuelType.length > 0 || listingData?.["fuel type"] || listingData?.["نوع الوقود"] || listingData?.fuelType) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>القيمة الفعلية لنوع الوقود:</strong> {
                        formData.fuelType.length > 0 ? formData.fuelType.join(', ') :
                        listingData?.["fuel type"] ? (Array.isArray(listingData["fuel type"]) ? listingData["fuel type"].join(', ') : listingData["fuel type"]) :
                        listingData?.["نوع الوقود"] ? (Array.isArray(listingData["نوع الوقود"]) ? listingData["نوع الوقود"].join(', ') : listingData["نوع الوقود"]) :
                        listingData?.fuelType ? (Array.isArray(listingData.fuelType) ? listingData.fuelType.join(', ') : listingData.fuelType) :
                        'غير محدد'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Transmission */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>ناقل الحركة</label>
                <div className="flex gap-6 flex-wrap">
                  {transmissionOptions.map(opt => {
                    // Use the helper function for flexible matching with all possible sources
                    const isSelected = matchesOption(formData.transmission, [opt]) ||
                                     matchesOption(listingData?.transmission, [opt]) ||
                                     matchesOption(listingData?.["car transmission"], [opt]) ||
                                     matchesOption(listingData?.["ناقل الحركة"], [opt]) ||
                                     matchesOption(listingData?.["transmission type"], [opt]) ||
                                     matchesOption(listingData?.gearbox, [opt]) ||
                                     matchesOption(listingData?.gearBox, [opt]) ||
                                     matchesOption(listingData?.["gear_box"], [opt]) ||
                                     matchesOption(listingData?.gearboxType, [opt]) ||
                                     matchesOption(listingData?.transmissionType, [opt]) ||
                                     matchesOption(listingData?.["ناقل"], [opt]) ||
                                     matchesOption(listingData?.["manual/automatic"], [opt]) ||
                                     matchesOption(listingData?.["manual automatic"], [opt]) ||
                                     matchesOption(listingData?.["manual or automatic"], [opt]) ||
                                     matchesOption(listingData?.["يدوى/عادى"], [opt]) ||
                                     matchesOption(listingData?.["يدوي/عادي"], [opt]);
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
                
                {/* Show actual transmission value if it doesn't match predefined options */}
                {(formData.transmission || listingData?.transmission || listingData?.["car transmission"] || listingData?.["ناقل الحركة"] || listingData?.["transmission type"] || listingData?.gearbox || listingData?.gearBox || listingData?.["gear_box"] || listingData?.gearboxType || listingData?.transmissionType || listingData?.["ناقل"] || listingData?.["manual/automatic"] || listingData?.["manual automatic"] || listingData?.["manual or automatic"] || listingData?.["يدوى/عادى"] || listingData?.["يدوي/عادي"]) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>القيمة الفعلية لناقل الحركة:</strong> {
                        formData.transmission || 
                        listingData?.transmission || 
                        listingData?.["car transmission"] || 
                        listingData?.["ناقل الحركة"] || 
                        listingData?.["transmission type"] ||
                        listingData?.gearbox ||
                        listingData?.gearBox ||
                        listingData?.["gear_box"] ||
                        listingData?.gearboxType ||
                        listingData?.transmissionType ||
                        listingData?.["ناقل"] ||
                        listingData?.["manual/automatic"] ||
                        listingData?.["manual automatic"] ||
                        listingData?.["manual or automatic"] ||
                        listingData?.["يدوى/عادى"] ||
                        listingData?.["يدوي/عادي"] ||
                        'غير محدد'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>اللون</label>
                <div className="w-full p-4 border-2 border-yellow-400 rounded-2xl text-base font-[Noor] font-normal text-right bg-yellow-50 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {formData.color || listingData?.color || listingData?.["car color"] || 'لم يتم تحديد اللون'}
                  </span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    <span className="text-yellow-600 font-medium">اللون</span>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-3 mb-6">
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>حالة السيارة</label>
                <div className="flex gap-6 flex-wrap">
                  {conditionOptions.map(opt => {
                    // Use the helper function for flexible matching
                    const isSelected = matchesOption(formData.condition, [opt]) ||
                                     matchesOption(listingData?.condition, [opt]) ||
                                     matchesOption(listingData?.["car condition"], [opt]) ||
                                     matchesOption(listingData?.["حالة السيارة"], [opt]) ||
                                     matchesOption(listingData?.type, [opt]);
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
                
                {/* Show actual condition value if it doesn't match predefined options */}
                {(formData.condition || listingData?.condition || listingData?.["car condition"] || listingData?.["حالة السيارة"] || listingData?.type) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>القيمة الفعلية لحالة السيارة:</strong> {
                        formData.condition || 
                        listingData?.condition || 
                        listingData?.["car condition"] || 
                        listingData?.["حالة السيارة"] || 
                        listingData?.type ||
                        'غير محدد'
                      }
                    </p>
                  </div>
                )}
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
                <label className="block text-lg text-gray-900" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>موقع السيارة</label>
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
              <div className="space-y-4 mb-6">
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
                 <div className="flex gap-4 justify-center mt-9">
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

export default ListingDetailsCarsForAdmin; 