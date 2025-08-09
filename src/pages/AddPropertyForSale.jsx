import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Layout from '../components/Layout';
import icon from "/images/cuida_building-outline (1).png";
import addImageIcon from "/images/Add Photo.svg";
import { CATEGORY_SELL_ID } from '../redux/Type';
import AddListingHook from '../Hook/listing/addListingHook';
import notify from '../Hook/useNotifaction';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const AddPropertyForSale = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    // Basic Property Info
    propertyType: '',
    regulationStatus: '',
    area: '',
    floor: '',
    numberOfBuildingFloors: '',
    numberOfRooms: '',
    numberOfLivingRooms: '',
    numberOfBathrooms: '',
    buildingAge: '',
    isFurnished: false,
    deedType: '',
    
    // Sale Information
    price: '',
    currency: 'ليرة',
    paymentMethod: [],
    deliveryConditions: [],
    propertyCondition: [],
    isNegotiable: false,

    // Location
    location: {
      address: '',
      lat: 33.5138,
      lng: 36.2765
    },
    governorate: '',

    // Additional Info
    "ad title": '',
    description: '',
    amenities: [],
    publishedBy: '',
    
    // Contact Info
    name: '',
    phone: '',
    contactMethod: [],

    // Category
    categoryId: CATEGORY_SELL_ID,
    category: CATEGORY_SELL_ID
  });

  // Store actual files and preview URLs separately
  const [imageFiles, setImageFiles] = useState(Array(8).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(8).fill(null));

  const [submitListing, response, loading, error, success] = AddListingHook()

  // Add state for validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Dropdown states
  const [isFloorOpen, setIsFloorOpen] = useState(false);
  const [isTotalFloorsOpen, setIsTotalFloorsOpen] = useState(false);
  const [isBuildingAgeOpen, setIsBuildingAgeOpen] = useState(false);
  const [isGovernorateOpen, setIsGovernorateOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 33.5138,
    lng: 36.2765
  });

  // Add this state for map loading


  // Options arrays
  const propertyTypes = [
    'شقة', 'فيلا', 'بناء', 'بيت عربي', 'بيت عربي قديم', 'محل', 'مستودع', 'مكتب', 'مصنع', 'مقهى'
  ];
  const regulationOptions = ['داخل التنظيم', 'خارج التنظيم'];
  const amenities = [
    'بلكونة', 'حديقة خاصة', 'أجهزة المطبخ', 'موقف خاص', 'غرفة خادمة', 'غاز مركزي', 'حمام سباحة', 'مصعد', 'تدفئة مركزية', 'تكييف مركزي'
  ];
  const currencyOptions = [
    { value: 'ليرة', label: 'ليرة سورية', flag: '🇸🇾' },
    { value: 'دولار', label: 'دولار أمريكي', flag: '🇺🇸' }
  ];
  const paymentOptions = ['كاش', 'تقسيط', 'كاش أو تقسيط'];
  const deliveryOptions = ['ماكسي بودن إكساء', 'نص إكساء', 'إكساء ديلاكس', 'تشطيب'];
  const propertyConditionOptions = ['جاهز', 'قيد الإنشاء'];
  const deedTypeOptions = ['طابو أخضر', 'طابو أحمر', 'عقد بيع', 'إيصال دفع'];
  const roomOptions = ['1', '2', '3', '4', '5', '6', '7'];
  const livingRoomOptions = ['1', '2', '3', '4'];
  const bathroomOptions = ['1', '2', '3', '4', '5', '6', '7'];
  const contactOptions = ['موبايل', 'شات', 'الاتنين'];
  const floorOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  const buildingAgeOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const publisherOptions = ['المالك', 'الوكيل'];
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

  const getButtonClass = (isSelected) => `flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 font-[Noor] font-normal text-sm sm:text-base transition-all duration-150 select-none cursor-pointer ${
    isSelected 
      ? 'bg-yellow-400 border-yellow-400 text-black' 
      : isDarkMode
        ? 'bg-gray-800 border-gray-600 text-gray-100 hover:border-gray-500'
        : 'bg-white border-black text-black'
  }`;



  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    updateFormData(lat, lng);
  };

  const handleMarkerDrag = (e) => {
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
      if (name === 'isFurnished' || name === 'isNegotiable') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (['amenities', 'contactMethod', 'paymentMethod', 'deliveryConditions', 'propertyCondition'].includes(name)) {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value] 
            : prev[name].filter(v => v !== value)
        }));
      } else if (name === 'propertyType') {
        setFormData(prev => ({
          ...prev,
          [name]: checked ? value : ''
        }));
      } else if (name === 'regulationStatus') {
        setFormData(prev => ({
          ...prev,
          [name]: checked ? value : ''
        }));
      } else if (name === 'publishedBy') {
        setFormData(prev => ({
          ...prev,
          [name]: checked ? value : ''
        }));
      }
    } else if (name === 'title') {
      setFormData(prev => ({ ...prev, 'ad title': value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Property Type
    if (!formData.propertyType) {
      newErrors.propertyType = 'يجب اختيار نوع العقار';
    }

    // Regulation Status
    if (!formData.regulationStatus) {
      newErrors.regulationStatus = 'يجب تحديد حالة التنظيم';
    }

    // Area
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'يجب إدخال مساحة صحيحة';
    }

    // Floor
    if (!formData.floor) {
      newErrors.floor = 'يجب تحديد الطابق';
    }

    // Number of Building Floors
    if (!formData.numberOfBuildingFloors) {
      newErrors.numberOfBuildingFloors = 'يجب تحديد عدد الطوابق';
    }

    // Rooms
    if (!formData.numberOfRooms) {
      newErrors.numberOfRooms = 'يجب تحديد عدد الغرف';
    }

    // Living Rooms
    if (!formData.numberOfLivingRooms) {
      newErrors.numberOfLivingRooms = 'يجب تحديد عدد الصالونات';
    }

    // Bathrooms
    if (!formData.numberOfBathrooms) {
      newErrors.numberOfBathrooms = 'يجب تحديد عدد الحمامات';
    }

    // Building Age
    if (!formData.buildingAge) {
      newErrors.buildingAge = 'يجب تحديد عمر المبنى';
    }

    // Images (at least 5)
    const validImages = imageFiles.filter(file => file !== null);
    if (validImages.length < 5) {
      newErrors.images = 'يجب إضافة 5 صور على الأقل';
    }

    // Price
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'يجب إدخال سعر صحيح';
    }

    // Currency
    if (!formData.currency) {
      newErrors.currency = 'يجب اختيار العملة';
    }

    // Payment Method
    if (formData.paymentMethod.length === 0) {
      newErrors.paymentMethod = 'يجب تحديد طريقة الدفع';
    }

    // Delivery Conditions
    if (formData.deliveryConditions.length === 0) {
      newErrors.deliveryConditions = 'يجب تحديد شروط التسليم';
    }

    // Property Condition
    if (formData.propertyCondition.length === 0) {
      newErrors.propertyCondition = 'يجب تحديد حالة العقار';
    }

    // Deed Type
    if (!formData.deedType) {
      newErrors.deedType = 'يجب تحديد نوع الطابو';
    }

    // Location
    if (!formData.location.address) {
      newErrors.location = 'يجب تحديد موقع العقار';
    }

    // Governorate
    if (!formData.governorate) {
      newErrors.governorate = 'يجب اختيار المحافظة';
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

  // Function to scroll to first error field
  const scrollToFirstError = (errors) => {
    const fieldOrder = [
      'propertyType',
      'regulationStatus', 
      'area',
      'floor',
      'numberOfBuildingFloors',
      'numberOfRooms',
      'numberOfLivingRooms',
      'numberOfBathrooms',
      'buildingAge',
      'images',
      'price',
      'currency',
      'paymentMethod',
      'deliveryConditions',
      'propertyCondition',
      'deedType',
      'location',
      'governorate',
      'title',
      'description',
      'name',
      'phone',
      'contactMethod'
    ];

    for (const fieldName of fieldOrder) {
      if (errors[fieldName]) {
        let element = document.querySelector(`[data-field="${fieldName}"]`);
        
        if (element) {
          console.log(`Scrolling to error field: ${fieldName}`);
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          element.style.transition = 'box-shadow 0.3s ease';
          element.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
          setTimeout(() => {
            element.style.boxShadow = '';
          }, 2000);
          
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
    console.log('Form validation errors:', formErrors);

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

        // Add sale or rent identifier
        formDataToSend.append('sale or rent', 'sale');

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
                    
                    formData[key].forEach(value => {
                        formDataToSend.append(apiKey, value);
                    });
                } else {
                    // Map field names to API expected names (exact match with Schema)
                    let apiKey = key;
                    let value = formData[key];
                    
                    if (key === 'numberOfBuildingFloors') apiKey = 'number of building floors';
                    else if (key === 'numberOfRooms') apiKey = 'number of rooms';
                    else if (key === 'numberOfLivingRooms') apiKey = 'number of livingRooms';
                    else if (key === 'numberOfBathrooms') apiKey = 'number of bathrooms';
                    else if (key === 'buildingAge') apiKey = 'year';
                    else if (key === 'isFurnished') {
                        apiKey = 'furnishing';
                        value = formData[key] === 'نعم' ? true : false;
                    }
                    else if (key === 'isNegotiable') {
                        apiKey = 'negotiable';
                        value = formData[key] === 'نعم' ? true : false;
                    }
                    else if (key === 'governorate') apiKey = 'city';
                    else if (key === 'publishedBy') apiKey = 'publishedVia';
                    else if (key === 'phone') apiKey = 'phone number';
                    else if (key === 'contactMethod') apiKey = 'contact method';
                    else if (key === 'paymentMethod') apiKey = 'payment method';
                    else if (key === 'deliveryConditions') apiKey = 'delivery conditions';
                    else if (key === 'propertyCondition') apiKey = 'property condition';
                    else if (key === 'propertyType') apiKey = 'property type';
                    else if (key === 'regulationStatus') apiKey = 'regulationStatus';
                    else if (key === 'deedType') apiKey = 'deedType';
                    else if (key === 'title') apiKey = 'ad title';
                    
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
    return <p className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-sm mt-1 font-[Noor]`}>{error}</p>;
  };

  const getErrorClass = (fieldName) => {
    return errors[fieldName] 
      ? isDarkMode 
        ? 'border-red-400 bg-red-900/20' 
        : 'border-red-500' 
      : '';
  };

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



  return (
    <Layout>
      <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} dir="rtl">
        {/* Title Bar */}
        <div className={`w-full border-t-2 border-yellow-300 shadow-md flex justify-center items-center py-3 sm:py-4 mb-4 sm:mb-8 ${isDarkMode ? 'bg-[#FFED00]' : 'bg-[#F6F9FE]'}`}>
          <span className={`flex items-center gap-2 text-base sm:text-lg font-medium ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>
            <span style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عقارات للبيع</span>
            <img src={icon} alt="عقار" className="w-10 h-10" />
          </span>
        </div>
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-3" data-field="images">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تحميل الصور</label>
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

            {/* Property Type */}
            <div className="space-y-3" data-field="propertyType">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>نوع العقار</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                {propertyTypes.map(type => (
                  <label key={type} className={`flex items-center gap-0.5 sm:gap-2 cursor-pointer font-[Noor] font-normal select-none text-xs sm:text-sm leading-tight ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input type="checkbox" name="propertyType" value={type} checked={formData.propertyType === type} onChange={handleInputChange} className="hidden" />
                    <span className={`w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.propertyType === type 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.propertyType === type && (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="line-clamp-1">{type}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.propertyType} />
            </div>

            {/* Regulation Status */}
            <div className="space-y-3" data-field="regulationStatus">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>داخل/خارج التنظيم</label>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-md">
                {regulationOptions.map(type => (
                  <label key={type} className={`flex items-center gap-0.5 cursor-pointer font-[Noor] font-normal select-none text-sm leading-tight ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input 
                      type="checkbox" 
                      name="regulationStatus" 
                      value={type} 
                      checked={formData.regulationStatus === type} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.regulationStatus === type 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.regulationStatus === type && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.regulationStatus} />
            </div>

            {/* Area */}
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

            {/* Floor */}
            <div className="space-y-3" data-field="floor">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الطابق</label>
                  <button
                    type="button"
                onClick={() => setIsFloorOpen(true)}
                className={`${getInputClass('floor').replace('focus:ring-1 focus:ring-yellow-400', '')} text-right flex justify-between items-center ${isDarkMode ? 'hover:border-gray-600' : 'hover:bg-gray-50'}`}
              >
                <span>{formData.floor ? `الطابق ${formData.floor}` : 'اختر الطابق'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                  </button>
              <ErrorMessage error={errors.floor} />
              </div>

            {/* Number of Building Floors */}
            <div className="space-y-3" data-field="numberOfBuildingFloors">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد طوابق المبنى</label>
              <button
                type="button"
                onClick={() => setIsTotalFloorsOpen(true)}
                className={`${getInputClass('numberOfBuildingFloors').replace('focus:ring-1 focus:ring-yellow-400', '')} text-right flex justify-between items-center ${isDarkMode ? 'hover:border-gray-600' : 'hover:bg-gray-50'}`}
              >
                <span>{formData.numberOfBuildingFloors ? formData.numberOfBuildingFloors : 'اختر عدد الطوابق'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.numberOfBuildingFloors} />
            </div>

            {/* Total Floors Selection Modal */}
            <Dialog
              open={isTotalFloorsOpen}
              onClose={() => setIsTotalFloorsOpen(false)}
              className="relative z-50"
              as="div"
            >
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
                aria-hidden="true"
              />
              
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel 
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setIsTotalFloorsOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title 
                      className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                      style={{ fontFamily: 'Cairo' }}
                    >
                      عدد الطوابق
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
                    {floorOptions.map((floor, index) => (
                      <button
                        key={floor}
                        className={`relative p-6 rounded-2xl text-lg font-medium transition-all duration-200 ${
                          formData.numberOfBuildingFloors === floor 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, numberOfBuildingFloors: floor }));
                          setIsTotalFloorsOpen(false);
                        }}
                      >
                        <span className={`absolute top-2 right-2 text-xs opacity-50 ${
                          formData.numberOfBuildingFloors === floor 
                            ? 'text-black' 
                            : isDarkMode 
                              ? 'text-gray-400'
                              : 'text-gray-500'
                        }`}>طوابق</span>
                        {floor}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Number of Rooms */}
            <div className="space-y-3" data-field="numberOfRooms">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الغرف</label>
              <div className="flex gap-3 flex-wrap">
                {roomOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer font-[Noor] font-normal text-base transition-all duration-150 select-none ${
                      formData.numberOfRooms === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-100' 
                          : 'bg-white border-black text-black'
                    }`}
                  >
                    <input type="radio" name="numberOfRooms" value={opt} checked={formData.numberOfRooms === opt} onChange={handleInputChange} className="hidden" />
                    {formData.numberOfRooms === opt && (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <span className="w-full text-center">{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.numberOfRooms} />
            </div>

            {/* Number of Living Rooms */}
            <div className="space-y-3" data-field="numberOfLivingRooms">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الصالونات</label>
              <div className="flex gap-3 flex-wrap">
                {livingRoomOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer font-[Noor] font-normal text-base transition-all duration-150 select-none ${
                      formData.numberOfLivingRooms === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-100' 
                          : 'bg-white border-black text-black'
                    }`}
                  >
                    <input type="radio" name="numberOfLivingRooms" value={opt} checked={formData.numberOfLivingRooms === opt} onChange={handleInputChange} className="hidden" />
                    {formData.numberOfLivingRooms === opt && (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <span className="w-full text-center">{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.numberOfLivingRooms} />
            </div>

            {/* Number of Bathrooms */}
            <div className="space-y-3" data-field="numberOfBathrooms">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الحمامات</label>
              <div className="flex gap-3 flex-wrap">
                {bathroomOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer font-[Noor] font-normal text-base transition-all duration-150 select-none ${
                      formData.numberOfBathrooms === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-100' 
                          : 'bg-white border-black text-black'
                    }`}
                  >
                    <input type="radio" name="numberOfBathrooms" value={opt} checked={formData.numberOfBathrooms === opt} onChange={handleInputChange} className="hidden" />
                    {formData.numberOfBathrooms === opt && (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <span className="w-full text-center">{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.numberOfBathrooms} />
            </div>

            {/* Building Age */}
            <div className="space-y-3" data-field="buildingAge">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عمر المبنى</label>
              <button
                type="button"
                onClick={() => setIsBuildingAgeOpen(true)}
                className={`${getInputClass('buildingAge').replace('focus:ring-1 focus:ring-yellow-400', '')} text-right flex justify-between items-center ${isDarkMode ? 'hover:border-gray-600' : 'hover:bg-gray-50'}`}
              >
                <span>{formData.buildingAge ? `${formData.buildingAge} سنة` : 'اختر عمر المبنى'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.buildingAge} />
            </div>

            {/* Building Age Modal */}
            <Dialog
              open={isBuildingAgeOpen}
              onClose={() => setIsBuildingAgeOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl shadow-xl transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setIsBuildingAgeOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                      عمر المبنى
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
                    {buildingAgeOptions.map((age) => (
                      <button
                        key={age}
                        className={`relative p-6 rounded-2xl text-lg font-medium transition-all duration-200 ${
                          formData.buildingAge === age 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, buildingAge: age }));
                          setIsBuildingAgeOpen(false);
                        }}
                      >
                        <span className={`absolute top-2 right-2 text-xs opacity-50 ${
                          formData.buildingAge === age 
                            ? 'text-black' 
                            : isDarkMode 
                              ? 'text-gray-400'
                              : 'text-gray-500'
                        }`}>سنة</span>
                        {age}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Amenities */}
            <div className="space-y-3" data-field="amenities">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الكماليات</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
                {amenities.map(am => (
                  <button
                    type="button"
                    key={am}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        amenities: prev.amenities.includes(am)
                          ? prev.amenities.filter(a => a !== am)
                          : [...prev.amenities, am]
                      }));
                    }}
                    className={`px-4 py-2 rounded-full border-2 font-[Noor] font-normal text-sm transition-all duration-150 select-none flex items-center justify-center gap-2 ${
                      formData.amenities.includes(am) 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-100' 
                          : 'bg-white border-black text-black'
                    }`}
                  >
                    {formData.amenities.includes(am) && (
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    {am}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnished */}
            <div className="space-y-3" data-field="isFurnished">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الفرش</label>
              <div className="flex gap-4">
                <label className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base transition-all duration-200 ${
                  formData.isFurnished === true 
                    ? 'bg-yellow-400 border-yellow-400 text-black' 
                    : isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 hover:border-gray-500' 
                      : 'bg-white border-black text-black hover:bg-gray-50'
                }`} style={{ borderRadius: '9999px', border: '2px solid', padding: '8px 32px', minWidth: 80, justifyContent: 'center' }}>
                  <input type="radio" name="isFurnished" value={true} checked={formData.isFurnished === true} onChange={(e) => setFormData(prev => ({ ...prev, isFurnished: true }))} className="hidden" />
                  <span>نعم</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base transition-all duration-200 ${
                  formData.isFurnished === false 
                    ? 'bg-yellow-400 border-yellow-400 text-black' 
                    : isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 hover:border-gray-500' 
                      : 'bg-white border-black text-black hover:bg-gray-50'
                }`} style={{ borderRadius: '9999px', border: '2px solid', padding: '8px 32px', minWidth: 80, justifyContent: 'center' }}>
                  <input type="radio" name="isFurnished" value={false} checked={formData.isFurnished === false} onChange={(e) => setFormData(prev => ({ ...prev, isFurnished: false }))} className="hidden" />
                  <span>لا</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3" data-field="price">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>السعر</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                className={getInputClass('price')} 
                placeholder="ادخل السعر" 
              />
              <ErrorMessage error={errors.price} />
            </div>

            {/* Currency */}
            <div className="space-y-3" data-field="currency">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>العملة</label>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(true)}
                className={`${getInputClass('currency').replace('focus:ring-1 focus:ring-yellow-400', '')} text-right flex justify-between items-center ${isDarkMode ? 'hover:border-gray-600' : 'hover:bg-gray-50'}`}
                aria-label="اختر العملة"
              >
                <span className="flex items-center gap-2">
                  {currencyOptions.find(opt => opt.value === formData.currency) ? (
                    <>
                      <span className="text-lg">{currencyOptions.find(opt => opt.value === formData.currency).flag}</span>
                      <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                        {currencyOptions.find(opt => opt.value === formData.currency).label}
                      </span>
                    </>
                  ) : (
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>اختر العملة</span>
                  )}
                </span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.currency} />
            </div>

            {/* Currency Selection Modal */}
            <Dialog
              open={isCurrencyOpen}
              onClose={() => setIsCurrencyOpen(false)}
              className="relative z-50"
              as="div"
            >
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
                aria-hidden="true"
              />
              
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel 
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setIsCurrencyOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title 
                      className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                      style={{ fontFamily: 'Cairo' }}
                    >
                      اختر العملة
                    </Dialog.Title>
                  </div>
                  <div className="space-y-3 p-4">
                    {currencyOptions.map((currency) => (
                      <button
                        key={currency.value}
                        className={`w-full p-4 rounded-xl text-lg font-medium text-right flex items-center justify-between transition-all duration-200 ${
                          formData.currency === currency.value 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, currency: currency.value }));
                          setIsCurrencyOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xl">{currency.flag}</span>
                          <span style={{ fontFamily: 'Cairo' }}>{currency.label}</span>
                        </span>
                        {formData.currency === currency.value && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Payment Method */}
            <div className="space-y-3" data-field="paymentMethod">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة الدفع</label>
              <div className="flex gap-6 flex-wrap">
                {paymentOptions.map(opt => (
                  <label key={opt} className={`flex flex-row-reverse items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input type="checkbox" name="paymentMethod" value={opt} checked={formData.paymentMethod.includes(opt)} onChange={handleInputChange} className="hidden" />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.paymentMethod.includes(opt) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.paymentMethod.includes(opt) && (
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.paymentMethod} />
            </div>

            {/* Delivery Conditions */}
            <div className="space-y-3" data-field="deliveryConditions">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>شروط التسليم</label>
              <div className="flex gap-6 flex-wrap">
                {deliveryOptions.map(opt => (
                  <label key={opt} className={`flex flex-row-reverse items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input type="checkbox" name="deliveryConditions" value={opt} checked={formData.deliveryConditions.includes(opt)} onChange={handleInputChange} className="hidden" />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.deliveryConditions.includes(opt) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.deliveryConditions.includes(opt) && (
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.deliveryConditions} />
            </div>

            {/* Property Condition */}
            <div className="space-y-3" data-field="propertyCondition">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>حالة العقار</label>
              <div className="flex gap-6 flex-wrap">
                {propertyConditionOptions.map(opt => (
                  <label key={opt} className={`flex flex-row-reverse items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input type="checkbox" name="propertyCondition" value={opt} checked={formData.propertyCondition.includes(opt)} onChange={handleInputChange} className="hidden" />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.propertyCondition.includes(opt) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.propertyCondition.includes(opt) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
            </div>
              <ErrorMessage error={errors.propertyCondition} />
            </div>

            {/* Deed Type */}
            <div className="space-y-3" data-field="deedType">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>نوع الطابو</label>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-lg">
                {deedTypeOptions.map(type => (
                  <label key={type} className={`flex items-center gap-0.5 cursor-pointer font-[Noor] font-normal select-none text-sm leading-tight ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input 
                      type="checkbox" 
                      name="deedType" 
                      value={type} 
                      checked={formData.deedType === type} 
                      onChange={(e) => setFormData(prev => ({ ...prev, deedType: e.target.checked ? type : '' }))} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.deedType === type 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.deedType === type && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.deedType} />
            </div>

            {/* Location */}
            <div className="space-y-3" data-field="location">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>موقع العقار</label>
              <div className="relative w-[85%]">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className={`w-full p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex items-center gap-3 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700' 
                      : 'bg-[#F9FAFB] border-gray-100 text-gray-900 hover:bg-gray-50'
                  } ${getErrorClass('location')}`}
                >
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className={`flex-grow text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formData.location.address || 'حدد موقع العقار على الخريطة'}
                  </span>
                </button>
            </div>
              <ErrorMessage error={errors.location} />
            </div>

            {/* Map Modal */}
            <Dialog
              open={isMapOpen}
              onClose={() => setIsMapOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-4xl h-[80vh] transform overflow-hidden rounded-2xl shadow-xl transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setIsMapOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  
                  <div className="relative" style={{ height: 'calc(80vh - 64px)' }}>
                    {/* Google Map */}
                    <LoadScript
                      googleMapsApiKey="AIzaSyC351-MkV6PRQOcdW4FrgZ6-3vKq84BQPA"
                      libraries={libraries}
                    >
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={markerPosition}
                        zoom={13}
                        onClick={handleMapClick}
                        options={mapOptions}
                      >
                        <Marker
                          position={markerPosition}
                          draggable={true}
                          onDragEnd={handleMarkerDrag}
                        />
                      </GoogleMap>
                    </LoadScript>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Governorate */}
            <div className="space-y-3" data-field="governorate">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المحافظة</label>
              <button
                type="button"
                onClick={() => setIsGovernorateOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex justify-between items-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700' 
                    : 'bg-[#F9FAFB] border-gray-100 text-gray-900 hover:bg-gray-50'
                } ${getErrorClass('governorate')}`}
              >
                <span>{formData.governorate || 'اختر المحافظة'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.governorate} />
            </div>

            {/* Title */}
            <div className="space-y-3" data-field="title">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عنوان الإعلان</label>
              <input 
                type="text" 
                name="title" 
                value={formData['ad title']} 
                onChange={handleInputChange} 
                className={getInputClass('title')} 
                placeholder="ادخل عنوان الإعلان" 
              />
              <ErrorMessage error={errors.title} />
            </div>

            {/* Description */}
            <div className="space-y-3" data-field="description">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>وصف الإعلان</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4} 
                className={`${getInputClass('description')} resize-none`} 
                placeholder="ادخل وصف الإعلان" 
              />
              <ErrorMessage error={errors.description} />
            </div>

            {/* Published By */}
            <div className="space-y-3" data-field="publishedBy">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تم النشر من قبل</label>
              <div className="flex gap-6 flex-wrap">
                {publisherOptions.map(opt => (
                  <label key={opt} className={`flex flex-row-reverse items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                    <input 
                      type="checkbox" 
                      name="publishedBy" 
                      value={opt} 
                      checked={formData.publishedBy === opt} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.publishedBy === opt 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.publishedBy === opt && (
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Negotiable */}
            <div className="space-y-3" data-field="isNegotiable">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>&nbsp;</label>
              <label className={`flex items-center gap-3 cursor-pointer font-[Noor] font-normal ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="isNegotiable" 
                    checked={formData.isNegotiable} 
                    onChange={handleInputChange} 
                    className="sr-only peer" 
                  />
                  <div className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                    formData.isNegotiable 
                      ? 'bg-yellow-400 border-yellow-400' 
                      : isDarkMode 
                        ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                        : 'bg-white border-black hover:border-gray-700'
                  }`}>
                    {formData.isNegotiable && (
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span>قابل للتفاوض</span>
              </label>
            </div>

            {/* Contact Info */}
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
              
              <div className="space-y-3" data-field="contactMethod">
                <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة التواصل</label>
                <div className="flex gap-12">
                  {contactOptions.map(opt => (
                    <label key={opt} className={`flex flex-row-reverse items-center gap-2 cursor-pointer font-[Noor] font-normal select-none text-base ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                      <input type="checkbox" name="contactMethod" value={opt} checked={formData.contactMethod.includes(opt)} onChange={handleInputChange} className="hidden" />
                      <span className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.contactMethod.includes(opt) 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : isDarkMode 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-white border-black'
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

            {/* Floor Selection Modal */}
            <Dialog
              open={isFloorOpen}
              onClose={() => setIsFloorOpen(false)}
              className="relative z-50"
              as="div"
            >
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
                aria-hidden="true"
              />
              
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel 
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-right shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsFloorOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-700 text-gray-100' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title 
                      className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} 
                      style={{ fontFamily: 'Cairo' }}
                    >
                      اختر الطابق
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {floorOptions.map((floor, index) => (
                      <button
                        key={floor}
                        className={`relative p-6 rounded-2xl text-lg font-medium ${
                          formData.floor === floor 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                              : 'bg-gray-50 hover:bg-yellow-50 text-gray-900'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, floor }));
                          setIsFloorOpen(false);
                        }}
                      >
                        <span className="absolute top-2 right-2 text-xs opacity-50">الطابق</span>
                        {floor}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Governorate Modal */}
            <Dialog
              open={isGovernorateOpen}
              onClose={() => setIsGovernorateOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl shadow-xl transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setIsGovernorateOpen(false)}
                      className={`rounded-full p-2 transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                      اختر المحافظة
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
                    {governorateOptions.map((gov) => (
                      <button
                        key={gov}
                        className={`p-4 rounded-xl text-lg font-medium transition-all duration-200 ${
                          formData.governorate === gov 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                              : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, governorate: gov }));
                          setIsGovernorateOpen(false);
                        }}
                      >
                        {gov}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Submit Button with Loading State */}
            <div className={`flex justify-center mt-24 mb-20 border-t pt-20 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-[600px] py-3.5 rounded-xl text-base font-medium transition-all duration-200 shadow-sm font-[Noor] font-normal ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-black text-[#FFD700] hover:bg-gray-900 active:bg-gray-800'
                }`}
              >
                {isSubmitting ? 'جاري النشر...' : 'انشر الاعلان'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style jsx global>{`
        .leaflet-container {
          height: 100% !important;
          width: 100% !important;
          font-family: 'Noor', sans-serif;
          z-index: 1;
        }

        .leaflet-popup-content {
          text-align: right;
          direction: rtl;
        }

        .leaflet-control {
          z-index: 1000 !important;
        }

        .leaflet-control button {
          cursor: pointer;
          transition: all 0.2s;
        }

        .leaflet-control button:hover {
          background-color: #f3f4f6;
        }

        .leaflet-touch .leaflet-control-layers,
        .leaflet-touch .leaflet-bar {
          border: none;
          box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        }

        .leaflet-tile-container {
          filter: contrast(1.1) saturate(1.1);
        }

        .leaflet-control-zoom {
          margin: 15px !important;
        }

        .leaflet-control-zoom a {
          width: 30px !important;
          height: 30px !important;
          line-height: 30px !important;
          border-radius: 8px !important;
          background-color: white !important;
          color: #374151 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 18px !important;
        }

        .leaflet-control-zoom a:hover {
          background-color: #f3f4f6 !important;
        }

        .error-field {
          border-color: rgb(239 68 68) !important;
          background-color: rgb(254 242 242) !important;
        }
        
        .error-field:focus {
          ring-color: rgb(239 68 68) !important;
          border-color: rgb(239 68 68) !important;
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: scale(0.98) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FFC700;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #FFD700 #f1f1f1;
        }

        select {
          scrollbar-width: thin;
          scrollbar-color: #FFD700 #f1f1f1;
        }
        
        select::-webkit-scrollbar {
          width: 8px;
        }
        
        select::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
          margin: 4px;
        }
        
        select::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }
        
        select::-webkit-scrollbar-thumb:hover {
          background: #FFC700;
        }

        .phone-input-container {
          position: relative;
          z-index: 1;
        }

        .custom-phone-input .PhoneInputInput {
          width: 100% !important;
          padding: 14px 16px !important;
          border-radius: 16px !important;
          border: 1px solid #e5e7eb !important;
          background: #F9FAFB !important;
          color: black !important;
          font-size: 16px !important;
          transition: all 0.2s ease !important;
          font-family: 'Noor', sans-serif !important;
        }

        .custom-phone-input .PhoneInputInput:hover {
          border-color: #d1d5db !important;
        }

        .custom-phone-input .PhoneInputInput::placeholder {
          color: black !important;
          opacity: 0.7 !important;
          font-family: 'Noor', sans-serif !important;
        }

        .custom-phone-input .PhoneInputCountry {
          background: #F9FAFB !important;
          border-radius: 16px !important;
          padding: 14px 12px !important;
          border: 1px solid #e5e7eb !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          min-width: 90px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .custom-phone-input .PhoneInputCountry:hover {
          border-color: #d1d5db !important;
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
          z-index: 100 !important;
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

        .custom-phone-input .PhoneInputInput {
          width: 100% !important;
          padding: 14px 16px !important;
          border-radius: 16px !important;
          border: 1px solid #e5e7eb !important;
          background: #F9FAFB !important;
          color: black !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          font-family: 'Noor', sans-serif !important;
        }

        .custom-phone-input .PhoneInputInput:hover {
          border-color: #d1d5db !important;
        }

        .custom-phone-input .PhoneInputInput:focus {
          outline: none !important;
          border-color: #d1d5db !important;
          box-shadow: none !important;
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

        /* Dark mode styles for PhoneInput */
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
        .dark-phone-input .PhoneInputCountrySelectArrow {
          color: #FFD700 !important;
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

        /* Autofill styles for dark mode */
        .dark-phone-input .PhoneInputInput:-webkit-autofill,
        .dark-phone-input .PhoneInputInput:-webkit-autofill:hover,
        .dark-phone-input .PhoneInputInput:-webkit-autofill:focus,
        .dark-phone-input .PhoneInputInput:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgb(31 41 55) inset !important;
          -webkit-text-fill-color: rgb(243 244 246) !important;
          border-color: rgb(75 85 99) !important;
          background: rgb(31 41 55) !important;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s;
          -webkit-text-fill-color: ${isDarkMode ? 'rgb(243 244 246) !important' : 'rgb(17 24 39) !important'};
          -webkit-box-shadow: 0 0 0 30px ${isDarkMode ? 'rgb(31 41 55)' : 'rgb(249 250 251)'} inset !important;
        }

        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s;
          -webkit-text-fill-color: ${isDarkMode ? 'rgb(243 244 246) !important' : 'rgb(17 24 39) !important'};
          -webkit-box-shadow: 0 0 0 30px ${isDarkMode ? 'rgb(31 41 55)' : 'rgb(249 250 251)'} inset !important;
        }

        /* Dark mode checkbox styling */
        .dark-mode-checkbox {
          accent-color: #fbbf24 !important;
          background-color: rgb(31 41 55) !important;
          border-color: rgb(75 85 99) !important;
        }
      `}</style>
      <script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC351-MkV6PRQOcdW4FrgZ6-3vKq84BQPA&libraries=places&language=ar&region=SY&callback=Function.prototype`}
      />
    </Layout>
  );
};

export default AddPropertyForSale; 