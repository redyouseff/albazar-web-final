import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'country-flag-icons/react/3x2';
import Layout from '../components/Layout';
import icon from "/images/cuida_building-outline (1).png"
import addImageIcon from "/images/Add Photo.svg"
import { CATEGORY_LAND_ID } from "../redux/Type";
import AddListingHook from '../Hook/listing/addListingHook';
import notify from '../Hook/useNotifaction';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: 'calc(80vh - 70px)'
};

const mapOptions = {
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  disableDefaultUI: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "water",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const AddBuildingsAndLands = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    // Basic Property Info
    propertyType: [], // تغيير إلى array للـ checkboxes
    regulationStatus: [], // تغيير إلى array للـ checkboxes
    area: '',
    buildingAge: '', // عمر المبنى - إضافة
    
    // Land/Building Information
    'listing status': [], // تغيير إلى array للـ checkboxes
    amenities: [], // المرافق والخدمات - إضافة
    deliveryConditions: [], // حالة التسليم - إضافة
    propertyCondition: [], // حالة العقار - إضافة
    deedType: '', // نوع الطابو - إضافة
    
    // Location
    location: {
      address: '',
      lat: 33.5138,
      lng: 36.2765
    },
    city: '', // المحافظة - dropdown

    // Additional Info
    "ad title": '',
    description: '',
    publishedVia: [], // تغيير إلى array للـ checkboxes
    
    // Sale Information
    price: '',
    currency: 'ليرة', // dropdown
    paymentMethod: [],
    negotiable: false,

    // Contact Info
    name: '',
    phone: '',
    contactMethod: [],

    // Category
    categoryId: CATEGORY_LAND_ID,
    category: CATEGORY_LAND_ID
  });

  // Store actual files and preview URLs separately
  const [imageFiles, setImageFiles] = useState(Array(12).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(12).fill(null));

  const [submitListing, response, loading, error, success] = AddListingHook()

  // Add state for validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Dropdown states (فقط المحافظة والعملة)
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 33.5138,
    lng: 36.2765
  });

  // Options arrays
  const propertyTypes = [
    'زراعية', 'تجارية', 'سكنية', 'صناعية'
  ];
  const regulationOptions = ['داخل التنظيم', 'خارج التنظيم'];
  const listingStatusOptions = ['بيع', 'إيجار'];
  const buildingAgeOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const amenities = [
    'مياه', 'كهرباء', 'غاز', 'هاتف', 'إنترنت', 'طرق معبدة', 'إنارة', 'صرف صحي', 'أمن', 'موقف سيارات', 'مصعد', 'تكييف', 'تدفئة', 'مطبخ', 'حمام', 'مخزن', 'سقيفة', 'بئر', 'خزان مياه', 'مولد كهرباء'
  ];
  const deliveryOptions = ['جاهز', 'قيد الإنشاء', 'أساسات', 'هيكل', 'تشطيب'];
  const propertyConditionOptions = ['جديد', 'مستعمل', 'قيد الإنشاء', 'مطلوب تجديد'];
  const deedTypeOptions = ['طابو أخضر', 'طابو أحمر', 'عقد بيع', 'إيصال دفع', 'أخضر طابو (طابو نظامي)'];
  const currencyOptions = [
    { value: 'ليرة', label: 'ليرة سورية', flag: '🇸🇾' },
    { value: 'دولار', label: 'دولار أمريكي', flag: '🇺🇸' }
  ];
  const paymentOptions = ['كاش', 'تقسيط', 'كاش أو تقسيط'];
  const publishedViaOptions = ['المالك', 'الوكيل'];
  const contactOptions = ['موبايل', 'شات', 'الاتنين'];
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

  // Handle success state from the hook
  useEffect(() => {
    if (success && hasSubmitted) {
      console.log('Success received - listing submitted successfully');
      notify('تم طلب الإعلان بنجاح', 'success');
      
      // Navigate to home page after successful submission
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [success, hasSubmitted, navigate]);

  // Handle loading state   
  useEffect(() => {
    setIsSubmitting(loading);
  }, [loading]);

  // Handle error state
  useEffect(() => {
    if (error && hasSubmitted) {
      notify(error, 'error');
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  }, [error, hasSubmitted]);

  // Helper functions for consistent styling
  const getInputClass = (fieldName) => `w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
    isDarkMode 
      ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600 focus:border-gray-500' 
      : 'bg-[#F9FAFB] text-gray-900 border-gray-100 placeholder-gray-500 hover:border-gray-300'
  } ${getErrorClass(fieldName)}`;

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    updateFormData(lat, lng);
  };

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    updateFormData(lat, lng);
  };

  const updateFormData = (lat, lng) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`)
      .then(response => response.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          location: {
            address: data.display_name,
            lat,
            lng
          }
        }));
      })
      .catch(error => {
        console.error('Error getting address:', error);
        setFormData(prev => ({
          ...prev,
          location: {
            address: 'عنوان غير معروف',
            lat,
            lng
          }
        }));
      });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      notify('متصفحك لا يدعم تحديد الموقع', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setMarkerPosition({ lat, lng });
        updateFormData(lat, lng);
        notify('تم تحديد موقعك بنجاح', 'success');
      },
      () => {
        notify('فشل في تحديد موقعك الحالي', 'error');
      }
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Find the first empty slot
      const currentFiles = imageFiles.filter(file => file !== null);
      const maxImages = 8;
      
      if (currentFiles.length + files.length > maxImages) {
        notify(`يمكنك تحميل ${maxImages} صور كحد أقصى`, 'error');
        return;
      }

      files.forEach((file, fileIndex) => {
        if (!file.type.startsWith('image/')) {
          notify('يرجى رفع ملفات صور فقط', 'error');
          return;
        }

        // Find next empty slot
        const emptyIndex = imageFiles.findIndex(img => img === null);
        if (emptyIndex !== -1) {
          // Store the actual file
          setImageFiles(prev => {
            const newFiles = [...prev];
            newFiles[emptyIndex] = file;
            return newFiles;
          });

          // Create and store the preview URL
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreviews(prev => {
              const newPreviews = [...prev];
              newPreviews[emptyIndex] = e.target.result;
              return newPreviews;
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = null;
      return newFiles;
    });

    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'contactMethod' || name === 'paymentMethod' || name === 'amenities' || name === 'deliveryConditions' || name === 'propertyCondition') {
        // هذه الحقول تسمح باختيار متعدد
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value] 
            : prev[name].filter(v => v !== value)
        }));
      } else if (['propertyType', 'regulationStatus', 'listing status', 'publishedVia'].includes(name)) {
        // هذه الحقول تسمح باختيار واحد فقط
        setFormData(prev => ({
          ...prev,
          [name]: checked ? [value] : []
        }));
      } else if (name === 'negotiable') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Images validation (at least 5)
    const validImages = imageFiles.filter(file => file !== null);
    if (validImages.length < 5) {
      newErrors.images = 'يجب رفع 5 صور على الأقل';
    }

    // Property Type (اختيار واحد فقط)
    if (formData.propertyType.length === 0) {
      newErrors.propertyType = 'يجب اختيار نوع واحد للأرض/المبنى';
    }

    // Regulation Status (اختيار واحد فقط)
    if (formData.regulationStatus.length === 0) {
      newErrors.regulationStatus = 'يجب اختيار داخل أو خارج التنظيم';
    }

    // Area
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'يجب إدخال المساحة';
    }

    // Building Age (اختياري)
    if (formData.buildingAge && (formData.buildingAge <= 0 || formData.buildingAge > 100)) {
      newErrors.buildingAge = 'يجب إدخال عمر صحيح للمبنى';
    }

    // Listing Status (اختيار واحد فقط)
    if (formData['listing status'].length === 0) {
      newErrors.listingStatus = 'يجب اختيار بيع أو إيجار (واحد فقط)';
    }

    // Currency
    if (!formData.currency) {
      newErrors.currency = 'يجب اختيار العملة';
    }

    // City
    if (!formData.city) {
      newErrors.city = 'يجب اختيار المحافظة';
    }

    // Published Via (اختيار واحد فقط)
    if (formData.publishedVia.length === 0) {
      newErrors.publishedVia = 'يجب اختيار ناشر الإعلان (المالك أو الوكيل)';
    }

    // Location
    if (!formData.location.address) {
      newErrors.location = 'يجب تحديد موقع العقار';
    }

    // Price
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'يجب إدخال السعر';
    }

    // Payment Method
    if (formData.paymentMethod.length === 0) {
      newErrors.paymentMethod = 'يجب اختيار طريقة دفع واحدة على الأقل';
    }

    // Title
    if (!formData['ad title'].trim()) {
      newErrors.title = 'يجب إدخال عنوان الإعلان';
    }

    // Description
    if (!formData.description.trim()) {
      newErrors.description = 'يجب إدخال وصف الإعلان';
    }

    // Contact Info
    if (!formData.name.trim()) {
      newErrors.name = 'يجب إدخال الاسم';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'يجب إدخال رقم الهاتف';
    }

    if (formData.contactMethod.length === 0) {
      newErrors.contactMethod = 'يجب تحديد طريقة التواصل';
    }

    return newErrors;
  };

  const scrollToFirstError = (errors) => {
    const fieldOrder = [
      'images', 'propertyType', 'regulationStatus', 'area', 'buildingAge', 'listingStatus', 
      'currency', 'city', 'publishedVia', 'location', 'price', 'paymentMethod',
      'title', 'description', 'name', 'phone', 'contactMethod'
    ];

    for (const field of fieldOrder) {
      if (errors[field]) {
        const element = document.querySelector(`[data-field="${field}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
          element.style.transition = 'box-shadow 0.3s ease';
          setTimeout(() => {
            element.style.boxShadow = 'none';
          }, 2000);

          const input = element.querySelector('input, select, textarea');
          if (input) {
            input.focus();
          }
          break;
        }
      }
    }
  };

  function dataURLtoFile(dataurl, filename) {
    if (!dataurl) {
      console.error('Invalid data URL:', dataurl);
      return null;
    }

    try {
      var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    setIsSubmitting(true);
    setHasSubmitted(true);

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
        console.log('Form has validation errors, stopping submission');
        setIsSubmitting(false);
        setHasSubmitted(false);
        
        scrollToFirstError(formErrors);
        notify('يرجى تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }

    console.log('Form validation passed, proceeding with submission');

    try {
        const formDataToSend = new FormData();

        // Add all non-file form fields to FormData
        Object.keys(formData).forEach(key => {
            if (key !== 'images') {
                if (key === 'location') {
                    formDataToSend.append('property location', formData.location.address);
                    formDataToSend.append('lat', formData.location.lat);
                    formDataToSend.append('long', formData.location.lng);
                } else if (Array.isArray(formData[key])) {
                    // Handle array fields properly - map to correct API names
                    let apiKey = key;
                    if (key === 'contactMethod') apiKey = 'contact method';
                    else if (key === 'paymentMethod') apiKey = 'payment method';
                    else if (key === 'propertyType') apiKey = 'property type';
                    else if (key === 'listing status') {
                        // Special handling for listing status - use first selected value
                        formDataToSend.append('sale or rent', formData[key][0] || '');
                        return; // Skip normal processing
                    }
                    
                    formData[key].forEach(value => {
                        formDataToSend.append(apiKey, value);
                    });
                } else {
                    // Map field names to API expected names (exact match with Schema)
                    let apiKey = key;
                    let value = formData[key];
                    
                    if (key === 'city') apiKey = 'city';
                    else if (key === 'phone') apiKey = 'phone number';
                    else if (key === 'negotiable') {
                        apiKey = 'negotiable';
                        value = formData[key] === true ? true : false;
                    }
                    else if (key === 'ad title') apiKey = 'ad title';
                    else if (key === 'buildingAge') apiKey = 'building age';
                    else if (key === 'deedType') apiKey = 'deed type';
                    
                    formDataToSend.append(apiKey, value);
                }
            }
        });

        // Add only actual files from imageFiles state
        let fileCount = 0;
        imageFiles.forEach((file, index) => {
            if (file && file instanceof File) {
                formDataToSend.append('images', file);
                console.log(`Added file ${index}:`, file.name, file.type, file.size);
                fileCount++;
            }
        });

        console.log(`Total files added: ${fileCount}`);

        if (fileCount === 0) {
            console.log('No files found in imageFiles, trying to convert from previews...');
            imagePreviews.forEach((preview, index) => {
                if (preview && preview.startsWith('data:')) {
                    const file = dataURLtoFile(preview, `image-${index}.jpg`);
                    if (file) {
                        formDataToSend.append('images', file);
                        console.log(`Converted and added file ${index}:`, file.name, file.type, file.size);
                        fileCount++;
                    }
                }
            });
            console.log(`Total files after conversion: ${fileCount}`);
        }

        console.log('Submitting FormData');
        
        await submitListing(formDataToSend);
    } catch (error) {
        console.error('Error submitting form:', error);
        notify('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.', 'error');
        setIsSubmitting(false);
        setHasSubmitted(false);
    }
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <p className={`text-sm mt-1 font-[Noor] ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>;
  };

  const getErrorClass = (fieldName) => {
    return errors[fieldName] ? (isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-500 bg-red-50') : '';
  };

  return (
    <Layout>
      <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} dir="rtl">
        {/* Title Bar */}
        <div className={`w-full border-t-2 border-yellow-300 shadow-md flex justify-center items-center py-3 sm:py-4 mb-4 sm:mb-8 ${isDarkMode ? 'bg-[#FFED00]' : 'bg-[#F6F9FE]'}`}>
          <span className={`flex items-center gap-2 text-base sm:text-lg font-medium ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>
            <span style={{ fontFamily: 'Cairo', fontWeight: 700 }}>مباني وأراضي</span>
            <img src={icon} alt="مباني وأراضي" className="w-10 h-10" />
          </span>
        </div>
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-3" data-field="images">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تحميل الصور</label>
              <div className="flex flex-col gap-4 items-start">
                {/* Add Image Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-multiple"
                  />
                  <label
                    htmlFor="image-upload-multiple"
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    <img 
                      src={addImageIcon} 
                      alt="إضافة صور" 
                      className="w-12 h-12 sm:w-16 sm:h-16" 
                    />
                  </label>
                </div>

                {/* Display Uploaded Images */}
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    preview && (
                      <div key={index} className="relative group">
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 ${
                          isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                        }`}>
                          <img 
                            src={preview} 
                            alt={`صورة ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
              <ErrorMessage error={errors.images} />
            </div>

            {/* نوع الأرض/المبنى */}
            <div className="space-y-3" data-field="propertyType">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>النوع</label>
              <div className="flex gap-8 flex-wrap">
                {propertyTypes.map(type => (
                  <label key={type} className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="propertyType" 
                      value={type} 
                      checked={formData.propertyType.includes(type)} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.propertyType.includes(type) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'border-gray-400 bg-gray-700' 
                          : 'border-black bg-white'
                    }`}>
                      {formData.propertyType.includes(type) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.propertyType} />
            </div>

            {/* 2. بيع/إيجار */}
            <div className="space-y-3" data-field="listingStatus">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>بيع/إيجار</label>
              <div className="flex gap-8">
                {listingStatusOptions.map(option => (
                  <label key={option} className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="listing status" 
                      value={option} 
                      checked={formData['listing status'].includes(option)} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData['listing status'].includes(option) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'border-gray-400 bg-gray-700' 
                          : 'border-black bg-white'
                    }`}>
                      {formData['listing status'].includes(option) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.listingStatus} />
            </div>

            {/* 3. داخل التنظيم/خارج التنظيم */}
            <div className="space-y-3" data-field="regulationStatus">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>داخل التنظيم/خارج التنظيم</label>
              <div className="flex gap-8">
                {regulationOptions.map(option => (
                  <label key={option} className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="regulationStatus" 
                      value={option} 
                      checked={formData.regulationStatus.includes(option)} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.regulationStatus.includes(option) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'border-gray-400 bg-gray-700' 
                          : 'border-black bg-white'
                    }`}>
                      {formData.regulationStatus.includes(option) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.regulationStatus} />
            </div>

            {/* 4. المساحة */}
            <div className="space-y-3" data-field="area">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المساحة (م²)</label>
              <input 
                type="number" 
                name="area" 
                value={formData.area} 
                onChange={handleInputChange} 
                className={getInputClass('area')} 
                placeholder="ادخل مساحة العقار" 
              />
              <ErrorMessage error={errors.area} />
            </div>

            {/* 4.5. عمر المبنى */}
            <div className="space-y-3" data-field="buildingAge">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عمر المبنى (اختياري)</label>
              <input 
                type="number" 
                name="buildingAge" 
                value={formData.buildingAge} 
                onChange={handleInputChange} 
                className={getInputClass('buildingAge')} 
                placeholder="ادخل عمر المبنى بالسنوات" 
                min="1"
                max="100"
              />
              <ErrorMessage error={errors.buildingAge} />
            </div>

         

            {/* 5. تم النشر من قبل */}
            <div className="space-y-3" data-field="publishedVia">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تم النشر من قبل</label>
              <div className="flex gap-8">
                {publishedViaOptions.map(option => (
                  <label key={option} className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <input 
                      type="checkbox" 
                      name="publishedVia" 
                      value={option} 
                      checked={formData.publishedVia.includes(option)} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.publishedVia.includes(option) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'border-gray-400 bg-gray-700' 
                          : 'border-black bg-white'
                    }`}>
                      {formData.publishedVia.includes(option) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.publishedVia} />
            </div>

            {/* 6. عنوان الإعلان */}
            <div className="space-y-3" data-field="title">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عنوان الاعلان</label>
              <input 
                type="text" 
                name="ad title" 
                value={formData['ad title']} 
                onChange={handleInputChange} 
                className={getInputClass('title')} 
                placeholder="ادخل عنوان الاعلان" 
              />
              <ErrorMessage error={errors.title} />
            </div>

            {/* 7. وصف الإعلان */}
            <div className="space-y-3" data-field="description">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>وصف الاعلان</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4} 
                className={`${getInputClass('description')} resize-none`} 
                placeholder="الوصف" 
              />
              <ErrorMessage error={errors.description} />
            </div>

            {/* 8. المحافظة */}
            <div className="space-y-3" data-field="city">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المحافظة</label>
              <button
                type="button"
                onClick={() => setIsCityOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex items-center justify-between transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600' 
                    : 'bg-[#F9FAFB] text-gray-900 border-gray-100 hover:border-gray-300'
                } ${getErrorClass('city')}`}
              >
                <span>{formData.city || 'اختر المحافظة'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.city} />
            </div>

            {/* 9. موقع العقار */}
            <div className="space-y-3" data-field="location">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>موقع العقار</label>
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex items-center justify-between transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600' 
                    : 'bg-[#F9FAFB] text-gray-900 border-gray-100 hover:border-gray-300'
                } ${getErrorClass('location')}`}
              >
                <div className="text-right">
                  {formData.location.address ? (
                    <div>
                      <div className={`text-sm truncate max-w-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formData.location.address}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                      </div>
                    </div>
                  ) : (
                    <span>اختر موقع العقار على الخريطة</span>
                  )}
                </div>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <ErrorMessage error={errors.location} />
            </div>

            {/* 10. العملة */}
            <div className="space-y-3" data-field="currency">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>العملة</label>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex items-center justify-between transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600' 
                    : 'bg-[#F9FAFB] text-gray-900 border-gray-100 hover:border-gray-300'
                } ${getErrorClass('currency')}`}
              >
                <span className="flex items-center gap-2">
                  {formData.currency && (
                    <span className="text-xl">
                      {currencyOptions.find(c => c.value === formData.currency)?.flag}
                    </span>
                  )}
                  <span>{currencyOptions.find(c => c.value === formData.currency)?.label || 'اختر العملة'}</span>
                </span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.currency} />
            </div>

            {/* 11. السعر */}
            <div className="space-y-3" data-field="price">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>السعر</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                className={getInputClass('price')} 
                placeholder="ادخل سعر العقار" 
              />
              <ErrorMessage error={errors.price} />
            </div>

            {/* 12. قابل للتفاوض */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>قابل للتفاوض</label>
              <label className={`flex items-center gap-3 cursor-pointer font-[Noor] font-normal ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <input 
                  type="checkbox" 
                  name="negotiable" 
                  checked={formData.negotiable} 
                  onChange={handleInputChange} 
                  className="hidden" 
                />
                <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                  formData.negotiable 
                    ? 'bg-yellow-400 border-yellow-400' 
                    : isDarkMode 
                      ? 'border-gray-400 bg-gray-700' 
                      : 'border-black bg-white'
                }`}>
                  {formData.negotiable && (
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span>قابل للتفاوض</span>
              </label>
            </div>
            {/* 13. طريقة الدفع */}
            <div className="space-y-3" data-field="paymentMethod">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة الدفع</label>
              <div className="flex gap-8">
                {paymentOptions.map(opt => (
                  <label key={opt} className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <input type="checkbox" name="paymentMethod" value={opt} checked={formData.paymentMethod.includes(opt)} onChange={handleInputChange} className="hidden" />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.paymentMethod.includes(opt) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'border-gray-400 bg-gray-700' 
                          : 'border-black bg-white'
                    }`}>
                      {formData.paymentMethod.includes(opt) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.paymentMethod} />
            </div>

      

       

            {/* 14. معلومات التواصل */}
            <div className="space-y-4 mb-24">
              <h2 className={`text-lg font-medium mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>معلومات التواصل</h2>
              
              <div className="space-y-3" data-field="name">
                <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الاسم</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className={getInputClass('name')} 
                  placeholder="ادخل الاسم" 
                />
                <ErrorMessage error={errors.name} />
              </div>
              
              <div className="space-y-3" data-field="phone">
                <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>رقم الهاتف المحمول</label>
                <div className={`phone-input-container w-[85%] ${isDarkMode ? 'dark-phone-input' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
                  <PhoneInput
                    international
                    defaultCountry="SY"
                    value={formData.phone}
                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                    className={`custom-phone-input ${isDarkMode ? 'dark-phone-input' : ''}`}
                    placeholder="أدخل رقم الموبايل"
                  />
                  <ErrorMessage error={errors.phone} />
                </div>
              </div>
              
              {/* طريقة التواصل */}
              <div className="space-y-3" data-field="contactMethod">
                <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة التواصل</label>
                <div className="flex gap-12">
                  {contactOptions.map(opt => (
                    <label key={opt} className={`flex flex-row-reverse items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      <input type="checkbox" name="contactMethod" value={opt} checked={formData.contactMethod.includes(opt)} onChange={handleInputChange} className="hidden" />
                      <span className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.contactMethod.includes(opt) 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : isDarkMode 
                            ? 'border-gray-400 bg-gray-700' 
                            : 'border-black bg-white'
                      }`}>
                        {formData.contactMethod.includes(opt) && (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        )}
                      </span>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage error={errors.contactMethod} />
              </div>
            </div>
            {/* Submit Button with Loading State */}
            <div className="flex justify-center my-12 sm:my-16 border-t border-gray-100 pt-12 sm:pt-18 pb-12 sm:pb-18">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full sm:w-[600px] py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 shadow-sm font-[Noor] font-normal
                  ${isDarkMode
                    ? isSubmitting 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60' 
                      : 'bg-black text-yellow-400 hover:bg-gray-900 active:bg-gray-900'
                    : isSubmitting 
                      ? 'bg-gray-400 text-gray-100 cursor-not-allowed opacity-60' 
                      : 'bg-black text-[#FFD700] hover:bg-gray-900 active:bg-gray-800'}`}
              >
                {isSubmitting ? 'جاري النشر...' : 'انشر الاعلان'}
              </button>
            </div>



            {/* City Modal */}
            <Dialog
              open={isCityOpen}
              onClose={() => setIsCityOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-right shadow-xl transition-all ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsCityOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                      اختر المحافظة
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {governorateOptions.map((governorate) => (
                      <button
                        key={governorate}
                        className={`p-4 rounded-xl text-lg font-medium text-center transition-all duration-200 ${
                          formData.city === governorate 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-900 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, city: governorate }));
                          setIsCityOpen(false);
                        }}
                      >
                        {governorate}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Currency Modal */}
            <Dialog
              open={isCurrencyOpen}
              onClose={() => setIsCurrencyOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-right shadow-xl transition-all ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsCurrencyOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                      اختر العملة
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {currencyOptions.map((currency) => (
                      <button
                        key={currency.value}
                        className={`p-4 rounded-2xl text-lg font-medium flex items-center justify-center gap-2 ${
                          formData.currency === currency.value
                            ? 'bg-yellow-400 text-black'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                              : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, currency: currency.value }));
                          setIsCurrencyOpen(false);
                        }}
                      >
                        <span>{currency.flag}</span>
                        <span>{currency.label}</span>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>



            {/* Map Modal */}
            <Dialog open={isMapOpen} onClose={() => setIsMapOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-4xl h-[80vh] transform overflow-hidden rounded-2xl shadow-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className={`flex items-center justify-between p-6 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <button
                      onClick={() => setIsMapOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="text-right">
                      <Dialog.Title className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                        اختر موقع العقار
                      </Dialog.Title>
                      <button
                        onClick={getCurrentLocation}
                        className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500"
                      >
                        تحديد موقعي الحالي
                      </button>
                    </div>
                  </div>
                  <div className="relative" style={{ height: 'calc(80vh - 80px)' }}>
                    

                    {/* Google Map */}
                    <LoadScript
                      googleMapsApiKey="AIzaSyC351-MkV6PRQOcdW4FrgZ6-3vKq84BQPA"
                      libraries={libraries}
                    >
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={markerPosition}
                        zoom={13}
                        onClick={onMapClick}
                        options={mapOptions}
                      >
                        <Marker
                          position={markerPosition}
                          draggable={true}
                          onDragEnd={onMarkerDragEnd}
                        />
                      </GoogleMap>
                    </LoadScript>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .map-container {
          height: calc(100% - 80px);
          width: 100%;
        }

        .leaflet-container {
          height: 100% !important;
          width: 100% !important;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #F1C40F;
        }

        .phone-input-container {
          position: relative;
          z-index: 1;
        }

        .custom-phone-input .PhoneInputInput {
          width: 100% !important;
          padding: 12px 20px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(0, 0, 0, 0.2) !important;
          background: #f8f9fa !important;
          color: black !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          font-family: 'Noor', sans-serif !important;
        }

        .custom-phone-input .PhoneInputInput::placeholder {
          color: black !important;
          opacity: 0.7 !important;
          font-family: 'Noor', sans-serif !important;
        }

        .custom-phone-input .PhoneInputCountry {
          background: transparent !important;
          border-radius: 9999px !important;
          padding: 6px 12px !important;
          border: 1px solid black !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          min-width: 90px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .custom-phone-input .PhoneInputCountry:hover {
          border-color: #facc15 !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .custom-phone-input .PhoneInputCountryIcon {
          width: 24px !important;
          height: 16px !important;
          border-radius: 2px !important;
          overflow: hidden !important;
        }

        .custom-phone-input .PhoneInputCountryIcon img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .custom-phone-input .PhoneInputCountrySelectArrow {
          color: black !important;
          opacity: 0.7 !important;
          margin-right: 8px !important;
        }

        .custom-phone-input .PhoneInputCountrySelect {
          position: absolute !important;
          inset: auto 0 auto 0 !important;
          width: 100% !important;
          padding: 8px !important;
          margin: 0 !important;
          border: none !important;
          background: white !important;
          cursor: pointer !important;
          direction: rtl !important;
          z-index: 5 !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .custom-phone-input select {
          direction: rtl !important;
        }

        .custom-phone-input select option {
          font-family: 'Noor', sans-serif !important;
          padding: 12px 16px !important;
          background: white !important;
          color: black !important;
          direction: rtl !important;
          transition: all 0.2s ease !important;
          border-radius: 8px !important;
          margin: 4px 0 !important;
        }

        .custom-phone-input select option:hover {
          background-color: #fef9c3 !important;
        }

        .custom-phone-input select option:checked {
          background-color: #fef08a !important;
          color: black !important;
        }

        .custom-phone-input .PhoneInputInput:hover {
          border-color: #facc15 !important;
          background: #fff !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
        }

        .custom-phone-input .PhoneInputInput:focus {
          outline: none !important;
          border-color: #facc15 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2) !important;
        }

        .phone-input-container .PhoneInput {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .phone-input-container .PhoneInputCountry {
          z-index: 2 !important;
        }

        /* تحسين شكل القائمة المنسدلة */
        .PhoneInputCountry select {
          position: absolute !important;
          top: calc(100% + 8px) !important;
          left: 0 !important;
          right: 0 !important;
          background: white !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          border-radius: 16px !important;
          margin-top: 4px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          padding: 8px !important;
        }

        .PhoneInputCountrySelect option {
          padding: 12px 16px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          border-radius: 8px !important;
          margin: 4px 0 !important;
          font-size: 14px !important;
        }

        .PhoneInputCountrySelect option:hover {
          background-color: #fef9c3 !important;
        }

        .PhoneInputCountrySelect option:checked {
          background-color: #fef08a !important;
          color: black !important;
        }

        /* تحسين شكل scrollbar */
        .PhoneInputCountry select::-webkit-scrollbar {
          width: 8px !important;
        }

        .PhoneInputCountry select::-webkit-scrollbar-track {
          background: #f1f1f1 !important;
          border-radius: 10px !important;
        }

        .PhoneInputCountry select::-webkit-scrollbar-thumb {
          background: #fbbf24 !important;
          border-radius: 10px !important;
          border: 2px solid #f1f1f1 !important;
        }

        .PhoneInputCountry select::-webkit-scrollbar-thumb:hover {
          background: #f59e0b !important;
        }

        /* Dark Mode Phone Input Styles */
        .dark-phone-input .PhoneInputInput {
          background: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          -webkit-text-fill-color: #FFD700 !important;
        }
        .dark-phone-input .PhoneInputInput:focus {
          background: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2) !important;
          -webkit-text-fill-color: #FFD700 !important;
        }
        .dark-phone-input .PhoneInputInput:hover {
          background: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          -webkit-text-fill-color: #FFD700 !important;
        }
        .dark-phone-input .PhoneInputInput:active {
          background: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          -webkit-text-fill-color: #FFD700 !important;
        }
        .dark-phone-input .PhoneInputInput::placeholder {
          color: #FFD700 !important;
          opacity: 0.7 !important;
        }
        .dark-phone-input .PhoneInputCountry {
          background: #1f2937 !important;
          border: 1px solid #FFD700 !important;
        }
        .dark-phone-input .PhoneInputCountry:hover {
          background: #1f2937 !important;
          border: 1px solid #FFD700 !important;
        }
        .dark-phone-input .PhoneInputCountrySelect {
          background: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
        }
        .dark-phone-input .PhoneInputCountrySelect option {
          background: #1f2937 !important;
          color: #FFD700 !important;
        }
        .dark-phone-input .PhoneInputCountrySelectArrow {
          color: #FFD700 !important;
        }

        .dark-phone-input .PhoneInputCountrySelect option:hover {
          background: #FFD700 !important;
          color: #111 !important;
        }

        .dark-phone-input .PhoneInputCountrySelect option:checked {
          background: #FFD700 !important;
          color: #111 !important;
        }

        .dark-phone-input .PhoneInputCountryIcon {
          filter: brightness(1.2) !important;
        }

        .dark-phone-input .PhoneInputCountryIcon img {
          opacity: 1 !important;
        }
        
        /* Override any conflicting styles */
        .dark-phone-input .PhoneInput {
          background: transparent !important;
        }
        
        /* Force dark mode styles */
        .phone-input-container.dark-phone-input .PhoneInputInput,
        .phone-input-container .dark-phone-input .PhoneInputInput {
          background: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          -webkit-text-fill-color: #FFD700 !important;
          z-index: 1 !important;
        }
        
        .phone-input-container.dark-phone-input .PhoneInputCountry,
        .phone-input-container .dark-phone-input .PhoneInputCountry {
          background: #1f2937 !important;
          border: 1px solid #FFD700 !important;
          z-index: 2 !important;
        }

        /* Ensure phone input doesn't conflict with map */
        .phone-input-container * {
          position: relative !important;
          z-index: auto !important;
        }
        
        .phone-input-container .PhoneInputCountrySelect {
          z-index: 5 !important;
        }

        /* Dark Mode Input Autocomplete Fix */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
          -webkit-text-fill-color: #FFD700 !important;
          background-color: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
        
        /* Additional dark mode input styling */
        .dark input[type="text"]:-webkit-autofill,
        .dark input[type="text"]:-webkit-autofill:hover,
        .dark input[type="text"]:-webkit-autofill:focus,
        .dark input[type="number"]:-webkit-autofill,
        .dark input[type="number"]:-webkit-autofill:hover,
        .dark input[type="number"]:-webkit-autofill:focus,
        .dark textarea:-webkit-autofill,
        .dark textarea:-webkit-autofill:hover,
        .dark textarea:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
          -webkit-text-fill-color: #FFD700 !important;
          background-color: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
        }
      `}</style>
    </Layout>
  );
};

export default AddBuildingsAndLands; 