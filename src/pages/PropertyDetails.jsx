import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../components/ui/spinner';
import image1 from "/images/spesificProptie/al-zaytouna-boutique.png"
import image2 from "/images/spesificProptie/v1_15_04_2025-13_49_04-4000-e02b5f50d064103233b3adee3b96a510_l_lis 3.png"
import image3 from "/images/spesificProptie/v1_15_04_2025-13_49_04-4000-e02b5f50d064103233b3adee3b96a510_l_lis 4.png"
import image4 from "/images/spesificProptie/v1_15_04_2025-13_49_04-4000-e02b5f50d064103233b3adee3b96a510_l_lis 5.png"
import image5 from "/images/spesificProptie/v1_15_04_2025-13_49_04-4000-e02b5f50d064103233b3adee3b96a510_l_lis 6.png"
import icon1 from "/images/spesificProptie/images 1.svg"
import icon2 from "/images/spesificProptie/Vector.svg";
import icon3 from "/images/spesificProptie/Vector (1).svg"

import icon4 from "/images/spesificProptie/Vector (2).svg"
import icon5 from "/images/spesificProptie/Vector (3).svg"
import icon6 from "/images/spesificProptie/Vector (4).svg"
import icon7 from "/images/spesificProptie/Vector (5).svg"

import logo1 from "/images/spesificProptie/Vector (11).svg"
import logo2 from "/images/spesificProptie/Vector (6).svg"
import logo3 from "/images/spesificProptie/Vector (7).svg"
import logo4 from "/images/spesificProptie/Vector (8).svg"
import logo5 from "/images/spesificProptie/Vector (9).svg"
import logo6 from "/images/spesificProptie/Group 1.svg"
import logo7 from "/images/spesificProptie/Vector (10).svg"
import logo8 from "/images/spesificProptie/Frame 220.svg"


import locationDarkmode from "/images/proprties/rent/Location.svg"
import bedsDarkmode from "/images/proprties/rent/Beds.svg";
import bathsDarkmode from "/images/proprties/rent/bath.svg";
import sizeDarkmode from "/images/proprties/rent/Size.svg";


import chatIconDarkmode from "/images/spesificProptie/Chat icon Yellow.svg"
import negotiobleDarkmode from "/images/spesificProptie/negotiable Yellow.svg"

import commercialDarkmode from "/images/proprties/bulding/Commercial.svg";
import commercial from "/images/proprties/bulding/Commercial Black 000.svg";



import carDarkmode from "/images/spesificProptie/car yellow.svg";
import fuelDarkmode from "/images/spesificProptie/fuel Yellow.svg";
import kilometerDarkmode from "/images/spesificProptie/Km Yellow.svg";
import dataDarkmode from "/images/spesificProptie/Date yellow.svg";

import car from "/images/spesificProptie/Car Black 000.svg";
import fuel from "/images/spesificProptie/Fuel Black 000.svg";
import kilometer from "/images/spesificProptie/Km Black 000.svg";
import dataicon from "/images/spesificProptie/Date Black 000.svg";

import Electricdarkmode from "/images/spesificProptie/Electric Mirror 4.svg";
import ABSdarkmode  from "/images/spesificProptie/ABS Brakes 5.svg";
import Blinddarkmode  from "/images/spesificProptie/Blind Eye System 1.svg";
import Airbagsdarkmode from "/images/spesificProptie/Airbags 2.svg";
import Speed_controldarkmode from "/images/spesificProptie/Speed control 3.svg";

import Electric from "/images/spesificProptie/Electric Mirror Yellow.svg";
import ABS  from "/images/spesificProptie/ABS Brakes Yellow.svg";
import Blind  from "/images/spesificProptie/Blind Eye System Yellow.svg";
import Airbags from "/images/spesificProptie/Airbags Yellow.svg";
import Speed_control from "/images/spesificProptie/Speed control Yellow.svg";






import inside_out from "/images/proprties/bulding/inside-out black 000.svg";

import inside_outdarkmode from "/images/proprties/bulding/inside-out yellow.svg";



import ListingByIdHook from '../Hook/listing/listingByIdHook';
import CategoriesBar from '../components/CategoriesBar';
import { useDarkMode } from '../context/DarkModeContext';






const PropertyDetails = () => {
  const { id } = useParams(); 
  const { isDarkMode } = useDarkMode();
  
  // State for image gallery modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 
 
  const {
    loading,
    error,
    listing,
    isSuccess 
} = ListingByIdHook(id)


  let data = {};
  if (loading === false && isSuccess) {
    data = listing?.data;
    
  }

  // Function to get the correct user ID
  const getUserId = () => {
    const userId = data?.userId || data?.user_id || data?.user?._id || data?.user;
    return userId || '';
  };

  // Function to get the correct user name
  const getUserName = () => {
    const name = data?.userName || 
                 data?.user?.firstname || 
                 data?.user?.name || 
                 data?.name || 
                 (data?.user?.firstname && data?.user?.lastname ? 
                   `${data.user.firstname} ${data.user.lastname}` : null) ||
                 "اسم المستخدم";
    return name;
  };

  // Function to get the correct user image
  const getUserImage = () => {
    return data?.userImage || data?.user?.profileImage || data?.profileImage || '';
  };

  // Function to build chat URL with validation
  const buildChatUrl = () => {
    const userId = getUserId();
    const userName = getUserName();
    const userImage = getUserImage();
    
    // Validate user ID exists
    if (!userId) {
      return '/chat'; // Fallback to general chat
    }
    
    return `/chat?userId=${userId}&userName=${encodeURIComponent(userName)}&userImage=${encodeURIComponent(userImage)}`;
  };

  // Function to determine the type of listing based on available fields
  const getListingType = (data) => {
    if (!data) return 'unknown';
    
    // Check for car-specific fields
    if (data.brand ||  data["Car Type"]) {
      return 'car';
    }
    
    // Check for buildings and lands (has property type but no rooms/bathrooms)
    if (data["property type"] && !data["number of rooms"] && !data["number of bathrooms"]) {
      return 'land';
    }
    
    // Check for rental properties
    if ((data["sale or rent"] === "rent" || data["sale or rent"] === "إيجار") && data["rental fees"]) {
      return 'rent';
    }
    
    // Check for sale properties
    if ((data["sale or rent"] === "sale" || data["sale or rent"] === "بيع") && data["property type"]) {
      return 'sale';
    }
    
    // Fallback checks
    // if (data["property type"] && (data["number of rooms"] || data["number of bathrooms"])) {
    //   return data["sale or rent"] === "rent" ? 'rent' : 'sale';
    // }
    
    return 'unknown';
  };

  const listingType = getListingType(data);

  // Function to get all images
  const getAllImages = () => {
    if (data?.images && data.images.length > 0) {
      return data.images;
    }
    return [image1, image2, image3, image4, image5];
  };

  // Function to open image modal
  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  // Function to close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Function to go to next image
  const nextImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Function to go to previous image
  const previousImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Function to handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isImageModalOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeImageModal();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        previousImage();
        break;
      default:
        break;
    }
  };

  // Add keyboard event listener
  useState(() => {
    const handleKeyDownWrapper = (e) => handleKeyDown(e);
    document.addEventListener('keydown', handleKeyDownWrapper);
    return () => {
      document.removeEventListener('keydown', handleKeyDownWrapper);
    };
  });

  // Function to render property info based on type
  const renderPropertyInfo = () => {
    switch (listingType) {
      case 'car':
        return (
          <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? carDarkmode : car} alt="brand" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.brand || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? dataDarkmode : dataicon} alt="year" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.["Manufacturing Year"] || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? kilometerDarkmode : kilometer} alt="kilometers" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.kilometers ? `${data.kilometers} كم` : "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? fuelDarkmode : fuel} alt="fuel" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.["fuel type"]?.length > 0 ? data["fuel type"].join(", ") : "غير محدد"}</span>
            </div>
          </div>
        );
      case 'land':
        return (
          <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? locationDarkmode : icon4} alt="property location" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.city || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? commercialDarkmode : commercial} alt="property type" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.["property type"] || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? inside_outdarkmode : inside_out} alt="regulation" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.regulationStatus || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? sizeDarkmode : icon7} alt="area" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.area ? `${data.area} متر مربع` : "غير محدد"}</span>
            </div>
          </div>
        );
      case 'rent':
      case 'sale':
      default:
        return (
          <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? locationDarkmode : icon4} alt="property location" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.city || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? bedsDarkmode : icon5} alt="rooms" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.["number of rooms"] || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? bathsDarkmode : icon6} alt="bathrooms" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.["number of bathrooms"] || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? sizeDarkmode : icon7} alt="property area" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{data?.area ? `${data.area} متر مربع` : "غير محدد"}</span>
            </div>
          </div>
        );
    }
  };

  // Function to render detailed info based on type
  const renderDetailedInfo = () => {
    const baseInfo = [
      { label: "رقم الإعلان", value: data?.id || "غير محدد" },
      { label: "رقم الهاتف", value: data?.["phone number"] || "غير محدد" },
      { label: "طريقة التواصل", value: data?.["contact method"]?.length > 0 ? data["contact method"].join(", ") : "غير محدد" },
      { label: "تم النشر من قبل", value: data?.publishedVia || "غير محدد" }
    ];

    const specificInfo = [];

    switch (listingType) {
      case 'car':
        specificInfo.push(
          { label: "الماركة", value: data?.brand || "غير محدد" },
          { label: "نوع السيارة", value: data?.["Car Type"] || "غير محدد" },
          { label: "سنة الصنع", value: data?.["Manufacturing Year"] || "غير محدد" },
          { label: "الكيلومترات", value: data?.kilometers ? `${data.kilometers} كم` : "غير محدد" },
          { label: "نوع الوقود", value: data?.["fuel type"]?.length > 0 ? data["fuel type"].join(", ") : "غير محدد" },
          { label: "نوع النقل", value: data?.["transmission type"] || "غير محدد" },
          { label: "اللون", value: data?.color || "غير محدد" },
          { label: "الجزء الداخلي", value: data?.["inner part"] || "غير محدد" },
          { label: "عدد المقاعد", value: data?.["number of sets"] || "غير محدد" },
          { label: "عدد الأبواب", value: data?.["number of doors"] || "غير محدد" },
          { label: "القوة الحصانية", value: data?.Horsepower ? `${data.Horsepower} حصان` : "غير محدد" },
          { label: "سعة المحرك", value: data?.["Engine Capacity"] ? `${data["Engine Capacity"]} سم³` : "غير محدد" },
          { label: "نوع الدفع", value: data?.Drivetrain || "غير محدد" },
          { label: "مستوردة من", value: data?.Imported || "غير محدد" },
          { label: "الدفعة الأولى", value: data?.["down payment"] ? `${data["down payment"]} ${data?.currency || "ليرة"}` : "غير محدد" },
          { label: "حالة السيارة", value: data?.["property condition"] || "غير محدد" },
          { label: "طريقة الدفع", value: data?.["payment method"] || "غير محدد" }
        );
        break;

      case 'land':
        specificInfo.push(
          { label: "نوع العقار", value: data?.["property type"] || "غير محدد" },
          { label: "المساحة", value: data?.area ? `${data.area} متر مربع` : "غير محدد" },
          { label: "حالة التنظيم", value: data?.regulationStatus || "غير محدد" },
          { label: "طريقة الدفع", value: data?.["payment method"] || "غير محدد" }
        );
        break;

      case 'rent':
        specificInfo.push(
          { label: "نوع العقار", value: data?.["property type"] || "غير محدد" },
          { label: "المساحة", value: data?.area ? `${data.area} متر مربع` : "غير محدد" },
          { label: "عدد الغرف", value: data?.["number of rooms"] || "غير محدد" },
          { label: "عدد الحمامات", value: data?.["number of bathrooms"] || "غير محدد" },
          { label: "الطابق", value: data?.floor ? `الطابق ${data.floor}` : "غير محدد" },
          { label: "حالة التنظيم", value: data?.regulationStatus || "غير محدد" },
          { label: "مفروش", value: data?.furnishing !== undefined ? (data.furnishing ? "نعم" : "لا") : "غير محدد" },
          { label: "عمر المبنى", value: data?.["building age"] ? `${data["building age"]} سنة` : "غير محدد" },
          { label: "عدد الصالونات", value: data?.["number of livingRooms"] || "غير محدد" },
          { label: "عدد طوابق المبنى", value: data?.["number of building floors"] || "غير محدد" },
          { label: "الضمان", value: data?.["security deposit"] ? `${data["security deposit"]} ${data?.currency || "ليرة"}` : "غير محدد" },
          { label: "مدة الإيجار", value: data?.["rental rate"] || "غير محدد" }
        );
        break;

      case 'sale':
      default:
        specificInfo.push(
          { label: "نوع العقار", value: data?.["property type"] || "غير محدد" },
          { label: "المساحة", value: data?.area ? `${data.area} متر مربع` : "غير محدد" },
          { label: "عدد الغرف", value: data?.["number of rooms"] || "غير محدد" },
          { label: "عدد الحمامات", value: data?.["number of bathrooms"] || "غير محدد" },
          { label: "الطابق", value: data?.floor ? `الطابق ${data.floor}` : "غير محدد" },
          { label: "حالة التنظيم", value: data?.regulationStatus || "غير محدد" },
          { label: "مفروش", value: data?.furnishing !== undefined ? (data.furnishing ? "نعم" : "لا") : "غير محدد" },
          { label: "عمر المبنى", value: data?.["building age"] ? `${data["building age"]} سنة` : "غير محدد" },
          { label: "عدد الصالونات", value: data?.["number of livingRooms"] || "غير محدد" },
          { label: "عدد طوابق المبنى", value: data?.["number of building floors"] || "غير محدد" },
          { label: "نوع الطابو", value: data?.deedType || "غير محدد" }
        );
        break;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {baseInfo.map((item, index) => (
          <div key={index} className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-white'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="font-semibold text-sm sm:text-base">{item.label}:</span>
              <div className="flex items-center gap-2">
                {item.label === "رقم الهاتف" ? (
                  <span className={`font-mono tracking-wide text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
                    {item.value !== "غير محدد" ? 
                      `${item.value.replace(/^\+/, "")}+` : 
                      item.value
                    }
                  </span>
                ) : (
                  <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>{item.value}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {specificInfo.map((item, index) => (
          <div key={`specific-${index}`} className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-800 text-purple-200' : 'bg-white'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="font-semibold text-sm sm:text-base">{item.label}:</span>
              <div className="flex items-center gap-2">
                {item.label === "رقم الهاتف" ? (
                  <span className={`font-mono tracking-wide text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
                    {item.value !== "غير محدد" ? 
                      `${item.value.replace(/^\+/, "")}+` : 
                      item.value
                    }
                  </span>
                ) : (
                  <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>{item.value}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner size="large" />
        </div>
      </Layout>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl font-medium mb-4">حدث خطأ في تحميل البيانات</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-black text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show message if no data found
  if (!loading && !data?._id) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-xl font-medium mb-4">
              {listingType === 'car' ? "لم يتم العثور على السيارة" : 
               listingType === 'land' ? "لم يتم العثور على الأرض/المبنى" : 
               "لم يتم العثور على العقار"}
            </p>
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
      <div className={`${isDarkMode ? 'bg-gray-900 text-purple-200' : 'w-full'}`}>


      <CategoriesBar />
        {/* Main Image Gallery */}
        <div className="max-w-[1312px] mx-auto px-4 sm:px-8 py-4">
          <div className="grid grid-rows-[300px_120px] sm:grid-rows-[400px_150px] lg:grid-rows-[500px_180px] gap-2">
            {/* Main Large Image */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={() => openImageModal(0)}>
              <img
                src={data?.images?.[0] || image1}
                alt={data?.["ad title"] || "عقار"}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Bottom Image Strip */}
            <div className="grid grid-cols-4 gap-2 h-full">
                                         
               {
                 data?.images?.length > 0 ? (
                   data.images.slice(1, 5).map((image, index) => (
                     <div key={index} className="rounded-xl sm:rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer" onClick={() => openImageModal(index + 1)}>
                       <img src={image} alt={`صورة ${index + 2}`} className="w-full h-full object-cover" />
              </div>
                   ))
                 ) : (
                   [image2, image3, image4, image5].map((image, index) => (
                     <div key={index} className="rounded-xl sm:rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer" onClick={() => openImageModal(index + 1)}>
                       <img src={image} alt={`صورة ${index + 2}`} className="w-full h-full object-cover" />
              </div>
                   ))
                 )
               }
            </div>
          </div>
        </div>

        {/* Account Info Bar */}
        <div className={`w-full border-y shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E9ECEF]'}`}>
          <div className="max-w-[1312px] mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4">
              {/* Right Section - Account Info */}
              <div className="flex items-center gap-2 sm:gap-3 mr-4 sm:mr-16">
                <Link 
                  to={`/user/${getUserId()}`} 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={getUserImage() || icon1} 
                      alt="صورة المستخدم" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = icon1; // Fallback to default icon if image fails to load
                      }}
                    />
                  </div>
                </Link>
                <Link 
                  to={`/user/${getUserId()}`} 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <span className={`text-sm sm:text-lg font-medium ${isDarkMode ? 'text-purple-200' : ''}`}>
                    {getUserName()}
                  </span>
                </Link>
              </div>
              {/* Left Section - Message */}
              <div className="flex items-center ml-4 sm:ml-48">
                <Link 
                  to={buildChatUrl()}
                  className="cursor-pointer hover:opacity-80 transition-opacity hover:scale-110"
                >
                  <img src={isDarkMode? chatIconDarkmode : icon2} alt="message" className="w-6 h-6 sm:w-8 sm:h-8" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className={`max-w-[1312px] mx-auto px-4 sm:px-8 mt-4 sm:mt-8`}>
          <div className={`w-full rounded-xl sm:rounded-2xl p-4 sm:p-6 border shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F6F9FF] border-[#E9ECEF]'}`}>
            {/* Price and Negotiable */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
              <div className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-purple-200' : ''}`}>
                {listingType === 'rent' ? (
                  <>
                    الأجرة: {data?.["rental fees"] ? `${data["rental fees"]} ${data?.currency || "ليرة"}` : "غير محدد"}
                    <span className={`text-xs sm:text-sm mr-2 ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>({data?.["rental rate"] || "شهرياً"})</span>
                  </>
                ) : listingType === 'car' && data?.["sale or rent"] === "إيجار" ? (
                  <>
                    أجرة السيارة: {data?.price ? `${data.price} ${data?.currency || "ليرة"}` : "غير محدد"}
                    {data?.["down payment"] && (
                      <span className={`text-xs sm:text-sm mr-2 ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>(دفعة أولى: {data["down payment"]} {data?.currency || "ليرة"})</span>
                    )}
                  </>
                ) : (
                  <>
                    السعر: {data?.price ? `${data.price} ${data?.currency || "ليرة"}` : "غير محدد"}
                  </>
                )}
              </div>
              {data?.negotiable && (
              <div className="flex items-center gap-2">
                <img src={isDarkMode? negotiobleDarkmode : icon3} alt="negotiable" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>قابل للتفاوض</span>
              </div>
              )}
            </div>

            <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-purple-200' : ''}`}>
              {data?.["ad title"] || (
                listingType === 'car' ? `${data?.brand || "سيارة"} ${data?.["Manufacturing Year"] || ""}` : 
                listingType === 'land' ? `${data?.["property type"] || "أرض/مبنى"} للبيع` : 
                listingType === 'rent' ? `${data?.["property type"] || "عقار"} للإيجار` : 
                listingType === 'sale' ? `${data?.["property type"] || "عقار"} للبيع` : 
                "عنوان المنشور"
              )}
            </h2>

            {renderPropertyInfo()}

            <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
              {data?.description || "لوريم ايبسوم هو نموذج افتراضي يوضع في التصاميم لتعرض على العميل ليتصور طريقة وضع النصوص بالتصاميم سواء كانت تصاميم مطبوعة ... بروشور او فلاير على سبيل المثال ... او نماذج مواقع انترنت"}
            </p>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="max-w-[1312px] mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className={`w-full rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#F6F9FF] border-[#E9ECEF]'}`}>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-purple-200' : ''}`}>معلومات إضافية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-900 text-purple-200' : 'bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm sm:text-base">نوع الإعلان:</span>
                  <span className="text-blue-600 text-sm sm:text-base">
                    {listingType === 'car' ? 
                      (data?.["sale or rent"] === "إيجار" ? "سيارة للإيجار" : "سيارة للبيع") : 
                      listingType === 'land' ?
                      (data?.["sale or rent"] === "بيع" ? "أرض/مبنى للبيع" : "أرض/مبنى") :
                      listingType === 'rent' ? "عقار للإيجار" :
                      listingType === 'sale' ? "عقار للبيع" : "غير محدد"
                    }
                  </span>
                </div>
              </div>
              
              <div className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-900 text-purple-200' : 'bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm sm:text-base">تاريخ النشر:</span>
                  <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
                    {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('ar-EG') : "غير محدد"}
                  </span>
                </div>
              </div>
              
              <div className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-900 text-purple-200' : 'bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm sm:text-base">حالة الإعلان:</span>
                  <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>
                    {data?.post ? "منشور" : data?.rejected ? "مرفوض" : "معلق"}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Information */} 
            <div className={`mt-4 sm:mt-6 pt-4 sm:pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? 'text-purple-200' : ''}`}>التفاصيل الكاملة</h4>
              {renderDetailedInfo()}
            </div>
          </div>
        </div>

        {/* Amenities/Features Section */}
        {((data?.amenities && data.amenities.length > 0) || (data?.["additional features"] && data["additional features"].length > 0)) && (
        <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} mt-4 sm:mt-6`}>
          <div className="max-w-[1312px] mx-auto px-4 sm:px-8 py-4 sm:py-10 lg:py-12">
              <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-8 lg:mb-10 font-[Cairo] text-right ${isDarkMode ? 'text-purple-200' : ''}`}>
                {listingType === 'car' ? 'المميزات الإضافية' : 'المرافق و وسائل الراحة'}
              </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                          gap-4 sm:gap-6 md:gap-8 lg:gap-10 
                          max-w-7xl mx-auto">
                {/* Render amenities for properties */}
                {data?.amenities && data.amenities.map((amenity, index) => {
                  // Map amenities to icons
                  const getAmenityIcon = (amenity) => {
                    switch(amenity) {
                      case 'بلكونة': return logo3;
                      case 'حديقة خاصة': return logo1;
                      case 'أجهزة المطبخ': return logo5;
                      case 'موقف خاص': return logo4;
                      case 'غرفة خادمة': return logo2;
                      case 'غاز مركزي': return logo6;
                      case 'حمام سباحة': return logo7;
                      case 'مصعد': return logo8;
                      case 'تدفئة مركزية': return logo2;
                      case 'تكييف مركزي': return logo2;
                      default: return logo1;
                    }
                  };
                  
                  return (
                    <div key={index} className={`text-center ${isDarkMode ? 'text-purple-200' : ''}`}>
                <div className="mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                        <img src={getAmenityIcon(amenity)} alt={amenity} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                </div>
                      <span className="text-xs sm:text-sm md:text-base font-[Noor]">{amenity}</span>
              </div>
                  );
                })}
                
                {/* Render additional features for cars */}
                {data?.["additional features"] && data["additional features"].map((feature, index) => {
                  // Map car features to icons
                  const getCarFeatureIcon = (feature) => {
                    switch(feature) {
                      case 'نظام الفرامل ABS': return isDarkMode ? ABSdarkmode : ABS;
                      case 'مرايا كهربائية': return isDarkMode ? Electricdarkmode : Electric;
                      case 'نظام النقطة العمياء': return isDarkMode ? Blinddarkmode : Blind;
                      case 'وسائد هوائية': return isDarkMode ? Airbagsdarkmode : Airbags;
                      case 'مثبت سرعة': return isDarkMode ? Speed_controldarkmode : Speed_control;
                      case 'قفل مركزي': return logo8;
                      case 'كاميرا خلفية': return logo3;
                      case 'نظام ملاحة GPS': return logo4;
                      case 'تكييف هواء': return logo1;
                      case 'نوافذ كهربائية': return logo5;
                      case 'مقاعد جلدية': return logo6;
                      case 'نظام صوتي': return logo7;
                      default: return logo1;
                    }
                  };
                  
                  return (
                    <div key={`car-${index}`} className={`text-center ${isDarkMode ? 'text-purple-200' : ''}`}>
                <div className="mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                        <img src={getCarFeatureIcon(feature)} alt={feature} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                </div>
                      <span className="text-xs sm:text-sm md:text-base font-[Noor]">{feature}</span>
              </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Geographic Location Section */}
        {data?.lat && data?.long && (
        <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} mt-4 sm:mt-6`}>
          <div className="max-w-[1312px] mx-auto px-4 sm:px-8 py-4 sm:py-6">
            <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-purple-200' : ''}`}>الموقع الجغرافي</h3>
              
              {/* Location Info */}
              <div className={`mb-4 p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <img src={isDarkMode ? locationDarkmode : icon4} alt="location" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">الموقع:</span>
                  <span className={`text-sm sm:text-base ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>{data?.["property location"] || data?.city || "موقع العقار"}</span>
                </div>
                <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                  <span>خط العرض: {parseFloat(data.lat).toFixed(6)}</span>
                  <span>خط الطول: {parseFloat(data.long).toFixed(6)}</span>
                </div>
              </div>

            <div className="w-full h-[300px] sm:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden">
              <iframe
                  src={`https://maps.google.com/maps?q=${data.lat},${data.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                  title={`موقع ${data?.["property location"] || "العقار"}`}
              ></iframe>
              </div>
              
              {/* Alternative fallback and additional options */}
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <a 
                  href={`https://www.google.com/maps?q=${data.lat},${data.long}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  <span>فتح في خرائط جوجل</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.long}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
                >
                  <span>الاتجاهات</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 animate-in fade-in duration-200" onClick={closeImageModal}>
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
              >
                <X size={24} />
              </button>

              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
              >
                <ChevronRight size={28} />
              </button>

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img
                  src={getAllImages()[currentImageIndex]}
                  alt={`صورة ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black bg-opacity-70 px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {getAllImages().length}
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-xs">
                استخدم الأسهم للتنقل أو ESC للإغلاق
              </div>
            </div>
          </div>
        )}

        {/* Custom Styles for Image Modal */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-in {
            animation: fadeIn 0.2s ease-in-out;
          }
          
          .fade-in {
            animation: fadeIn 0.2s ease-in-out;
          }
          
          /* تحسين مظهر الأزرار على الموبايل */
          @media (max-width: 768px) {
            .modal-button {
              padding: 12px !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default PropertyDetails;
