import { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Layout from '../components/Layout';
import icon from "/images/cuida_building-outline (1).png"
import addImageIcon from "/images/Add Photo.svg"
import { CATEGORY_RENT_ID } from '../redux/Type';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'country-flag-icons/react/3x2';
import AddListingHook from '../Hook/listing/addListingHook';
import notify from '../Hook/useNotifaction';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';



 




const AddPropertyForRent = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    // Basic Property Info
    propertyType: '', // Changed from array to string
    regulationStatus: '', // Changed from array to string
    area: '',
    floor: '',
    numberOfBuildingFloors: '',
    numberOfRooms: '',
    numberOfLivingRooms: '',
    numberOfBathrooms: '',
    buildingAge: '',
    isFurnished: false,
    deedType: '',
    
    // Rental Information
    rentalRate: [],
    rentalFees: '',
    currency: 'ليرة',
    securityDeposit: '',
    isNegotiable: false,

    // Location
    location: {
      address: '',
      lat: 33.5138,
      lng: 36.2765
    },
    governorate: '',

    // Additional Info
    "ad title": '', // Changed from title to ad title
    description: '',
    amenities: [],
    publishedBy: '',
    
    // Contact Info
    name: '',
    phone: '',
    contactMethod: [],

    // Category
    categoryId: CATEGORY_RENT_ID,
    category: CATEGORY_RENT_ID // Added category field
  });

  // Store actual files and preview URLs separately
  const [imageFiles, setImageFiles] = useState(Array(8).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(8).fill(null));

  const [submitListing, response, loading, error, success] = AddListingHook()

  // Add state for validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Handle success state from the hook
  useEffect(() => {
    // Only handle success if we have submitted the form
    if (success && hasSubmitted) {
      console.log('Success received - listing submitted successfully');
      notify('تم طلب الإعلان بنجاح', 'success');
      
      // Reset form
      setFormData({
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
        rentalRate: [],
        rentalFees: '',
        currency: 'ليرة',
        securityDeposit: '',
        isNegotiable: false,
        
        // Location
        location: {
          address: '',
          lat: 33.5138,
          lng: 36.2765
        },
        governorate: '',
        'ad title': '',
        description: '',
        amenities: [],
        publishedBy: '',
        name: '',
        phone: '',
        contactMethod: [],
        categoryId: CATEGORY_RENT_ID,
        category: CATEGORY_RENT_ID
      });
      setImageFiles(Array(8).fill(null));
      setImagePreviews(Array(8).fill(null));
      setIsSubmitting(false);
      setHasSubmitted(false); // Reset the flag
      
      // Navigate to home page after successful submission
      setTimeout(() => {
        navigate('/');
      }, 2000); // Wait 2 seconds to show the toast message
    }
  }, [success, hasSubmitted, navigate]);

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
  
  // Phone input key for re-rendering
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  // Callback for phone input change
  const handlePhoneChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  }, []);

  // Memoized phone input to prevent unnecessary re-renders
  const phoneInputComponent = useMemo(() => (
    <PhoneInput
      key={phoneInputKey}
      international
      defaultCountry="SY"
      value={formData.phone}
      onChange={handlePhoneChange}
      className={`custom-phone-input ${isDarkMode ? 'dark-phone-input' : ''}`}
      placeholder="أدخل رقم الموبايل"
    />
  ), [phoneInputKey, formData.phone, isDarkMode, handlePhoneChange]);

  // Handle loading state
  useEffect(() => {
    setIsSubmitting(loading);
  }, [loading]);

  // Handle error state
  useEffect(() => {
    // Only handle error if we have submitted the form
    if (error && hasSubmitted) {
      notify(error, 'error');
      setIsSubmitting(false);
      setHasSubmitted(false); // Reset the flag
    }
  }, [error, hasSubmitted]);

  const propertyTypes = [
    'شقة', 'فيلا', 'بناء', 'بيت عربي', 'بيت عربي قديم', 'محل', 'مستودع', 'مكتب', 'مصنع', 'مقهى'
  ];
  const regulationOptions = ['داخل التنظيم', 'خارج التنظيم'];
  const amenities = [
    'بلكونة', 'حديقة خاصة', 'أجهزة المطبخ', 'موقف خاص', 'غرفة خادمة', 'غاز مركزي', 'حمام سباحة', 'مصعد', 'تدفئة مركزية', 'تكييف مركزي'
  ];
  const rentPeriods = ['يومي', 'اسبوعي', 'شهري'];
  const currencyOptions = [
    { value: 'ليرة', label: 'ليرة سورية', flag: '🇸🇾' },
    { value: 'دولار', label: 'دولار أمريكي', flag: '🇺🇸' }
  ];
  const roomOptions = ['1', '2', '3', '4', '5', '6', '7'];
  const livingRoomOptions = ['1', '2', '3', '4'];
  const bathroomOptions = ['1', '2', '3', '4', '5', '6', '7'];
  const contactOptions = ['موبايل', 'شات', 'الاتنين'];
  const floorOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  const buildingAgeOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const furnishedOptions = ['نعم', 'لا'];
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
      } else if (['amenities', 'contactMethod', 'rentalRate'].includes(name)) {
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
      // Handle the title field specially
      setFormData(prev => ({ ...prev, 'ad title': value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Function to scroll to first error field
  const scrollToFirstError = (errors) => {
    // Define the order of fields as they appear in the form
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
      'rentalRate',
      'currency',
      'rentalFees',
      'securityDeposit',
      'governorate',
      'location',
      'title',
      'description',
      'name',
      'phone',
      'contactMethod'
    ];

    // Find the first field with an error
    for (const fieldName of fieldOrder) {
      if (errors[fieldName]) {
        // Try to find the field element by various possible selectors
        let element = document.querySelector(`[name="${fieldName}"]`) ||
                     document.querySelector(`#${fieldName}`) ||
                     document.querySelector(`[data-field="${fieldName}"]`) ||
                     document.querySelector(`.field-${fieldName}`) ||
                     document.querySelector(`input[placeholder*="${fieldName}"]`);
        
        // Special cases for complex fields
        if (!element) {
          switch (fieldName) {
            case 'propertyType':
              element = document.querySelector('[data-field="propertyType"]') || 
                       document.querySelector('button[aria-label*="نوع العقار"]');
              break;
            case 'regulationStatus':
              element = document.querySelector('[data-field="regulationStatus"]') ||
                       document.querySelector('button[aria-label*="حالة التنظيم"]');
              break;
            case 'images':
              element = document.querySelector('.image-upload-section') ||
                       document.querySelector('[data-field="images"]');
              break;
            case 'rentalRate':
              element = document.querySelector('[data-field="rentalRate"]') ||
                       document.querySelector('.rental-rate-section');
              break;
            case 'currency':
              element = document.querySelector('[data-field="currency"]') ||
                       document.querySelector('button[aria-label*="العملة"]');
              break;
            case 'location':
              element = document.querySelector('[data-field="location"]') ||
                       document.querySelector('.location-section');
              break;
            case 'governorate':
              element = document.querySelector('[data-field="governorate"]') ||
                       document.querySelector('button[aria-label*="المحافظة"]');
              break;
            case 'contactMethod':
              element = document.querySelector('[data-field="contactMethod"]') ||
                       document.querySelector('.contact-method-section');
              break;
            case 'title':
              element = document.querySelector('input[name="title"]') ||
                       document.querySelector('input[placeholder*="عنوان"]');
              break;
            default:
              // Try to find by label text
              const labels = document.querySelectorAll('label');
              for (const label of labels) {
                if (label.textContent.includes(fieldName) || 
                    label.htmlFor === fieldName) {
                  element = label.closest('.form-field') || 
                           document.querySelector(`#${label.htmlFor}`) ||
                           label.nextElementSibling;
                  break;
                }
              }
          }
        }

        if (element) {
          console.log(`Scrolling to error field: ${fieldName}`);
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          // Add focus to the element if it's focusable
          if (element.focus && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
            setTimeout(() => element.focus(), 500);
          }
          
          // Add a temporary highlight effect
          element.style.transition = 'box-shadow 0.3s ease';
          element.style.boxShadow = isDarkMode ? '0 0 10px rgba(248, 113, 113, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)';
          setTimeout(() => {
            element.style.boxShadow = '';
          }, 2000);
          
          break;
        }
      }
    }
  };

  // Map functions
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

    // Category validation
    if (!formData.category) {
      newErrors.category = 'يجب تحديد الفئة';
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

    // Rental Rate
    if (formData.rentalRate.length === 0) {
      newErrors.rentalRate = 'يجب تحديد معدل الإيجار';
    }

    // Currency
    if (!formData.currency) {
      newErrors.currency = 'يجب اختيار العملة';
    }

    // Rental Fees
    if (!formData.rentalFees || formData.rentalFees <= 0) {
      newErrors.rentalFees = 'يجب إدخال رسوم الإيجار';
    }

    // Security Deposit
    if (!formData.securityDeposit || formData.securityDeposit < 0) {
      newErrors.securityDeposit = 'يجب إدخال مبلغ التأمين';
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

  // Add the dataURLtoFile function
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
    setHasSubmitted(true); // Set the flag when we start submission

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);
    console.log('Form validation errors:', formErrors);

    // If there are errors, scroll to the first error
    if (Object.keys(formErrors).length > 0) {
        console.log('Form has validation errors, stopping submission');
        setIsSubmitting(false);
        setHasSubmitted(false); // Reset the flag if validation fails
        
        // Scroll to the first error field
        scrollToFirstError(formErrors);
        
        // Show error notification
        notify('يرجى تعبئة جميع الحقول المطلوبة', 'error');
        
        return;
    }

    console.log('Form validation passed, proceeding with submission');

    try {
        // Debug: Check imageFiles state
        console.log('imageFiles state:', imageFiles);
        console.log('imagePreviews state:', imagePreviews);
        
        // Create FormData object
        const formDataToSend = new FormData();

        // Add sale or rent identifier
        formDataToSend.append('sale or rent', 'rent');

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
                    else if (key === 'propertyType') apiKey = 'property type';
                    else if (key === 'rentalRate') apiKey = 'rental rate';
                    else if (key === 'rentalFees') apiKey = 'rental fees';
                    else if (key === 'securityDeposit') apiKey = 'security deposit';
                    else if (key === 'regulationStatus') apiKey = 'regulationStatus';
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
                console.log(`Adding file ${index}:`, file.name, file.type, file.size);
                fileCount++;
            }
        });
        
        console.log(`Total files being sent: ${fileCount}`);
        
        // If no files found, try to convert from previews
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

        // Submit the form data
        console.log('Submitting FormData with entries:');
        for (let [key, value] of formDataToSend.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        
        await submitListing(formDataToSend);
    } catch (error) {
        console.error('Error submitting form:', error);
        notify('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.', 'error');
        setIsSubmitting(false);
        setHasSubmitted(false); // Reset the flag on error
    }
};

  // Helper component for error message
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <p className={`text-red-500 text-sm mt-1 font-[Noor] ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
    );
  };

  // Helper function to get error class
  const getErrorClass = (fieldName) => {
    return errors[fieldName] ? (isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-500 bg-red-50') : '';
  };

  // Map styles and options
  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  };

  const libraries = ['places'];

  return (
    <Layout>
      <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} dir="rtl">
        {/* Title Bar */}
        <div className={`w-full border-t-2 border-yellow-300 shadow-md flex justify-center items-center py-3 sm:py-4 mb-4 sm:mb-8 ${isDarkMode ? 'bg-[#FFED00]' : 'bg-[#F6F9FE]'}`}>
          <span className={`flex items-center gap-2 text-base sm:text-lg font-medium ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>
            <span style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عقارات للإيجار</span>
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
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>النوع العقار</label>
              <div className="grid grid-cols-5 gap-x-8 gap-y-4 max-w-2xl">
                {propertyTypes.map(type => (
                  <label key={type} className="flex items-center gap-0.5 cursor-pointer font-[Noor] font-normal select-none text-sm leading-tight">
                    <input type="checkbox" name="propertyType" value={type} checked={formData.propertyType.includes(type)} onChange={handleInputChange} className="hidden" />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.propertyType.includes(type) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-black bg-white'
                    }`}>
                      {formData.propertyType.includes(type) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{type}</span>
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
                  <label key={type} className="flex items-center gap-0.5 cursor-pointer font-[Noor] font-normal select-none text-sm leading-tight">
                    <input 
                      type="checkbox" 
                      name="regulationStatus" 
                      value={type} 
                      checked={formData.regulationStatus.includes(type)} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.regulationStatus.includes(type) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-black bg-white'
                    }`}>
                      {formData.regulationStatus.includes(type) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{type}</span>
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
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal ${getErrorClass('area')} ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 placeholder-gray-500'
                }`} 
                placeholder="ادخل مساحة العقار" 
              />
              <ErrorMessage error={errors.area} />
            </div>
            {/* Floor Number */}
            <div className="space-y-3 relative" data-field="floor">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الطابق</label>
              <button
                type="button"
                onClick={() => setIsFloorOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex justify-between items-center ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{formData.floor ? `الطابق ${formData.floor}` : 'اختر الطابق'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {/* Total Floors */}
            <div className="space-y-3 relative">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الطوابق</label>
              <button
                type="button"
                onClick={() => setIsTotalFloorsOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex justify-between items-center ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{formData.numberOfBuildingFloors ? formData.numberOfBuildingFloors : 'اختر عدد الطوابق'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
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
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsFloorOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
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
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                            : 'bg-gray-50 hover:bg-yellow-50'
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
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsTotalFloorsOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
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
                  <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {floorOptions.map((floor, index) => (
                      <button
                        key={floor}
                        className={`relative p-6 rounded-2xl text-lg font-medium ${
                          formData.numberOfBuildingFloors === floor 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                            : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, numberOfBuildingFloors: floor }));
                          setIsTotalFloorsOpen(false);
                        }}
                      >
                        <span className="absolute top-2 right-2 text-xs opacity-50">طوابق</span>
                        {floor}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
            {/* Rooms */}
            <div className="space-y-3" data-field="numberOfRooms">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الغرف</label>
              <div className="flex gap-3 flex-wrap">
                {roomOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer font-[Noor] font-normal text-base ${
                      formData.numberOfRooms === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800 text-gray-100'
                        : 'border-black bg-white text-black'
                    }`}
                  >
                    <input type="radio" name="numberOfRooms" value={opt} checked={formData.numberOfRooms === opt} onChange={handleInputChange} className="hidden" />
                    <span className="w-full text-center">{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.numberOfRooms} />
            </div>
            {/* Living Rooms */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الصالونات</label>
              <div className="flex gap-3 flex-wrap">
                {livingRoomOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer font-[Noor] font-normal text-base ${
                      formData.numberOfLivingRooms === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800 text-gray-100'
                        : 'border-black bg-white text-black'
                    }`}
                  >
                    <input type="radio" name="numberOfLivingRooms" value={opt} checked={formData.numberOfLivingRooms === opt} onChange={handleInputChange} className="hidden" />
                    <span className="w-full text-center">{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.numberOfLivingRooms} />
            </div>
            {/* Bathrooms */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الحمامات</label>
              <div className="flex gap-3 flex-wrap">
                {bathroomOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer font-[Noor] font-normal text-base ${
                      formData.numberOfBathrooms === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800 text-gray-100'
                        : 'border-black bg-white text-black'
                    }`}
                  >
                    <input type="radio" name="numberOfBathrooms" value={opt} checked={formData.numberOfBathrooms === opt} onChange={handleInputChange} className="hidden" />
                    <span className="w-full text-center">{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.numberOfBathrooms} />
            </div>
            {/* Building Age */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عمر المبنى</label>
              <button
                type="button"
                onClick={() => setIsBuildingAgeOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex justify-between items-center ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{formData.buildingAge ? `${formData.buildingAge} سنة` : 'اختر عمر المبنى'}</span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {/* Building Age Modal */}
            <Dialog
              open={isBuildingAgeOpen}
              onClose={() => setIsBuildingAgeOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsBuildingAgeOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                      عمر المبنى
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {buildingAgeOptions.map((age) => (
                      <button
                        key={age}
                        className={`relative p-6 rounded-2xl text-lg font-medium ${
                          formData.buildingAge === age 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                            : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, buildingAge: age }));
                          setIsBuildingAgeOpen(false);
                        }}
                      >
                        <span className="absolute top-2 right-2 text-xs opacity-50">سنة</span>
                        {age}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
            {/* Furnished */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الفرش</label>
              <div className="flex gap-6">
                {furnishedOptions.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 cursor-pointer font-[Noor] font-normal text-base ${
                      formData.isFurnished === opt 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700'
                        : 'border-black bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="isFurnished" 
                      value={opt} 
                      checked={formData.isFurnished === opt} 
                      onChange={handleInputChange} 
                      className="hidden" 
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Published By */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تم النشر من قبل</label>
              <div className="flex gap-6">
                {publisherOptions.map(opt => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer font-[Noor] font-normal select-none"
                  >
                    <div className={`w-6 h-6 flex items-center justify-center border-2 rounded ${
                      formData.publishedBy.includes(opt) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-black'
                    }`}>
                      {formData.publishedBy.includes(opt) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      name="publishedBy"
                      value={opt}
                      checked={formData.publishedBy.includes(opt)}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={`text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Amenities */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الكماليات</label>
              <div className="grid grid-cols-4 gap-4 max-w-2xl">
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
                    className={`px-6 py-2 rounded-full border-2 font-[Noor] font-normal text-base transition-all duration-150 select-none flex items-center justify-center gap-2 ${
                      formData.amenities.includes(am) 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-800 text-gray-100'
                        : 'border-black bg-white text-black'
                    }`}
                  >
                    {formData.amenities.includes(am) && (
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{am}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Title */}
            <div className="space-y-3" data-field="title">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عنوان الاعلان</label>
              <input 
                type="text" 
                name="title" 
                value={formData['ad title']} 
                onChange={handleInputChange} 
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal ${getErrorClass('title')} ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 placeholder-gray-500'
                }`} 
                placeholder="ادخل عنوان الاعلان" 
              />
              <ErrorMessage error={errors.title} />
            </div>
            {/* Description */}
            <div className="space-y-3" data-field="description">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>وصف الاعلان</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4} 
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal resize-none ${getErrorClass('description')} ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 placeholder-gray-500'
                }`} 
                placeholder="الوصف" 
              />
              <ErrorMessage error={errors.description} />
            </div>

            {/* Governorate */}
            <div className="space-y-3" data-field="governorate">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المحافظة</label>
              <div className="relative w-[85%]">
                <button
                  type="button"
                  onClick={() => setIsGovernorateOpen(true)}
                  className={`w-full p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex items-center gap-3 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700' 
                      : 'border-gray-100 bg-[#F9FAFB] text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="flex-grow text-right">
                    {formData.governorate || 'اختر المحافظة'}
                  </span>
                </button>
              </div>
              <ErrorMessage error={errors.governorate} />
            </div>

            {/* Governorate Modal */}
            <Dialog
              open={isGovernorateOpen}
              onClose={() => setIsGovernorateOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsGovernorateOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo' }}>
                      اختر المحافظة
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {governorateOptions.map((gov) => (
                      <button
                        key={gov}
                        className={`p-4 rounded-xl text-lg font-medium ${
                          formData.governorate === gov 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                            : 'bg-gray-50 hover:bg-yellow-50'
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
            {/* Rent Period */}
            <div className="space-y-3" data-field="rentalRate">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>معدل الإيجار</label>
              <div className="flex gap-8">
                {rentPeriods.map(opt => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer font-[Noor] font-normal select-none"
                  >
                    <div 
                      className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.rentalRate.includes(opt) 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : isDarkMode
                          ? 'border-gray-600 bg-gray-800'
                          : 'border-black bg-white'
                      }`}
                    >
                      {formData.rentalRate.includes(opt) && (
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      name="rentalRate"
                      value={opt}
                      checked={formData.rentalRate.includes(opt)}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          rentalRate: checked 
                            ? [...prev.rentalRate, value]
                            : prev.rentalRate.filter(v => v !== value)
                        }));
                      }}
                      className="hidden"
                    />
                    <span className={`text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{opt}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.rentalRate} />
            </div>
            {/* Currency */}
            <div className="space-y-3" data-field="currency">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>العملة</label>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(true)}
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right flex justify-between items-center ${getErrorClass('currency')} ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 hover:bg-gray-50'
                }`}
                aria-label="اختر العملة"
              >
                <span className="flex items-center gap-2">
                  {currencyOptions.find(opt => opt.value === formData.currency) ? (
                    <>
                      <span className="text-lg">{currencyOptions.find(opt => opt.value === formData.currency).flag}</span>
                      <span>{currencyOptions.find(opt => opt.value === formData.currency).label}</span>
                    </>
                  ) : (
                    'اختر العملة'
                  )}
                </span>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsCurrencyOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
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
                  <div className="space-y-3">
                    {currencyOptions.map((currency) => (
                      <button
                        key={currency.value}
                        className={`w-full p-4 rounded-xl text-lg font-medium text-right flex items-center justify-between transition-all duration-200 ${
                          formData.currency === currency.value 
                            ? 'bg-yellow-400 text-black' 
                            : isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                            : 'bg-gray-50 hover:bg-yellow-50'
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
            {/* Rent Amount */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>رسوم الإيجار</label>
              <div className="relative w-[85%]">
                <input 
                  type="number" 
                  name="rentalFees" 
                  value={formData.rentalFees} 
                  onChange={handleInputChange} 
                  className={`w-full p-3.5 border rounded-2xl text-base font-[Noor] font-normal text-right ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-100 bg-[#F9FAFB] text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="ادخل رسوم الإيجار"
                  min="0"
                  step="1"
                />
              </div>
              <ErrorMessage error={errors.rentalFees} />
            </div>
            {/* Negotiable */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>&nbsp;</label>
              <label className="flex items-center gap-3 cursor-pointer font-[Noor] font-normal">
                <div className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                  formData.isNegotiable 
                    ? 'bg-yellow-400 border-yellow-400' 
                    : isDarkMode
                    ? 'border-gray-600 bg-gray-800'
                    : 'border-black bg-white'
                }`}>
                  {formData.isNegotiable && (
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  name="isNegotiable" 
                  checked={formData.isNegotiable} 
                  onChange={handleInputChange} 
                  className="hidden"
                />
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>قابل للتفاوض</span>
              </label>
            </div>
            {/* Deposit */}
            <div className="space-y-3">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>التأمين</label>
              <input 
                type="number" 
                name="securityDeposit" 
                value={formData.securityDeposit} 
                onChange={handleInputChange} 
                className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal ${getErrorClass('securityDeposit')} ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-100 bg-[#F9FAFB] text-gray-900 placeholder-gray-500'
                }`} 
                placeholder="ادخل مبلغ التأمين - إن وجد" 
              />
              <ErrorMessage error={errors.securityDeposit} />
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
                  className={`w-[85%] p-3.5 border rounded-2xl text-base font-[Noor] font-normal ${getErrorClass('name')} ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-100 bg-[#F9FAFB] text-gray-900 placeholder-gray-500'
                  }`} 
                  placeholder="ادخل الاسم" 
                />
                <ErrorMessage error={errors.name} />
              </div>
              <div className="space-y-3" data-field="phone">
                <label className={`block text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>رقم الهاتف المحمول</label>
                <div 
                  className={`phone-input-container w-[85%] ${isDarkMode ? 'dark-phone-input' : ''}`} 
                  style={{ position: 'relative', zIndex: 1 }}
                  data-key={phoneInputKey}
                >
                  {phoneInputComponent}
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
            {/* Submit Button with Loading State */}
            <div className={`flex justify-center my-20 border-t pt-20 pb-20 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-[600px] py-3.5 rounded-xl text-base font-medium transition-all duration-200 shadow-sm font-[Noor] font-normal
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isDarkMode
                    ? 'bg-black text-[#FFD700] hover:bg-gray-900 active:bg-gray-800'
                    : 'bg-black text-[#FFD700] hover:bg-gray-900 active:bg-gray-800'}`}
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
    </Layout>
  );
};

export default AddPropertyForRent; 