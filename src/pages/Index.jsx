import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, Home, MapPin, Bath, Maximize, Car, Building, Store } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import image1 from "/images/Rectangle 6.png";
import frame from "/images/Frame 376.png"
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import CategoriesBar from '../components/CategoriesBar';
import IndexListingHook from '../Hook/home/IndexListingHook';
import PropertyCard from '../components/PropertyCard';
import { useDarkMode } from '../context/DarkModeContext';
import googlePlayDarkmode from "/images/Google Play.png";
import appStoreDarkmode from "/images/App Store  White.png";


const Index = () => {
  const [activeReview, setActiveReview] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const {
    rentListings,
    sellListings,
    landListings,
    carListings,
    loading,
    error,
    refresh
  } = IndexListingHook();

  // Function to get appropriate icon based on property type
  const getPropertyIcon = (propertyType) => {
    if (propertyType === 'شقة') return <Home className="w-5 h-5" />;
    if (propertyType === 'تجارية') return <Store className="w-5 h-5" />;
    return <Building className="w-5 h-5" />;
  };

  const reviews = [
    {
      id: 1,
      name: 'محمد عبدالله',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: 'خدمة ممتازة وسرعة في الاستجابة. أنصح بالتعامل معهم',
      rating: 5
    },
    {
      id: 2,
      name: 'أحمد السيد',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'منصة رائعة وسهلة الاستخدام. وجدت العقار المناسب بسرعة',
      rating: 5
    },
    {
      id: 3,
      name: 'عبدالرحمن محمد',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      text: 'تجربة مميزة في البحث عن العقارات. شكراً لكم',
      rating: 5
    },
    {
      id: 4,
      name: 'خالد العتيبي',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      text: 'خدمة عملاء متميزة وسرعة في الرد على الاستفسارات',
      rating: 5
    },
    {
      id: 5,
      name: 'فهد السالم',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      text: 'أسعار تنافسية وخيارات متنوعة. موقع رائع',
      rating: 5
    }
  ];

  const sliderSettings = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 16,
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: { clickable: true },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  };

  // دوال تحويل الداتا كما في الصفحات المتخصصة
  const transformRentProperty = (property) => ({
    id: property._id || property.id,
    title: property["ad title"] || property.title || "عقار للإيجار",
    description: property.description || "لوريم إيبسوم (Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر.",
    price: `${property['rental fees'] || property.price || "000000"} ${property.currency || 'ليرة'}`,
    image: property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    location: property.location || property.city || "غير محدد",
    type: property["property type"] || "غير محدد",
    area: property.area ? `${property.area} متر مربع` : "غير محدد",
    rooms: property["number of rooms"] || "غير محدد",
    bathrooms: property["number of bathrooms"] || "غير محدد",
    createdAt: property.createdAt ? new Date(property.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد",
    regulationStatus: property.regulationStatus || "غير محدد",
    locationName: property.locationName || property.location || property.city || "غير محدد",
    icon: getPropertyIcon(property["property type"]),
    originalData: property
  });

  const transformSaleProperty = (property) => ({
    id: property._id,
    title: property["ad title"] || "عقار للبيع",
    description: property.description || "لوريم إيبسوم (Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر.",
    price: `${property.price || "000000"} ${property.currency || 'ليرة'}`,
    image: property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    location: property.location || "غير محدد",
    type: property["property type"] || "غير محدد",
    area: property.area ? `${property.area} متر مربع` : "غير محدد",
    rooms: property.rooms || "غير محدد",
    year: property.year || "غير محدد",
    regulationStatus: property.regulationStatus || "غير محدد",
    createdAt: property.createdAt ? new Date(property.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد",
    locationName: property.locationName || property.location || "غير محدد",
    icon: getPropertyIcon(property["property type"]),
    originalData: property
  });

  const transformLandProperty = (property) => ({
    id: property._id || property.id,
    title: property["ad title"] || property.title || "عنوان المنشور",
    description: property.description || "لوريم إيبسوم (Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر.",
    price: `${property.price || "000000"} ${property.currency || 'ليرة'}`,
    image: property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    location: property.location || property.city || "غير محدد",
    type: property["property type"] || "مبنى",
    area: property.area ? `${property.area} متر مربع` : "غير محدد",
    purpose: property.purpose || property["listing status"] || "غير محدد",
    regulationStatus: property.regulationStatus || "غير محدد",
    createdAt: property.createdAt ? new Date(property.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد",
    locationName: property.locationName || property.location || property.city || "غير محدد",
    icon: getPropertyIcon(property["property type"]),
    originalData: property
  });

  const transformCar = (car) => ({
    id: car._id || car.id,
    title: car["ad title"] || car.title || "عنوان المنشور",
    description: car.description || "لوريم إيبسوم (Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر.",
    price: `${car.price || "000000"} ${car.currency || 'ليرة'}`,
    currency: car.currency || 'ليرة',
    image: car.images && car.images.length > 0 ? car.images[0] : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    location: car.city || "غير محدد",
    type: 'سيارة',
    brand: car.brand || "غير محدد",
    version: car.version || "غير محدد",
    year: car.year || car["Manufacturing Year"] || "غير محدد",
    mileage: `${car.kilometers || 0} كم`,
    createdAt: car.createdAt ? new Date(car.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد",
    locationName: car.locationName || car.city || "غير محدد",
    icon: <Car className="w-5 h-5" />,
    originalData: car
  });

  const MainContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      );
    }

    return (
      <>
        <CategoriesBar />
        
        {/* Hero Section */}
        <section className={`relative ${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-8`}>
          <div className="max-w-[1312px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[546px] mx-auto relative" style={{ fontFamily: 'Cairo, Arial, sans-serif' }}>
            <img
              src={image1}
              alt="Hero"
              className="w-full h-full object-cover brightness-[0.85] sm:rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 sm:rounded-2xl" />
            <div className="absolute inset-0 flex flex-col justify-center">
              <div className="w-full px-6 sm:px-12 md:px-16 lg:pr-24">
                <div className="max-w-3xl text-right" style={{ direction: 'rtl' }}>
                  <h1 className="hero-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.4] mb-4 sm:mb-6 lg:mb-8">
                    تملك، أستأجر، اكتشف: كل ما
                  </h1>
                  <h1 className="hero-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.4] mb-4 sm:mb-6">
                    تريده في مكان واحد!
                  </h1>
                  <p className="hero-text text-lg sm:text-xl text-white/90 font-light leading-[1.8]">
                    سواء كنت تبحث عن شراء عقار او حتى استئجار سيارة تناسب
                    <br className="hidden sm:block" />
                    ذوقك، يوفر لك خدمة متكاملة، بخطوات سريعة وأسعار منافسة
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <a 
              href="https://play.google.com/store/apps/details?id=com.mohassan.albazar_ap&pcampaignid=web_share" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 w-[120px] sm:w-[150px] md:w-[180px]"
            >
              <img src={ googlePlayDarkmode } alt="Google Play" className="w-full" />
            </a>
            <a href="#" className="transition-transform hover:scale-105 w-[120px] sm:w-[150px] md:w-[180px]">
              <img src={ appStoreDarkmode } alt="App Store" className="w-full" />
            </a>
          </div>
        </section>

        {/* Properties for Rent Section */}
        <section id="rent" className={`py-8 md:py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-[1440px] mx-auto px-4 md:px-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-[Cairo]`}>عقارات للإيجار</h2>
              <Link to="/propertiesForRent" className="text-yellow-500 hover:text-yellow-600 font-medium text-base md:text-lg font-[Cairo]">
                عرض المزيد
              </Link>
            </div>
            <Swiper 
              {...sliderSettings}
              className="properties-swiper"
            >
              {rentListings.map((property) => (
                <SwiperSlide key={property._id}>
                  <PropertyCard property={transformRentProperty(property)} layout="vertical" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Properties for Sale Section */}
        <section id="sale" className={`py-8 md:py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-[1440px] mx-auto px-4 md:px-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-[Cairo]`}>عقارات للبيع</h2>
              <Link to="/propertiesForSale" className="text-yellow-500 hover:text-yellow-600 font-medium text-base md:text-lg font-[Cairo]">
                عرض المزيد
              </Link>
            </div>
            <Swiper 
              {...sliderSettings}
              className="properties-swiper"
            >
              {sellListings.map((property) => (
                <SwiperSlide key={property._id}>
                  <PropertyCard property={transformSaleProperty(property)} layout="vertical" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Lands Section */}
        <section id="lands" className={`py-8 md:py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-[1440px] mx-auto px-4 md:px-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-[Cairo]`}>مباني و أراضي</h2>
              <Link to="/buildingsAndLands" className="text-yellow-500 hover:text-yellow-600 font-medium text-base md:text-lg font-[Cairo]">
                عرض المزيد
              </Link>
            </div>
            <Swiper 
              {...sliderSettings}
              className="properties-swiper"
            >
              {landListings.map((property) => (
                <SwiperSlide key={property._id}>
                  <PropertyCard property={transformLandProperty(property)} layout="vertical" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Cars Section */}
        <section id="cars" className={`py-8 md:py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-[1440px] mx-auto px-4 md:px-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-[Cairo]`}>سيارات</h2>
              <Link to="/cars" className="text-yellow-500 hover:text-yellow-600 font-medium text-base md:text-lg font-[Cairo]">
                عرض المزيد
              </Link>
            </div>
            <Swiper 
              {...sliderSettings}
              className="properties-swiper"
            >
              {carListings.map((car) => (
                <SwiperSlide key={car._id}>
                  <PropertyCard property={transformCar(car)} layout="vertical" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Reviews Section */}
        <section className={`py-12 sm:py-16 lg:py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 lg:mb-20 text-center tracking-wide ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-[Cairo]`}>
              اراء عملائنا في خدمات عالبازار
            </h2>
            <div className="relative">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination',
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                  },
                }}
                className="reviews-swiper"
              >
                {reviews.map((review, index) => (  
                  <SwiperSlide key={review.id}>
                    <div
                      className={`relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-[24px] sm:rounded-[32px] transition-all duration-300 hover:scale-105 hover:shadow-xl h-full`}
                    >
                      <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                        <p className={`text-right mb-4 sm:mb-6 lg:mb-8 text-xs sm:text-sm leading-[1.6] sm:leading-[1.8] ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-[Noon]`}>
                          {review.text}
                        </p>
                        <div className="flex flex-col items-center mt-auto space-y-2 sm:space-y-3">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-white"
                          />
                          <h4 className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-[Cairo]`}>
                            {review.name}
                          </h4>
                          <div className="flex justify-center gap-0.5" dir="ltr">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom Pagination */}
              <div className="swiper-pagination !bottom-0 !mt-6"></div>
            </div>
          </div>
          
          <style jsx global>{`
            .reviews-swiper {
              padding-bottom: 60px !important;
            }
            
            .reviews-swiper .swiper-pagination {
              position: relative !important;
              bottom: 0 !important;
              margin-top: 20px !important;
            }
            
            .reviews-swiper .swiper-pagination-bullet {
              width: 8px !important;
              height: 8px !important;
              background: #d1d5db !important;
              opacity: 1 !important;
            }
            
            .reviews-swiper .swiper-pagination-bullet-active {
              background: #fbbf24 !important;
            }
            
            /* توحيد شكل الكروت في Swiper */
            .swiper-slide {
              height: auto !important;
              display: flex !important;
            }
            
            .swiper-slide > div {
              width: 100% !important;
              height: 100% !important;
            }
            
            /* إخفاء أسهم التنقل في الموبايل لجميع الـ Swiper */
            @media (max-width: 768px) {
              .swiper-button-prev,
              .swiper-button-next {
                display: none !important;
              }
            }
            
            /* تحسين مظهر الكروت في Swiper */
            .swiper-container {
              padding-bottom: 20px !important;
            }
            
            .swiper-pagination {
              position: relative !important;
              bottom: 0 !important;
              margin-top: 16px !important;
            }
            
            .swiper-pagination-bullet {
              width: 8px !important;
              height: 8px !important;
              background: #d1d5db !important;
              opacity: 1 !important;
              margin: 0 4px !important;
            }
            
            .swiper-pagination-bullet-active {
              background: #fbbf24 !important;
            }
            
            /* توحيد شكل كروت العقارات */
            .properties-swiper {
              padding-bottom: 20px !important;
            }
            
            .properties-swiper .swiper-slide {
              height: auto !important;
              display: flex !important;
            }
            
            .properties-swiper .swiper-slide > div {
              width: 100% !important;
              height: 100% !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            .properties-swiper .swiper-pagination {
              position: relative !important;
              bottom: 0 !important;
              margin-top: 16px !important;
            }
            
            .properties-swiper .swiper-pagination-bullet {
              width: 8px !important;
              height: 8px !important;
              background: #d1d5db !important;
              opacity: 1 !important;
              margin: 0 4px !important;
            }
            
            .properties-swiper .swiper-pagination-bullet-active {
              background: #fbbf24 !important;
            }
            
            /* تحسين عرض النص العربي */
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
            
            @font-face {
              font-family: 'Cairo';
              src: url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
              font-display: swap;
            }
            
            /* ضمان عرض النص العربي بشكل صحيح */
            [dir="rtl"], [style*="direction: rtl"] {
              text-align: right;
              unicode-bidi: embed;
            }
            
            /* تحسين عرض النص في الهيرو سيكشن */
            .hero-text {
              font-family: 'Cairo', Arial, sans-serif !important;
              direction: rtl !important;
              unicode-bidi: embed !important;
              text-align: right !important;
              word-spacing: 0.1em !important;
              letter-spacing: 0.02em !important;
            }
            
            /* تحسين عرض النص العربي على الموبايل */
            @media (max-width: 768px) {
              .hero-text {
                font-size: 1.25rem !important;
                line-height: 1.6 !important;
                word-break: keep-all !important;
                overflow-wrap: normal !important;
              }
            }
          `}</style>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} dir="rtl">
        <MainContent />
      </div>
      <Footer />
    </>
  );
};

export default Index;
