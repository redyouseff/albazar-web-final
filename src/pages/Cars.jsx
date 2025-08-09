import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from '@/components/PropertyCard';
import { Input } from "@/components/ui/input";
import Layout from '@/components/Layout';
import Spinner from '@/components/ui/spinner';
import searchIcon from "/images/Vector.svg"
import getAllCarsListingHook from '../Hook/listing/getAllCarsListingHook';
import background from "/images/proprties/WhatsApp Image 2025-03-23 at 05.18.04_af0b1e29 1.svg"
import CategoriesBar from '../components/CategoriesBar';
import { useDarkMode } from '../context/DarkModeContext';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Car } from 'lucide-react';

// Constants
const governorateOptions = [
  'دمشق', 'ريف دمشق', 'القنيطرة', 'درعا', 'السويداء', 'حمص', 'طرطوس',
  'اللاذقية', 'حماة', 'إدلب', 'حلب', 'الرقة', 'دير الزور', 'الحسكة'
];

const carBrands = [
  'تويوتا', 'هيونداي', 'كيا', 'نيسان', 'مرسيدس', 'بي ام دبليو', 'أودي', 
  'فورد', 'شيفروليه', 'بيجو', 'رينو', 'فولكس واجن'
];
  
const carTypes = ['كوبيه', 'سيدان', 'كروس اوفر', 'سيارة مكشوفة', 'سيارة رياضية', 'جيب', 'بيك أب', 'شاحنة صغيرة/فان'];
const fuelTypes = ['بنزين', 'كهرباء', 'غاز طبيعي', 'ديزل', 'هايبرد'];
const transmissionTypes = ['أوتوماتيك', 'يدوي/عادي'];
const importedOptions = ['أمريكا', 'اليابان', 'أوروبا', 'كندا', 'الخليج'];
const currencyOptions = [
  { value: 'دولار', label: 'دولار', flag: '🇺🇸' },
  { value: 'ليرة', label: 'ليرة', flag: '🇸🇾' }
];
const paymentMethods = ['كاش', 'تقسيط', 'كاش أو تقسيط'];
const colorOptions = [
  'أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'أصفر', 
  'بني', 'برتقالي', 'بنفسجي', 'ذهبي'
];
const doorOptions = ['2', '3', '4', '5'];
const seatOptions = ['2', '4', '5', '7', '8', '9'];
const innerpartOptions = ['قماش', 'جلد', 'فينيل', 'مختلط'];
const conditionOptions = ['جديد', 'مستعمل'];
const additionalFeatures = [
  'نظام بلوتوث',
  'شاشة لمس',
  'كاميرا خلفية',
  'حساسات ركن',
  'فتحة سقف',
  'مثبت سرعة'
];

// Function to get location name from coordinates
const getLocationName = async (lat, long) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=ar`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      // Extract relevant parts of the address
      const addressParts = data.display_name.split(',');
      // Return the first few meaningful parts (city, area, country)
      return addressParts.slice(0, 3).join(', ').trim();
    }
    return 'موقع غير معروف';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'موقع غير معروف';
  }
};

const Cars = () => {
  // Filter state
  const [filters, setFilters] = useState({
    city: '',
    brand: '',
    version: '',
    year: '',
    'Car Type': '',
    Imported: '',
    color: '',
    'inner part': '',
    'number of doors': '',
    'number of sets': '',
    'fuel type': '',
    'transmission type': '',
    currency: '',
    price: { gte: '', lte: '' },
    kilometers: { gte: '', lte: '' },
    'payment method': '',
    'additional features': '',
    Horsepower: '',
    'Engine Capacity': '',
    'property condition': '',
    'listing status': '',
    negotiable: '',
    post:true,
  });

  const { loading, error, listings, page, limit, totalPages, handlePageChange, handleLimitChange } = getAllCarsListingHook(filters);

  const { isDarkMode } = useDarkMode();

  // State for storing location names
  const [locationNames, setLocationNames] = useState({});
  const locationNamesRef = useRef({});
  
  // Update ref when state changes
  useEffect(() => {
    locationNamesRef.current = locationNames;
  }, [locationNames]);

  console.log(listings);
  
  // Load location names when listings change
  useEffect(() => {
    if (listings?.data && Array.isArray(listings.data)) {
      const loadLocations = async () => {
        const newLocationNames = {};
        
        for (const car of listings.data) {
          const carId = car._id || car.id;
          if (car.lat && car.long && !locationNamesRef.current[carId]) {
            const locationName = await getLocationName(car.lat, car.long);
            newLocationNames[carId] = locationName;
          }
        }
        
        if (Object.keys(newLocationNames).length > 0) {
          setLocationNames(prev => ({ ...prev, ...newLocationNames }));
        }
      };
      
      loadLocations();
    }
  }, [listings?.data]);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle range filter changes (for year, price, kilometers)
  const handleRangeFilterChange = (key, rangeKey, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [rangeKey]: value
      }
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === 'yes' ? '' : 'yes'
    }));
  };

  // Handle search
  const handleSearch = () => {
    // The hook will automatically re-fetch with new filters
    console.log('Searching with filters:', filters);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      city: '',
      brand: '',
      version: '',
      year: '',
      'Car Type': '',
      Imported: '',
      color: '',
      'inner part': '',
      'number of doors': '',
      'number of sets': '',
      'fuel type': '',
      'transmission type': '',
      currency: '',
      price: { gte: '', lte: '' },
      kilometers: { gte: '', lte: '' },
      'payment method': '',
      'additional features': '',
      Horsepower: '',
      'Engine Capacity': '',
      'property condition': '',
      'listing status': '',
      negotiable: ''
    };
    
    setFilters(defaultFilters);
    
    // Force a re-render and data reload by triggering the hook
    setTimeout(() => {
      console.log('Filters reset to default state');
    }, 100);
  };

  // Memoize processed listings data to avoid recalculating on every render
  const processedListings = useMemo(() => {
    if (!listings?.data || !Array.isArray(listings.data)) {
      return [];
    }
    
    return listings.data.map((car) => ({
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
      createdAt: car.createdAt ? new Date(car.createdAt).toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : "غير محدد",
      lat: car.lat,
      long: car.long,
      locationName: locationNames[car._id || car.id] || "جاري تحميل الموقع...",
      icon: <Car className="w-5 h-5" />,
      // Add missing fields from database
      imported: car.Imported || "غير محدد",
      engineCapacity: car["Engine Capacity"] || "غير محدد",
      horsepower: car.Horsepower || "غير محدد",
      drivetrain: car.Drivetrain || "غير محدد",
      manufacturingYear: car["Manufacturing Year"] || car.year || "غير محدد",
      carType: car["Car Type"] || "غير محدد",
      saleOrRent: car["sale or rent"] || "بيع",
      propertyCondition: car["property condition"] || "غير محدد",
      yearValue: car.year || "غير محدد",
      originalData: car
    }));
  }, [listings?.data, locationNames]);

  // Memoize most viewed properties
  const mostViewedCars = useMemo(() => {
    return processedListings.slice(0, 4);
  }, [processedListings]);

  // Memoize pagination info
  const paginationInfo = useMemo(() => {
    if (!listings?.paginate) {
      return {
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
        hasData: false
      };
    }
    
    return {
      currentPage: listings.paginate.currentPage,
      totalPages: listings.paginate.numbeOfPage,
      totalResults: listings.paginate.totalResults,
      hasData: true
    };
  }, [listings?.paginate]);

  // Memoize whether to show pagination
  const shouldShowPagination = useMemo(() => {
    return processedListings.length > 0 && paginationInfo.hasData && paginationInfo.totalPages > 1;
  }, [processedListings.length, paginationInfo.hasData, paginationInfo.totalPages]);

  // Memoize whether to show content
  const shouldShowContent = useMemo(() => {
    return !loading && !error && processedListings.length > 0;
  }, [loading, error, processedListings.length]);

  // Memoize pagination buttons array
  const paginationButtons = useMemo(() => {
    if (!paginationInfo.hasData || paginationInfo.totalPages <= 0) return [];
    return Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1);
  }, [paginationInfo.hasData, paginationInfo.totalPages]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Transform car data for PropertyCard
  const transformCarData = (car) => {   
    return {
      id: car.id,
      title: car.title,
      description: car.description,
      price: car.price,
      currency: car.currency || 'ليرة',
      image: car.image,
      location: car.location,
      type: car.type,
      brand: car.brand,
      version: car.version,
      year: car.year,
      mileage: car.mileage,
      createdAt: car.createdAt,
      lat: car.lat,
      long: car.long,
      locationName: car.locationName,
      icon: car.icon,
      // Pass additional fields to PropertyCard
      imported: car.imported,
      engineCapacity: car.engineCapacity,
      horsepower: car.horsepower,
      drivetrain: car.drivetrain,
      manufacturingYear: car.manufacturingYear,
      carType: car.carType,
      saleOrRent: car.saleOrRent,
      propertyCondition: car.propertyCondition,
      yearValue: car.yearValue,
      originalData: car.originalData
    };
  };

  return (
    <Layout>
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Categories Bar Section */}
        <CategoriesBar />

        {/* Mobile Filter Button */}
        <div className="sm:hidden flex justify-end w-[95%] mx-auto mt-4">
          <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <DrawerTrigger asChild>
              <button
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-[Noor] font-bold text-base border ${isDarkMode ? 'bg-gray-800 text-yellow-400 border-gray-700' : 'bg-[#FFED00] text-black border-yellow-300'} shadow-md`}
                aria-label="فلترة النتائج"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect y="4" width="24" height="2.5" rx="1.25" fill={isDarkMode ? '#FFD600' : '#111'} />
                  <rect y="10.75" width="24" height="2.5" rx="1.25" fill={isDarkMode ? '#FFD600' : '#111'} />
                  <rect y="17.5" width="24" height="2.5" rx="1.25" fill={isDarkMode ? '#FFD600' : '#111'} />
                </svg>
                <span>فلترة النتائج</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className={isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}>
              <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold text-lg font-[Noor]">فلترة النتائج</span>
                <DrawerClose asChild>
                  <button className="text-2xl font-bold px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="إغلاق الفلاتر">×</button>
                </DrawerClose>
              </div>
              {/* Filters Section (mobile) */}
              <div className="p-2 pb-6 max-h-[80vh] overflow-y-auto">
                {/* Filters Section */}
                <div className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-[#FFED00]'} relative px-2 md:px-8 w-full mx-auto rounded-[20px] my-4 border ${isDarkMode ? 'border-gray-700' : 'border-yellow-200'}`}>
                  <div className={`container mx-auto py-4 relative z-10 px-2 font-[Noor] text-right ${isDarkMode ? 'text-gray-100' : ''}`}>
                    {/* First Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="المحافظة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {governorateOptions.map(city => (
                            <SelectItem key={city} value={city} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="الماركة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {carBrands.map(brand => (
                            <SelectItem key={brand} value={brand} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Input
                        type="text"
                        placeholder="الموديل"
                        value={filters.version}
                        onChange={(e) => handleFilterChange('version', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />

                      <Input
                        type="number"
                        placeholder="سنة الصنع"
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                    </div>

                    {/* Third Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['Car Type']} onValueChange={(value) => handleFilterChange('Car Type', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="نوع السيارة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {carTypes.map(type => (
                            <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters.Imported} onValueChange={(value) => handleFilterChange('Imported', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="وارد" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {importedOptions.map(option => (
                            <SelectItem key={option} value={option} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fourth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['fuel type']} onValueChange={(value) => handleFilterChange('fuel type', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="نوع الوقود" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {fuelTypes.map(type => (
                            <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['transmission type']} onValueChange={(value) => handleFilterChange('transmission type', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="ناقل الحركة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {transmissionTypes.map(type => (
                            <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fifth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Input
                        type="number"
                        placeholder="السعر من"
                        value={filters.price.gte}
                        onChange={(e) => handleRangeFilterChange('price', 'gte', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                      <Input
                        type="number"
                        placeholder="السعر إلى"
                        value={filters.price.lte}
                        onChange={(e) => handleRangeFilterChange('price', 'lte', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                    </div>

                    {/* Sixth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Input
                        type="number"
                        placeholder="كم من"
                        value={filters.kilometers.gte}
                        onChange={(e) => handleRangeFilterChange('kilometers', 'gte', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                      <Input
                        type="number"
                        placeholder="كم إلى"
                        value={filters.kilometers.lte}
                        onChange={(e) => handleRangeFilterChange('kilometers', 'lte', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                    </div>

                    {/* Seventh Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['number of doors']} onValueChange={(value) => handleFilterChange('number of doors', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عدد الأبواب" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {doorOptions.map(door => (
                            <SelectItem key={door} value={door} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{door} أبواب</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['number of sets']} onValueChange={(value) => handleFilterChange('number of sets', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عدد المقاعد" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {seatOptions.map(seat => (
                            <SelectItem key={seat} value={seat} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{seat} مقاعد</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Eighth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="العملة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {currencyOptions.map(currency => (
                            <SelectItem key={currency.value} value={currency.value} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">
                              <span className="flex items-center gap-2">
                                <span>{currency.flag}</span>
                                <span>{currency.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['payment method']} onValueChange={(value) => handleFilterChange('payment method', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="طريقة الدفع" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {paymentMethods.map(method => (
                            <SelectItem key={method} value={method} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ninth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="اللون" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {colorOptions.map(color => (
                            <SelectItem key={color} value={color} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['inner part']} onValueChange={(value) => handleFilterChange('inner part', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="الجزء الداخلي" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {innerpartOptions.map(part => (
                            <SelectItem key={part} value={part} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{part}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tenth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['property condition']} onValueChange={(value) => handleFilterChange('property condition', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="الحالة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {conditionOptions.map(condition => (
                            <SelectItem key={condition} value={condition} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{condition}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder="قوة المحرك (حصان)"
                        value={filters.Horsepower}
                        onChange={(e) => handleFilterChange('Horsepower', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                    </div>

                    {/* Eleventh Row */}
                    <div className="grid grid-cols-1 gap-2 mb-3" dir="rtl">
                      <Input
                        type="number"
                        placeholder="سعة المحرك (سي سي)"
                        value={filters['Engine Capacity']}
                        onChange={(e) => handleFilterChange('Engine Capacity', e.target.value)}
                        className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-4" dir="rtl">
                      <button 
                        onClick={handleResetFilters}
                        className={`flex items-center justify-center gap-2 rounded-full px-4 h-[42px] font-medium text-sm cursor-pointer border transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-500 hover:bg-gray-700' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                      >
                        <span>مسح الكل</span>
                      </button>
                      <DrawerClose asChild>
                        <button 
                          onClick={handleSearch}
                          className={`flex items-center justify-center gap-2 rounded-full px-4 h-[42px] font-medium text-sm cursor-pointer border transition-all ${isDarkMode ? 'bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-300' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                        >
                          <span>بحث</span>
                          <img src={searchIcon} alt="search" className="w-4 h-4" />
                        </button>
                      </DrawerClose>
                    </div>
                  </div>
                  <img src={background} alt="background" className={`absolute inset-0 w-full h-full object-cover opacity-30 rounded-[20px] pointer-events-none ${isDarkMode ? 'mix-blend-luminosity' : ''}`} />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Desktop/Tablet Filters Section */}
        <div className="hidden sm:block">
          {/* Header Section */}
          <div className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-[#FFED00]'} relative px-2 sm:px-4 md:px-8 w-[95%] mx-auto rounded-[20px] sm:rounded-[30px] my-4 sm:my-8 border ${isDarkMode ? 'border-gray-700' : 'border-yellow-200'}`}>
          <div className={`container mx-auto py-6 relative z-10 px-4 font-[Noor] text-right ${isDarkMode ? 'text-gray-100' : ''}`}>
            {/* First Row */}
            <div className="grid grid-cols-4 gap-3 mb-3" dir="rtl">
              <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="المحافظة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {governorateOptions.map(city => (
                    <SelectItem key={city} value={city} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="الماركة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {carBrands.map(brand => (
                    <SelectItem key={brand} value={brand} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder="الموديل"
                value={filters.version}
                onChange={(e) => handleFilterChange('version', e.target.value)}
                className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
              />

              <Input
                type="number"
                placeholder="سنة الصنع"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-3 mb-3" dir="rtl">
              <Select value={filters['Car Type']} onValueChange={(value) => handleFilterChange('Car Type', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="نوع السيارة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {carTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.Imported} onValueChange={(value) => handleFilterChange('Imported', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="وارد" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {importedOptions.map(option => (
                    <SelectItem key={option} value={option} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-4 gap-3 mb-3" dir="rtl">
              <Select value={filters['number of doors']} onValueChange={(value) => handleFilterChange('number of doors', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عدد الأبواب" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {doorOptions.map(door => (
                    <SelectItem key={door} value={door} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{door} أبواب</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['number of sets']} onValueChange={(value) => handleFilterChange('number of sets', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عدد المقاعد" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {seatOptions.map(seat => (
                    <SelectItem key={seat} value={seat} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{seat} مقاعد</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['fuel type']} onValueChange={(value) => handleFilterChange('fuel type', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="نوع الوقود" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {fuelTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['transmission type']} onValueChange={(value) => handleFilterChange('transmission type', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="ناقل الحركة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {transmissionTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-4 gap-3 mb-3" dir="rtl">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="السعر من"
                  value={filters.price.gte}
                  onChange={(e) => handleRangeFilterChange('price', 'gte', e.target.value)}
                  className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                />
                <Input
                  type="number"
                  placeholder="السعر إلى"
                  value={filters.price.lte}
                  onChange={(e) => handleRangeFilterChange('price', 'lte', e.target.value)}
                  className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                />
              </div>

              <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="العملة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {currencyOptions.map(currency => (
                    <SelectItem key={currency.value} value={currency.value} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">
                      <span className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="كم من"
                  value={filters.kilometers.gte}
                  onChange={(e) => handleRangeFilterChange('kilometers', 'gte', e.target.value)}
                  className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                />
                <Input
                  type="number"
                  placeholder="كم إلى"
                  value={filters.kilometers.lte}
                  onChange={(e) => handleRangeFilterChange('kilometers', 'lte', e.target.value)}
                  className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
                />
              </div>

              <Select value={filters['payment method']} onValueChange={(value) => handleFilterChange('payment method', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="طريقة الدفع" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fifth Row */}
            <div className="grid grid-cols-4 gap-3 mb-3" dir="rtl">
              <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="اللون" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {colorOptions.map(color => (
                    <SelectItem key={color} value={color} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['inner part']} onValueChange={(value) => handleFilterChange('inner part', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="الجزء الداخلي" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {innerpartOptions.map(part => (
                    <SelectItem key={part} value={part} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{part}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['property condition']} onValueChange={(value) => handleFilterChange('property condition', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="الحالة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {conditionOptions.map(condition => (
                    <SelectItem key={condition} value={condition} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3">{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="قوة المحرك (حصان)"
                value={filters.Horsepower}
                onChange={(e) => handleFilterChange('Horsepower', e.target.value)}
                className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
              />
            </div>

            {/* Sixth Row */}
            <div className="grid grid-cols-3 gap-3 mb-3" dir="rtl">
              <Input
                type="number"
                placeholder="سعة المحرك (سي سي)"
                value={filters['Engine Capacity']}
                onChange={(e) => handleFilterChange('Engine Capacity', e.target.value)}
                className={`rounded-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-4" dir="rtl">
              <div className="flex gap-3">
                <button 
                  onClick={handleResetFilters}
                  className={`flex items-center gap-2 rounded-full px-4 h-[42px] font-medium text-sm cursor-pointer border transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-500 hover:bg-gray-700' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                >
                  <span>مسح الكل</span>
                </button>
                <button 
                  onClick={handleSearch}
                  className={`flex items-center gap-2 rounded-full px-4 h-[42px] font-medium text-sm cursor-pointer border transition-all ${isDarkMode ? 'bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-300' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                >
                  <span>بحث</span>
                  <img src={searchIcon} alt="search" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <img src={background} alt="background" className={`absolute inset-0 w-full h-full object-cover opacity-30 rounded-[30px] pointer-events-none ${isDarkMode ? 'mix-blend-luminosity' : ''}`} />
        </div>
        </div>

        {/* App Store Links */}
        <div className="container mx-auto py-4 sm:py-6 flex flex-row justify-center items-center gap-3 sm:gap-4 px-4">
          <img src="/images/App Store  White.png" alt="App Store" className="h-16" />
          <img src="/images/Google Play.png" alt="Google Play" className="h-16" />
        </div>

        {/* Cars Grid */}
        <div className="container mx-auto py-8 sm:py-12 px-4">
          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-32">
              <Spinner />
            </div>
          ) : processedListings?.length === 0 ? (
            <div className="text-center py-16 sm:py-32 px-4">
              <div className="mb-4 sm:mb-6">
                <svg className="mx-auto h-16 sm:h-20 w-16 sm:w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-[Noor] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>لا توجد سيارات</h3>
              <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-[Noor] max-w-md mx-auto`}>لم يتم العثور على أي سيارات تطابق معايير البحث الخاصة بك</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className={`text-2xl sm:text-3xl font-bold font-[Noor] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>نتائج البحث</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {processedListings?.map((car) => (
                <PropertyCard
                  key={car.id}
                  property={transformCarData(car)}
                    layout="horizontal"
                />
              ))}
            </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {listings?.paginate && (
          <div className="flex justify-center items-center space-x-reverse space-x-2 mt-12 mb-16">
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

        {/* Most Viewed Section */}
        {!loading && processedListings?.length > 0 && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-12 sm:py-16`}>
            <div className="container mx-auto px-4">
              <h2 className={`text-2xl sm:text-3xl font-bold text-right mb-8 sm:mb-10 font-[Noor] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>الأكثر بحثا في السيارات</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {mostViewedCars.map((car) => (
                  <PropertyCard
                    key={car.id}
                    property={transformCarData(car)}
                    layout="vertical"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cars; 