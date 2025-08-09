import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Layout from '../components/Layout';
import { Plus } from 'lucide-react';
import icon from "/images/tdesign_vehicle-filled.png"
import {CATEGORY_CAR_ID} from "../redux/Type"
import AddListingHook from '../Hook/listing/addListingHook';
import notify from '../Hook/useNotifaction';
import { useNavigate } from 'react-router-dom';
import image1 from "/images/add-car/Group.svg"
import image2 from "/images/add-car/Group (1).svg"
import image3 from "/images/add-car/Group (2).svg"
import image4 from "/images/add-car/Group (3).svg"
import image5 from "/images/add-car/Group (4).svg"
import image6 from "/images/add-car/Group (5).svg"
import image7 from "/images/add-car/Group (6).svg"
import image8 from "/images/add-car/Group (7).svg"
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'country-flag-icons/react/3x2';
import { useDarkMode } from '../context/DarkModeContext';
import addImageIcon from "/images/Add Photo.svg";    

import Alfa_Romeo from "/images/add-car/CarsLogos/Alfa Romeo.svg" ;   
import Asia from "/images/add-car/CarsLogos/Asia.svg";
import Aston_Martin from "/images/add-car/CarsLogos/Aston Martin.svg";
import Audi from "/images/add-car/CarsLogos/Audi.svg";
import Baic from "/images/add-car/CarsLogos/Baic.svg";
import Bentley from "/images/add-car/CarsLogos/Bentley.svg";
import Bertone from "/images/add-car/CarsLogos/Bertone.svg";
import BMW from "/images/add-car/CarsLogos/BMW.svg";
import Brilliance from "/images/add-car/CarsLogos/Brilliance.svg";
import Bugatti from "/images/add-car/CarsLogos/Bugatti.svg";
import Buick from "/images/add-car/CarsLogos/Buick.svg";
import BYD from "/images/add-car/CarsLogos/BYD.svg";
import Camc from "/images/add-car/CarsLogos/Camc.svg";
import Changan from "/images/add-car/CarsLogos/Changan.svg";
import changfeng from "/images/add-car/CarsLogos/changfeng.svg";
import Chery from "/images/add-car/CarsLogos/Chery.svg";
import Chevrolet from "/images/add-car/CarsLogos/Chevrolet.svg";
import Citroen from "/images/add-car/CarsLogos/Citroen.svg";
import Dacia from "/images/add-car/CarsLogos/Dacia.svg";
import Daewoo from "/images/add-car/CarsLogos/Daewoo.svg";
import Daihatsu from "/images/add-car/CarsLogos/Daihatsu.svg";
import Datson from "/images/add-car/CarsLogos/Datson.svg";
import Dodge from "/images/add-car/CarsLogos/Dodge.svg";
import Dongfeng from "/images/add-car/CarsLogos/Dongfeng.svg";
import Faw from "/images/add-car/CarsLogos/Faw.svg";
import Ferrari from "/images/add-car/CarsLogos/Ferrari.svg";
import Fiat from "/images/add-car/CarsLogos/Fiat.svg";
import Ford from "/images/add-car/CarsLogos/Ford.svg";
import Geely from "/images/add-car/CarsLogos/Geely.svg";
import Ginetta from "/images/add-car/CarsLogos/Ginetta.svg";
import GMC from "/images/add-car/CarsLogos/GMC.svg";
import Haima from "/images/add-car/CarsLogos/Haima.svg";
import Haval from "/images/add-car/CarsLogos/Haval.svg";
import Honda from "/images/add-car/CarsLogos/Honda.svg";
import Hummer from "/images/add-car/CarsLogos/Hummer.svg";
import Hyundai from "/images/add-car/CarsLogos/Hyundai.svg";
import Infiniti from "/images/add-car/CarsLogos/Infiniti.svg";
import Isuzu from "/images/add-car/CarsLogos/Isuzu.svg";
import Jac from "/images/add-car/CarsLogos/Jac.svg";
import Jaguar from "/images/add-car/CarsLogos/Jaguar.svg";
import Jeep from "/images/add-car/CarsLogos/Jeep.svg";
import Kia from "/images/add-car/CarsLogos/Kia.svg";
import Lada from "/images/add-car/CarsLogos/Lada.svg";
import Lamborgini from "/images/add-car/CarsLogos/Lamborgini.svg";
import Lancia from "/images/add-car/CarsLogos/Lancia.svg";
import Land_Rover from "/images/add-car/CarsLogos/Land Rover.svg";
import Landwind from "/images/add-car/CarsLogos/Landwind.svg";
import Lexus from "/images/add-car/CarsLogos/Lexus.svg";
import Lotus from "/images/add-car/CarsLogos/Lotus.svg";
import Maserati from "/images/add-car/CarsLogos/Maserati.svg";
import Maybach from "/images/add-car/CarsLogos/Maybach.svg";
import Mazda from "/images/add-car/CarsLogos/Mazda.svg";
import Mercury from "/images/add-car/CarsLogos/Mercury.svg";
import MG from "/images/add-car/CarsLogos/MG.svg";
import Mini from "/images/add-car/CarsLogos/Mini.svg";
import Mitsubishi from "/images/add-car/CarsLogos/Mitsubishi.svg";
import Nissan from "/images/add-car/CarsLogos/Nissan.svg";
import Opel from "/images/add-car/CarsLogos/Opel.svg";
import Plymouth from "/images/add-car/CarsLogos/Plymouth.svg";
import Predoua from "/images/add-car/CarsLogos/Predoua.svg";
import Prugeot from "/images/add-car/CarsLogos/Prugeot.svg";
import Renault_samsung from "/images/add-car/CarsLogos/Renault samsung.svg";
import Renault from "/images/add-car/CarsLogos/Renault.svg";
import Rolls_Royce from "/images/add-car/CarsLogos/Rolls Royce.svg";
import Rufi from "/images/add-car/CarsLogos/Rufi.svg";
import Saab_1 from "/images/add-car/CarsLogos/Saab 1.svg";
import Saab from "/images/add-car/CarsLogos/Saab.svg";
import Seat from "/images/add-car/CarsLogos/Seat.svg";
import Skoda from "/images/add-car/CarsLogos/Skoda.svg";
import Smart from "/images/add-car/CarsLogos/Smart.svg";
import SsangYong from "/images/add-car/CarsLogos/SsangYong.svg";
import Subaru from "/images/add-car/CarsLogos/Subaru.svg";
import Suzuki from "/images/add-car/CarsLogos/Suzuki.svg";
import Tata from "/images/add-car/CarsLogos/Tata.svg";
import Tatra from "/images/add-car/CarsLogos/Tatra.svg";
import Toyota from "/images/add-car/CarsLogos/Toyota.svg";
import volkswagen_50_50 from "/images/add-car/CarsLogos/volkswagen 50_50.svg";
import Volvo from "/images/add-car/CarsLogos/Volvo.svg";
import Zaz from "/images/add-car/CarsLogos/Zaz.svg";
import Zotye from "/images/add-car/CarsLogos/Zotye.svg";

// Car Logos Object
const carLogos = {
  "ألفا روميو": Alfa_Romeo,
  "آسيا": Asia,
  "أستون مارتن": Aston_Martin,
  "أودي": Audi,
  "بايك": Baic,
  "بنتلي": Bentley,
  "بيرتون": Bertone,
  "بي إم دبليو": BMW,
  "بريليانس": Brilliance,
  "بوغاتي": Bugatti,
  "بويك": Buick,
  "بي واي دي": BYD,
  "كامك": Camc,
  "تشانجان": Changan,
  "تشانغفنغ": changfeng,
  "شيري": Chery,
  "شيفروليه": Chevrolet,
  "سيتروين": Citroen,
  "داتشيا": Dacia,
  "دايو": Daewoo,
  "ديهاتسو": Daihatsu,
  "داتسون": Datson,
  "دودج": Dodge,
  "دونغفنغ": Dongfeng,
  "فاو": Faw,
  "فيراري": Ferrari,
  "فيات": Fiat,
  "فورد": Ford,
  "جيلي": Geely,
  "جينيتا": Ginetta,
  "جي إم سي": GMC,
  "هايما": Haima,
  "هافال": Haval,
  "هوندا": Honda,
  "هامر": Hummer,
  "هيونداي": Hyundai,
  "إنفينيتي": Infiniti,
  "إيسوزو": Isuzu,
  "جاك": Jac,
  "جاغوار": Jaguar,
  "جيب": Jeep,
  "كيا": Kia,
  "لادا": Lada,
  "لامبورغيني": Lamborgini,
  "لانشيا": Lancia,
  "لاند روفر": Land_Rover,
  "لاندويند": Landwind,
  "لكزس": Lexus,
  "لوتس": Lotus,
  "مازيراتي": Maserati,
  "مايباخ": Maybach,
  "مازدا": Mazda,
  "ميركوري": Mercury,
  "إم جي": MG,
  "ميني": Mini,
  "ميتسوبيشي": Mitsubishi,
  "نيسان": Nissan,
  "أوبل": Opel,
  "بليموث": Plymouth,
  "برودوا": Predoua,
  "بيجو": Prugeot,
  "رينو سامسونج": Renault_samsung,
  "رينو": Renault,
  "رولز رويس": Rolls_Royce,
  "روفاي": Rufi,
  "ساب 1": Saab_1,
  "ساب": Saab,
  "سيات": Seat,
  "سكودا": Skoda,
  "سمارت": Smart,
  "سانج يونج": SsangYong,
  "سوبارو": Subaru,
  "سوزوكي": Suzuki,
  "تاتا": Tata,
  "تاترا": Tatra,
  "تويوتا": Toyota,
  "فولكس واجن": volkswagen_50_50,
  "فولفو": Volvo,
  "زاز": Zaz,
  "زوتي": Zotye
};

const AddCarListing = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [errors, setErrors] = useState({});

  const initialState = {
    brand: '',
    carType: '',
    version: '',
    manufacturingYear: '', // سنة التصنيع
    horsePower: '',
    engineCapacity: '',
    color: '',
    drivetrain: '',
    imported: '',
    doors: '',
    seats: '',
    innerpart: '',
    condition: '',
    additionalFeatures: [],
    fuelType: '',
    transmissionType: '',
    adTitle: '',
    description: '',
    city: '',
    location: {
      address: '',
      lat: 0,
      lng: 0
    },
    price: '',
    downPayment: '',
    negotiable: false,
    paymentMethod: '',
    currency: 'دولار',
    name: '',
    phone: '',
    contactMethod: [],
    saleType: 'بيع',
    publishedBy: '',
    kilometers: '' // إضافة الكيلومترات المفقودة
  };    

  const [formData, setFormData] = useState(initialState);

  // Store actual files and preview URLs separately
  const [imageFiles, setImageFiles] = useState(Array(12).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(12).fill(null));

  const [submitListing, response, loading, error, success] = AddListingHook()

  // Add state for validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Modal states for dropdowns
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isSaleTypeOpen, setIsSaleTypeOpen] = useState(false);
  const [isManufacturingYearOpen, setIsManufacturingYearOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSeatsOpen, setIsSeatsOpen] = useState(false);
  const [isCarTypeOpen, setIsCarTypeOpen] = useState(false);

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isDoorsOpen, setIsDoorsOpen] = useState(false);
  const [isInnerpartOpen, setIsInnerpartOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isGovernorateOpen, setIsGovernorateOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 33.5138,
    lng: 36.2765
  });

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

  // Options arrays
  const brandOptions = Object.keys(carLogos);

  const saleTypeOptions = ['بيع', 'إيجار'];

  // carTypeOptions مع الصور
  const carTypeOptions = [
    { label: 'كوبيه', image: image1 },
    { label: 'سيدان', image: image2 },
    { label: 'كروس اوفر', image: image3 },
    { label: 'سيارة مكشوفة', image: image4 },
    { label: 'سيارة رياضية', image: image5 },
    { label: 'جيب', image: image6 },
    { label: 'بيك أب', image: image7 },
    { label: 'شاحنة صغيرة/فان', image: image8 },
  ];

  const conditionOptions = ['جديد', 'مستعمل'];

  const publishedByOptions = ['المالك', 'الوكيل'];

  const colorOptions = [
    'أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'أصفر', 
    'بني', 'برتقالي', 'بنفسجي', 'ذهبي'
  ];

  const currencyOptions = [
    { value: 'دولار', label: 'دولار', flag: '🇺🇸' },
    { value: 'ليرة', label: 'ليرة', flag: '🇸🇾' }
  ];

  const doorOptions = ['2', '3', '4', '5'];
  const seatOptions = ['2', '4', '5', '7', '8', '9'];
  const innerpartOptions = ['قماش', 'جلد', 'فينيل', 'مختلط'];
  const yearOptions = Array.from({length: 30}, (_, i) => (2024 - i).toString());

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
    'الحسكة'
  ];

  const additionalFeatures = [
    'نظام الفرامل ABS',
    'نظام النقطة العمياء',
    'مراقب ضغط الإطارات',
    'قفل مركزي',
    'مقاعد كهربائية',
    'دخول بدون مفتاح',
    'مقاعد مساج',
    'مقاعد مدفأة',
    'مقود مدفأ',
    'مثبت سرعة',
    'فتحة سقف',
    'سقف بانورامي',
    'وسائد هوائية',
    'نظام بلوتوث',
    'مرايا كهربائية'
  ];

  const fuelTypeOptions = [
    'بنزين',
    'كهرباء',
    'غاز طبيعي',
    'ديزل',
    'هايبرد'
  ];

  const transmissionOptions = [
    'أوتوماتيك',
    'يدوي/عادي'
  ];

  // Handle success state from the hook
  useEffect(() => {
    if (success && hasSubmitted) {
      console.log('Success received - car listing submitted successfully');
      notify('تم طلب الإعلان بنجاح', 'success');
      
      // Reset form
      setFormData(initialState);
      setImageFiles(Array(12).fill(null));
      setImagePreviews(Array(12).fill(null));
      setIsSubmitting(false);
      setHasSubmitted(false);
      
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Find the first empty slot
      const currentFiles = imageFiles.filter(file => file !== null);
      const maxImages = 12;
      
      if (currentFiles.length + files.length > maxImages) {
        alert(`يمكنك تحميل ${maxImages} صور كحد أقصى`);
        return;
      }

      files.forEach((file, fileIndex) => {
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
      if (name.includes('additionalFeatures.')) {
        const featureName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          additionalFeatures: {
            ...prev.additionalFeatures,
            [featureName]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (name === 'carModel' || name === 'horsePower' || name === 'engineCapacity') {
      // Prevent scroll from changing the value
      e.preventDefault();
      
      // Remove any non-numeric characters except decimal point for engineCapacity
      let newValue = value.replace(/[^\d.]/g, '');
      
      // For carModel and horsePower, only allow integers
      if (name !== 'engineCapacity') {
        newValue = newValue.replace(/\D/g, '');
      } else {
        // For engineCapacity, ensure only one decimal point
        const parts = newValue.split('.');
        if (parts.length > 2) {
          newValue = parts[0] + '.' + parts.slice(1).join('');
        }
        // Limit to 2 decimal places
        if (parts[1]?.length > 2) {
          newValue = parseFloat(newValue).toFixed(2);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add these event handlers to prevent scroll from changing values
  const preventScrollChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleContactMethodChange = (method) => {
    setFormData(prev => {
      const currentMethods = prev.contactMethod || [];
      const updatedMethods = currentMethods.includes(method)
        ? currentMethods.filter(m => m !== method)
        : [...currentMethods, method];
      
      return {
        ...prev,
        contactMethod: updatedMethods
      };
    });
  };

  // Add validation function
  const validateForm = () => {
    const validationErrors = {};
    
    // Required fields validation
    const requiredFields = {
      brand: 'الماركة',
      carType: 'نوع السيارة',
      carModel: 'موديل السيارة',
      horsePower: 'قوة الحصان',
      engineCapacity: 'سعة المحرك',
      color: 'اللون',
      drivetrain: 'الدفع',
      imported: 'الوارد',
      doors: 'عدد الأبواب',
      seats: 'عدد المقاعد',
      innerpart: 'الجزء الداخلي',
      condition: 'حالة السيارة',
      fuelType: 'نوع الوقود',
      transmissionType: 'ناقل الحركة',
      adTitle: 'عنوان الإعلان',
      description: 'وصف الإعلان',
      governorate: 'المحافظة',
      price: 'السعر',
      paymentMethod: 'طريقة الدفع',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      contactMethod: 'طريقة التواصل',
      saleType: 'نوع البيع',
      publishedBy: 'تم النشر من قبل',
      currency: 'العملة',
      kilometers: 'عدد الكيلومترات'
    };

    // Log current form data for debugging
    console.log('Current Form Data:', formData);

    // Check all required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (field === 'contactMethod') {
        if (!formData[field] || !Array.isArray(formData[field]) || formData[field].length === 0) {
          validationErrors[field] = `${label} مطلوب`;
          console.log(`Contact method validation failed:`, formData[field]);
        }
      } else if (field === 'kilometers') {
        if (!formData[field] || isNaN(formData[field]) || Number(formData[field]) <= 0) {
          validationErrors[field] = `${label} مطلوب ويجب أن يكون رقم صحيح`;
          console.log(`Kilometers validation failed:`, formData[field]);
        }
      } else {
        const value = formData[field];
        if (value === undefined || value === null || String(value).trim() === '') {
          validationErrors[field] = `${label} مطلوب`;
          console.log(`Field ${field} validation failed:`, value);
        }
      }
    });

    // Location validation
    if (!formData.location?.lat || !formData.location?.lng) {
      validationErrors.location = 'الموقع مطلوب';
      console.log(`Location validation failed:`, formData.location);
    }

    // Image validation
    const uploadedImagesCount = imageFiles.filter(file => file !== null).length;
    if (uploadedImagesCount < 5) {
      validationErrors.images = 'يجب رفع 5 صور على الأقل';
      console.log(`Image validation failed: ${uploadedImagesCount} images uploaded`);
    }

    // Log validation errors for debugging
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation Errors:', validationErrors);
    }

    return validationErrors;
  };

  // Function to scroll to error
  const scrollToError = (errors) => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const element = document.querySelector(`[data-field="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add visual feedback
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = isDarkMode ? '0 0 10px rgba(248, 113, 113, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }
    }
  };

  // Error message component
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <p className={`text-red-500 text-sm mt-1 font-[Noor] ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>;
  };

  const getErrorClass = (fieldName) => {
    return errors[fieldName] ? (isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-500 bg-red-50') : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToError(validationErrors);
      notify('يرجى ملء جميع الحقول المطلوبة', 'error');
      console.log('Form submission failed due to validation errors:', validationErrors);
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const formDataToSubmit = new FormData();

      // Add category first
      formDataToSubmit.append('category', CATEGORY_CAR_ID.toString());

      // Add images
      const imagesToSend = [];
      imageFiles.forEach((file, index) => {
        if (file) {
          formDataToSubmit.append('images', file);
          imagesToSend.push(file.name);
        }
      });

      // Create the submission data object with exact field names as required
      const submissionData = {
        brand: formData.brand || '',
        images: imagesToSend,
        'sale or rent': formData.saleType || 'بيع',
        kilometers: formData.kilometers?.toString() || '',
        'Manufacturing Year': formData.carModel || '', // حقل "موديل السيارة" هو فعلياً السنة (min=1900 max=2024)
        Horsepower: formData.horsePower || '',
        'Engine Capacity': formData.engineCapacity || '',
        color: formData.color || '',
        Drivetrain: formData.drivetrain || '',
        Imported: formData.imported || '',
        'number of doors': formData.doors || '',
        'number of sets': formData.seats || '',
        'inner part': formData.innerpart || '',
        'property condition': formData.condition || '',
        'additional features': formData.additionalFeatures || [],
        'fuel type': formData.fuelType ? [formData.fuelType] : [],
        'transmission type': formData.transmissionType || '',
        'Car Type': formData.carType || '',
        publishedVia: formData.publishedBy || 'موقع',
        'ad title': formData.adTitle || '',
        description: formData.description || '',
        city: formData.governorate || '',
        lat: formData.location?.lat || '',
        long: formData.location?.lng || '',
        price: formData.price?.toString() || '',
        'down payment': formData.downPayment?.toString() || '',
        negotiable: Boolean(formData.negotiable),
        'payment method': formData.paymentMethod || '',
        currency: formData.currency || 'دولار',
        name: formData.name || '',
        'phone number': formData.phone || '',
        'contact method': formData.contactMethod || [],
      };

      // Append each field to FormData
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => {
              formDataToSubmit.append(key, item);
            });
          } else if (typeof value === 'boolean') {
            formDataToSubmit.append(key, value.toString());
          } else {
            formDataToSubmit.append(key, value);
          }
        }
      });

      // Submit the form
      console.log('=== SUBMISSION DATA DEBUG ===');
      console.log('Form Data Object:', submissionData);
      console.log('Submitting FormData with entries:');
      for (let [key, value] of formDataToSubmit.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log('=== END DEBUG ===');

      await submitListing(formDataToSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
      notify('حدث خطأ أثناء إرسال النموذج', 'error');
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  };

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  return (
    <Layout>

      <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} dir="rtl">
        {/* Title Bar */}
        <div className={`w-full border-t-2 border-yellow-300 shadow-md flex justify-center items-center py-3 sm:py-4 mb-4 sm:mb-8 ${isDarkMode ? 'bg-[#FFED00]' : 'bg-[#F6F9FE]'}`}>
          <span className={`flex items-center gap-2 text-base sm:text-lg font-medium ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>
            <span style={{ fontFamily: 'Cairo', fontWeight: 700 }}>سيارات للبيع</span>
            <img src={icon} alt="سيارات" className="w-10 h-10" />
          </span>
        </div>
        <div className="container mx-auto px-4 sm:p-4">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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

            {/* Brand/الماركة */}
            <div className="space-y-3" data-field="brand">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الماركة</label>
              <button
                type="button"
                onClick={() => setIsBrandOpen(true)}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 flex items-center justify-between ${
                  errors.brand
                    ? (isDarkMode ? 'border-red-400 bg-red-900/20 text-red-200' : 'border-red-500 bg-red-50 text-red-900')
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {formData.brand && carLogos[formData.brand] && (
                    <img src={carLogos[formData.brand]} alt={formData.brand} className="w-6 h-6" />
                  )}
                  <span>{formData.brand || 'اختر الماركة'}</span>
                </div>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.brand} />
            </div>

            {/* Sale Type/بيع ايجار */}
            <div className="space-y-3" data-field="saleType">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>بيع / ايجار</label>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {['بيع', 'إيجار'].map((option) => (
                  <label key={option} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="saleType"
                      value={option}
                      checked={formData.saleType === option}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                    <span className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-150 text-sm sm:text-base font-[Noor] ${
                      formData.saleType === option 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}>
                      {option}
                  </span>
                </label>
                ))}
              </div>
              <ErrorMessage error={errors.saleType} />
            </div>

            {/* Kilometers */}
            <div className="space-y-3" data-field="kilometers">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>كيلومترات</label>
              <div className="flex items-center gap-2 w-full sm:w-[85%]">
                <input
                  type="number"
                  name="kilometers"
                  value={formData.kilometers}
                  onChange={handleInputChange}
                  className={`w-full p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                  } ${getErrorClass('kilometers')}`}
                />
                <span className={`text-sm sm:text-base font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kms</span>
              </div>
              <ErrorMessage error={errors.kilometers} />
            </div>

            {/* Manufacturing Year/سنة التصنيع */}
            <div className="space-y-3" data-field="carModel">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>سنة التصنيع</label>
              <input
                type="number"
                name="carModel"
                value={formData.carModel}
                onChange={handleInputChange}
                onWheel={preventScrollChange}
                min="1900"
                max="2024"
                placeholder="أدخل سنة التصنيع"
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                } ${getErrorClass('carModel')}`}
              />
              <ErrorMessage error={errors.carModel} />
            </div>

            {/* Horse Power/قوة المحصان */}
            <div className="space-y-3" data-field="horsePower">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>قوة المحصان</label>
              <div className="flex items-center gap-2 w-full sm:w-[85%]">
                <input
                  type="number"
                  name="horsePower"
                  value={formData.horsePower}
                  onChange={handleInputChange}
                  onWheel={preventScrollChange}
                  min="1"
                  step="1"
                  placeholder="120"
                  className={`w-full p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                  } ${getErrorClass('horsePower')}`}
                />
                <span className={`text-sm sm:text-base font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>HP</span>
              </div>
              <ErrorMessage error={errors.horsePower} />
            </div>

            {/* Engine Capacity/سعة المحرك cc */}
            <div className="space-y-3" data-field="engineCapacity">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>سعة المحرك cc</label>
              <div className="flex items-center gap-2 w-full sm:w-[85%]">
                <input
                  type="number"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  onWheel={preventScrollChange}
                  min="0.1"
                  step="0.1"
                  placeholder="1600"
                  className={`w-full p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                  } ${getErrorClass('engineCapacity')}`}
                />
                <span className={`text-sm sm:text-base font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>cc</span>
              </div>
              <ErrorMessage error={errors.engineCapacity} />
            </div>

            {/* Color/لون السيارة */}
            <div className="space-y-3" data-field="color">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>لون السيارة</label>
              <button
                type="button"
                onClick={() => setIsColorOpen(true)}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal text-right flex justify-between items-center transition-all duration-200 ${
                  errors.color 
                    ? (isDarkMode ? 'border-red-400 bg-red-900/20 text-red-200' : 'border-red-500 bg-red-50 text-red-900')
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span>{formData.color || 'اختر اللون'}</span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.color} />
            </div>

            {/* Drivetrain/الدفع */}
            <div className="space-y-3" data-field="drivetrain">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الدفع</label>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {['أمامي', 'خلفي', 'رباعي'].map((option) => (
                  <label key={option} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="drivetrain"
                      value={option}
                      checked={formData.drivetrain === option}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                    <span className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-150 text-sm sm:text-base font-[Noor] ${
                      formData.drivetrain === option 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}>
                      {option}
                  </span>
                </label>
                ))}
              </div>
              <ErrorMessage error={errors.drivetrain} />
            </div>

            {/* Imported/الوارد */}
            <div className="space-y-3" data-field="imported">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الوارد</label>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {['أمريكا', 'اليابان', 'أوروبا', 'كندا', 'الخليج'].map((option) => (
                  <label key={option} className="cursor-pointer select-none">
                    <input
                      type="radio"
                      name="imported"
                      value={option}
                      checked={formData.imported === option}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl border transition-all duration-150 text-sm sm:text-base font-[Noor] ${
                      formData.imported === option 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                          : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                    }`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.imported} />
            </div>

            {/* Doors/عدد الأبواب */}
            <div className="space-y-3" data-field="doors">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد الأبواب</label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {['2', '3', '4', '5'].map((door) => (
                  <label key={door} className="cursor-pointer select-none">
                    <input
                      type="radio"
                      name="doors"
                      value={door}
                      checked={formData.doors === door}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded-full transition-all duration-150 text-sm sm:text-base ${
                      formData.doors === door 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100'
                          : 'bg-white border-black text-black'
                    }`}>
                      {formData.doors === door ? (
                        <svg width="14" height="14" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span>{door}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.doors} />
            </div>

            {/* Seats/عدد المقاعد */}
            <div className="space-y-3" data-field="seats">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عدد المقاعد</label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {['2', '4', '5', '7', '8', '9'].map((seats) => (
                  <label key={seats} className="cursor-pointer select-none">
                    <input
                      type="radio"
                      name="seats"
                      value={seats}
                      checked={formData.seats === seats}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded-full transition-all duration-150 text-sm sm:text-base ${
                      formData.seats === seats 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100'
                          : 'bg-white border-black text-black'
                    }`}>
                      {formData.seats === seats ? (
                        <svg width="14" height="14" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span>{seats}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.seats} />
            </div>

            {/* Inner Part/الجزء الداخلي */}
            <div className="space-y-3" data-field="innerpart">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الجزء الداخلي</label>
              <button
                type="button"
                onClick={() => setIsInnerpartOpen(true)}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal text-right flex justify-between items-center transition-all duration-200 ${
                  errors.innerpart 
                    ? (isDarkMode ? 'border-red-400 bg-red-900/20 text-red-200' : 'border-red-500 bg-red-50 text-red-900')
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span>{formData.innerpart || 'اختر نوع الجزء الداخلي'}</span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.innerpart} />
            </div>

                        {/* Condition/جديد مستعمل */}
            <div className="space-y-3" data-field="condition">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>جديد / مستعمل</label>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {['جديد', 'مستعمل'].map((option) => (
                  <label key={option} className="cursor-pointer select-none">
                    <input
                      type="radio"
                      name="condition"
                      value={option}
                      checked={formData.condition === option}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-150 text-sm sm:text-base font-[Noor] ${
                      formData.condition === option 
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.condition} />
            </div>

            {/* Additional Features */}
            <div className="space-y-3">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>إضافات</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {additionalFeatures.map(feature => (
                  <label
                    key={feature}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer font-[Noor] font-normal select-none text-sm sm:text-base"
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.additionalFeatures.includes(feature) 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-black'
                    }`}>
                      {formData.additionalFeatures.includes(feature) && (
                        <svg width="12" height="12" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      name="additionalFeatures"
                      value={feature}
                      checked={formData.additionalFeatures.includes(feature)}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          additionalFeatures: checked 
                            ? [...prev.additionalFeatures, value]
                            : prev.additionalFeatures.filter(f => f !== value)
                        }));
                      }}
                      className="hidden"
                    />
                    <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-3" data-field="fuelType">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>نوع الوقود</label>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                {fuelTypeOptions.map(type => (
                  <label
                    key={type}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer font-[Noor] font-normal select-none text-sm sm:text-base"
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.fuelType === type 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-black'
                    }`}>
                      {formData.fuelType === type && (
                        <svg width="12" height="12" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="fuelType"
                      value={type}
                      checked={formData.fuelType === type}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className="text-base">{type}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.fuelType} />
            </div>

            {/* Transmission Type */}
            <div className="space-y-3" data-field="transmissionType">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>ناقل الحركة</label>
              <div className="flex gap-3 sm:gap-4">
                {transmissionOptions.map(type => (
                  <label
                    key={type}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer font-[Noor] font-normal select-none text-sm sm:text-base"
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.transmissionType === type 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-black'
                    }`}>
                      {formData.transmissionType === type && (
                        <svg width="12" height="12" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="transmissionType"
                      value={type}
                      checked={formData.transmissionType === type}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{type}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage error={errors.transmissionType} />
            </div>

            {/* Car Type/نوع السيارة */}
            <div className="space-y-3" data-field="carType">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>نوع السيارة</label>
              <button
                type="button"
                onClick={() => setIsCarTypeOpen(true)}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal text-right flex justify-between items-center transition-all duration-200 ${
                  errors.carType 
                    ? (isDarkMode ? 'border-red-400 bg-red-900/20 text-red-200' : 'border-red-500 bg-red-50 text-red-900')
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span>{formData.carType || 'اختر نوع السيارة'}</span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.carType} />
            </div>

            {/* Published By */}
            <div className="space-y-3" data-field="publishedBy">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>تم النشر من قبل</label>
              <div className="flex gap-4 sm:gap-6">
                {['المالك', 'الوكيل'].map(opt => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer font-[Noor] font-normal select-none text-sm sm:text-base"
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                      formData.publishedBy === opt 
                        ? 'bg-yellow-400 border-yellow-400' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-black'
                    }`}>
                      {formData.publishedBy === opt && (
                        <svg width="12" height="12" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="publishedBy"
                      value={opt}
                      checked={formData.publishedBy === opt}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3" data-field="adTitle">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>عنوان الإعلان</label>
              <input
                type="text"
                name="adTitle"
                value={formData.adTitle}
                onChange={handleInputChange}
                placeholder="ادخل عنوان الإعلان"
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                } ${getErrorClass('adTitle')}`}
              />
              <ErrorMessage error={errors.adTitle} />
            </div>

            {/* Description */}
            <div className="space-y-3" data-field="description">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>وصف الإعلان</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="الوصف"
                rows={4}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                } ${getErrorClass('description')}`}
              />
              <ErrorMessage error={errors.description} />
            </div>

            {/* Governorate */}
            <div className="space-y-3" data-field="governorate">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>المحافظة</label>
              <button
                type="button"
                onClick={() => setIsGovernorateOpen(true)}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal text-right flex justify-between items-center transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                    : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span>{formData.governorate || 'اختر المحافظة'}</span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Location */}
            <div className="space-y-3" data-field="location">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>موقع السيارة</label>
              <div className="relative w-full sm:w-[85%]">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className={`w-full p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal text-right flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="flex-grow text-right">
                    {formData.location.address || 'حدد موقع السيارة على الخريطة'}
                  </span>
                </button>
              </div>
              <ErrorMessage error={errors.location} />
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
                      className="rounded-full p-2 hover:bg-gray-100"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>
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
                              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
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

            {/* Map Modal */}
            <Dialog
              open={isMapOpen}
              onClose={() => setIsMapOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-4xl h-[80vh] transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl transition-all`}>
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}> 
                    <button
                      onClick={() => setIsMapOpen(false)}
                      className={`rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>
                      حدد موقع السيارة
                    </Dialog.Title>
                  </div>
                  <div className="relative" style={{ height: 'calc(80vh - 64px)' }}>
                    {/* Current Location Button */}
                    <button
                      onClick={getCurrentLocation}
                      className={`absolute bottom-4 right-4 z-[1000] p-3 rounded-lg shadow-md focus:outline-none transition-all duration-200 flex items-center gap-2 ${isDarkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-[Noor]">موقعي الحالي</span>
                    </button>

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

            {/* Car Price */}
            <div className="space-y-3" data-field="price">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>سعر السيارة</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                } ${getErrorClass('price')}`}
                placeholder="السعر"
              />
              <ErrorMessage error={errors.price} />
            </div>

            {/* Down Payment/الدفعة المقدمة */}
            <div className="space-y-3" data-field="downPayment">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الدفعة المقدمة</label>
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleInputChange}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                } ${getErrorClass('downPayment')}`}
                placeholder="0"
              />
              <ErrorMessage error={errors.downPayment} />
            </div>

            {/* Negotiable/قابل للتفاوض */}
            <div className="space-y-3" data-field="negotiable">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>قابل للتفاوض</label>
              <div className="flex gap-4 sm:gap-6">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer font-[Noor] font-normal select-none text-sm sm:text-base">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
                    className="hidden"
                  />
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                    formData.negotiable 
                      ? 'bg-yellow-400 border-yellow-400' 
                      : isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-black'
                  }`}>
                    {formData.negotiable && (
                      <svg width="12" height="12" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>قابل للتفاوض</span>
                </label>
              </div>
              <ErrorMessage error={errors.negotiable} />
            </div>

            {/* Payment Method */}
            <div className="space-y-3" data-field="paymentMethod">
              <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة الدفع</label>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {['كاش', 'تقسيط', 'كاش أو تقسيط'].map((option) => (
                  <label key={option} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="paymentMethod"
                      value={option}
                      checked={formData.paymentMethod === option}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                    <span className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-150 text-sm sm:text-base font-[Noor] ${
                      formData.paymentMethod === option
                        ? 'bg-yellow-400 border-yellow-400 text-black' 
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}>
                      {option}
                  </span>
                </label>
                ))}
              </div>
              <ErrorMessage error={errors.paymentMethod} />
            </div>

            {/* Currency */}
            <div className="space-y-3" data-field="currency">
              <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>العملة</label>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(true)}
                className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal text-right flex justify-between items-center transition-all duration-200 ${
                  errors.currency 
                    ? (isDarkMode ? 'border-red-400 bg-red-900/20 text-red-200' : 'border-red-500 bg-red-50 text-red-900')
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {currencyOptions.find(c => c.value === formData.currency)?.flag}
                  <span>{formData.currency || 'اختر العملة'}</span>
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ErrorMessage error={errors.currency} />
            </div>



            {/* Contact Information */}
            <div className="space-y-4 pt-8 sm:pt-10">
              <h2 className={`text-base sm:text-lg mb-4 sm:mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>معلومات التواصل</h2>
              
              <div className="space-y-3" data-field="name">
                <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full sm:w-[85%] p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl text-sm sm:text-base font-[Noor] font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 hover:border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500 hover:border-gray-300'
                  } ${getErrorClass('name')}`}
                />
                <ErrorMessage error={errors.name} />
              </div>

              <div className="space-y-3" data-field="phone">
                <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>رقم الهاتف المحمول</label>
                                  <div className={`phone-input-container w-full sm:w-[85%] ${isDarkMode ? 'dark-phone-input' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
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

              {/* Contact Method */}
              <div className="space-y-4 pt-6" data-field="contactMethod">
                <label className={`block text-base sm:text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>طريقة التواصل</label>
                <div className="flex gap-6 sm:gap-8">
                  {[
                    { value: 'موبايل', label: 'موبايل' },
                    { value: 'شات', label: 'شات' },
                    { value: 'الاتنين', label: 'الاتنين' }
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 sm:gap-3 cursor-pointer font-[Noor] font-normal select-none text-sm sm:text-base">
                      <input
                        type="checkbox"
                        checked={formData.contactMethod.includes(value)}
                        onChange={() => handleContactMethodChange(value)}
                        className="hidden"
                      />
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 rounded transition-all duration-150 ${
                        formData.contactMethod.includes(value) 
                          ? 'bg-yellow-400 border-yellow-400' 
                          : isDarkMode
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-black'
                      }`}>
                        {formData.contactMethod.includes(value) && (
                          <svg width="12" height="12" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10.5L9 14.5L15 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{label}</span>
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
                {isSubmitting ? 'جاري طلب الإعلان...' : 'انشر الاعلان'}
              </button>
            </div>

            {/* Brand Selection Modal */}
            <Dialog open={isBrandOpen} onClose={() => setIsBrandOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsBrandOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>اختر الماركة</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {brandOptions.map((brand) => (
                      <button
                        key={brand}
                        className={`p-4 rounded-2xl text-lg font-medium flex flex-col items-center gap-2 ${
                          formData.brand === brand
                            ? 'bg-yellow-400 text-black'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                              : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, brand }));
                          setIsBrandOpen(false);
                        }}
                      >
                        <img src={carLogos[brand]} alt={brand} className="w-8 h-8" />
                        <span className="text-sm">{brand}</span>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Sale Type Selection Modal */}
            <Dialog open={isSaleTypeOpen} onClose={() => setIsSaleTypeOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsSaleTypeOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>بيع / ايجار</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {saleTypeOptions.map((type) => (
                      <button
                        key={type}
                        className={`p-4 rounded-2xl text-lg font-medium ${
                          formData.saleType === type ? 'bg-yellow-400 text-black' : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, saleType: type }));
                          setIsSaleTypeOpen(false);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>





            {/* Currency Selection Modal */}
            <Dialog open={isCurrencyOpen} onClose={() => setIsCurrencyOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsCurrencyOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>العملة</Dialog.Title>
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

            {/* Car Type Selection Modal */}
            <Dialog open={isCarTypeOpen} onClose={() => setIsCarTypeOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsCarTypeOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>نوع السيارة</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {carTypeOptions.map((type) => (
                      <button
                        key={type.label}
                        className={`p-4 rounded-2xl text-lg font-medium flex flex-col items-center gap-3 ${
                          formData.carType === type.label
                            ? 'bg-yellow-400 text-black'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                              : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, carType: type.label }));
                          setIsCarTypeOpen(false);
                        }}
                      >
                        <div className="w-32 h-24 flex items-center justify-center">
                          <img src={type.image} alt={type.label} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-base">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Manufacturing Year Selection Modal */}
            <Dialog open={isManufacturingYearOpen} onClose={() => setIsManufacturingYearOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsManufacturingYearOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>سنة التصنيع</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {yearOptions.map((year) => (
                      <button
                        key={year}
                        className={`p-4 rounded-2xl text-lg font-medium ${
                          formData.manufacturingYear === year ? 'bg-yellow-400 text-black' : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, manufacturingYear: year }));
                          setIsManufacturingYearOpen(false);
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Color Selection Modal */}
            <Dialog open={isColorOpen} onClose={() => setIsColorOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsColorOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>اللون</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`p-4 rounded-2xl text-lg font-medium ${
                          formData.color === color
                            ? 'bg-yellow-400 text-black'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                              : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, color }));
                          setIsColorOpen(false);
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Seats Selection Modal */}
            <Dialog open={isSeatsOpen} onClose={() => setIsSeatsOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsSeatsOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>عدد المقاعد</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {seatOptions.map((seat) => (
                      <button
                        key={seat}
                        className={`p-6 rounded-2xl text-lg font-medium ${
                          formData.seats === seat ? 'bg-yellow-400 text-black' : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, seats: seat }));
                          setIsSeatsOpen(false);
                        }}
                      >
                        <span className="absolute top-2 right-2 text-xs opacity-50">مقاعد</span>
                        {seat}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Inner Part Selection Modal */}
            <Dialog open={isInnerpartOpen} onClose={() => setIsInnerpartOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 text-right shadow-xl transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsInnerpartOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Dialog.Title className="text-xl font-bold" style={{ fontFamily: 'Cairo' }}>الجزء الداخلي</Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {innerpartOptions.map((part) => (
                      <button
                        key={part}
                        className={`p-4 rounded-2xl text-lg font-medium ${
                          formData.innerpart === part
                            ? 'bg-yellow-400 text-black'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                              : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, innerpart: part }));
                          setIsInnerpartOpen(false);
                        }}
                      >
                        {part}
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

          </form>
        </div>
      </div>
      <style jsx global>{`
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

        select optgroup {
          font-family: 'Cairo';
          font-weight: 700;
          color: #111;
          background-color: #f8f8f8;
          padding: 8px;
        }

        select option {
          font-family: 'Noor';
          padding: 8px 16px;
          background-color: white;
          color: #333;
        }

        select option:hover {
          background-color: #FFF8E1;
        }

        select:focus option:checked {
          background: #FFD700 linear-gradient(0deg, #FFD700 0%, #FFD700 100%);
          color: black;
        }

        .error-field {
          border-color: rgb(239 68 68) !important;
          background-color: rgb(254 242 242) !important;
        }
        
        .error-field:focus {
          ring-color: rgb(239 68 68) !important;
          border-color: rgb(239 68 68) !important;
        }

        .phone-input-container {
          position: relative;
          z-index: 1;
        }

        .custom-phone-input .PhoneInputInput {
          width: 100% !important;
          padding: 12px 16px !important;
          border-radius: 9999px !important;
          border: 1px solid black !important;
          background: transparent !important;
          color: black !important;
          font-size: 16px !important;
          transition: all 0.2s ease !important;
          font-family: 'Noor', sans-serif !important;
        }
        .custom-phone-input .PhoneInputInput:hover {
          border-color: #facc15 !important;
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
          padding: 12px 20px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(0, 0, 0, 0.2) !important;
          background: #f8f9fa !important;
          color: black !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          font-family: 'Noor', sans-serif !important;
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
        .dark-phone-input .PhoneInputCountrySelect option:hover {
          background: #FFD700 !important;
          color: #111 !important;
        }
        .dark-phone-input .PhoneInputCountrySelect option:checked {
          background: #FFD700 !important;
          color: #111 !important;
        }
        .dark-phone-input .PhoneInputCountrySelectArrow {
          color: #FFD700 !important;
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
        .dark input[type="text"]:-webkit-autofill:active,
        .dark input[type="number"]:-webkit-autofill,
        .dark input[type="number"]:-webkit-autofill:hover,
        .dark input[type="number"]:-webkit-autofill:focus,
        .dark input[type="number"]:-webkit-autofill:active,
        .dark textarea:-webkit-autofill,
        .dark textarea:-webkit-autofill:hover,
        .dark textarea:-webkit-autofill:focus,
        .dark textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
          -webkit-text-fill-color: #FFD700 !important;
          background-color: #1f2937 !important;
          color: #FFD700 !important;
          border: 1px solid #FFD700 !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      `}</style>
    </Layout>
  );
};

export default AddCarListing; 