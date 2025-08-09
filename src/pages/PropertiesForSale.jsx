import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from '@/components/PropertyCard';
import { Input } from "@/components/ui/input";
import Layout from '@/components/Layout';
import background from "/images/proprties/WhatsApp Image 2025-03-23 at 05.18.04_af0b1e29 1.svg"
import searchIcon from "/images/Vector.svg"
import getAllForSellHook from '../Hook/listing/getAllForSellHook';
import Spinner from '@/components/ui/spinner';
import CategoriesBar from '../components/CategoriesBar';
import { useDarkMode } from '../context/DarkModeContext';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';

import googlePlay from "/images/Google Play.png"
import appStore from "/images/App Store  White.png"



const PropertiesForSale = () => {
  const {
    loading,
    error,
    listings,
    page,
    limit,
    totalPages,
    filters,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    resetFilters
  } = getAllForSellHook();

  const { isDarkMode } = useDarkMode();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Options arrays from AddPropertyForSale component - exact match
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

  // تحويل بيانات العقار إلى الشكل المطلوب للـ PropertyCard
  const transformPropertyData = (property) => {
    return {
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
      createdAt: property.createdAt ? new Date(property.createdAt).toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : "غير محدد"
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
                          {governorateOptions.map(gov => (
                            <SelectItem key={gov} value={gov} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {gov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters.regulationStatus} onValueChange={(value) => handleFilterChange('regulationStatus', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="التنظيم" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {regulationOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters.publishedVia} onValueChange={(value) => handleFilterChange('publishedVia', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="صاحب الإعلان" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {publisherOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['property type']} onValueChange={(value) => handleFilterChange('property type', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="نوع العقار" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {propertyTypes.map(type => (
                            <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Third Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters.floor} onValueChange={(value) => handleFilterChange('floor', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="الطابق" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {floorOptions.map(floor => (
                            <SelectItem key={floor} value={floor} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {floor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder="المساحة بالمتر المربع"
                        value={filters.area || ''}
                        onChange={(e) => handleFilterChange('area', e.target.value)}
                        className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none px-4`}
                      />
                    </div>

                    {/* Fourth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="العملة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {currencyOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              <span className="flex items-center gap-2 justify-end">
                                <span>{opt.label}</span>
                                <span>{opt.flag}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder="السعر"
                        value={filters.price || ''}
                        onChange={(e) => handleFilterChange('price', e.target.value)}
                        className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none px-4`}
                      />
                    </div>

                    {/* Fifth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['number of rooms']} onValueChange={(value) => handleFilterChange('number of rooms', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عدد الغرف" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {roomOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['number of livingRooms']} onValueChange={(value) => handleFilterChange('number of livingRooms', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عدد الصالونات" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {livingRoomOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sixth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['number of bathrooms']} onValueChange={(value) => handleFilterChange('number of bathrooms', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عدد الحمامات" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {bathroomOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['number of building floors']} onValueChange={(value) => handleFilterChange('number of building floors', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عدد طوابق المبنى" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {floorOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Seventh Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['year']} onValueChange={(value) => handleFilterChange('year', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="عمر المبنى" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {buildingAgeOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['property condition']} onValueChange={(value) => handleFilterChange('property condition', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="حالة العقار" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {propertyConditionOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Eighth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['payment method']} onValueChange={(value) => handleFilterChange('payment method', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="طريقة الدفع" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {paymentOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['delivery conditions']} onValueChange={(value) => handleFilterChange('delivery conditions', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="شروط التسليم" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {deliveryOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ninth Row */}
                    <div className="grid grid-cols-2 gap-2 mb-3" dir="rtl">
                      <Select value={filters['deedType']} onValueChange={(value) => handleFilterChange('deedType', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="نوع الطابو" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {deedTypeOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters['contact method']} onValueChange={(value) => handleFilterChange('contact method', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="طريقة التواصل" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {contactOptions.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tenth Row */}
                    <div className="grid grid-cols-1 gap-2 mb-3" dir="rtl">
                      <Select value={filters['amenities']} onValueChange={(value) => handleFilterChange('amenities', value)}>
                        <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                          <SelectValue placeholder="الكماليات" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                        </SelectTrigger>
                        <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                          {amenities.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-wrap gap-2 mb-3" dir="rtl">
                      <button
                        onClick={() => handleFilterChange('furnishing', !filters.furnishing)}
                        className={`flex items-center gap-2 rounded-full px-3 h-[42px] font-medium text-sm cursor-pointer border-2 transition-all ${filters.furnishing ? 'border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'} ${isDarkMode ? 'bg-gray-900 text-gray-100 hover:bg-gray-700' : 'bg-white/0 text-black hover:bg-black/5'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${filters.furnishing ? 'bg-yellow-500 border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'}`}></div>
                        <span>مفروش</span>
                      </button>
                      <button
                        onClick={() => handleFilterChange('negotiable', !filters.negotiable)}
                        className={`flex items-center gap-2 rounded-full px-3 h-[42px] font-medium text-sm cursor-pointer border-2 transition-all ${filters.negotiable ? 'border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'} ${isDarkMode ? 'bg-gray-900 text-gray-100 hover:bg-gray-700' : 'bg-white/0 text-black hover:bg-black/5'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${filters.negotiable ? 'bg-yellow-500 border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'}`}></div>
                        <span>قابل للتفاوض</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-4" dir="rtl">
                      <button 
                        onClick={resetFilters}
                        className={`flex items-center justify-center gap-2 rounded-full px-4 h-[42px] font-medium text-sm cursor-pointer border transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-500 hover:bg-gray-700' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                      >
                        <span>مسح الكل</span>
                      </button>
                      <DrawerClose asChild>
                        <button 
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
          <div className={`container mx-auto py-4 sm:py-6 relative z-10 px-2 sm:px-4 font-[Noor] text-right ${isDarkMode ? 'text-gray-100' : ''}`}>
            {/* First Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3" dir="rtl">
              <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="المحافظة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {governorateOptions.map(gov => (
                    <SelectItem key={gov} value={gov} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {gov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.regulationStatus} onValueChange={(value) => handleFilterChange('regulationStatus', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="التنظيم" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {regulationOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.publishedVia} onValueChange={(value) => handleFilterChange('publishedVia', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="صاحب الإعلان" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {publisherOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['property type']} onValueChange={(value) => handleFilterChange('property type', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="نوع العقار" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.floor} onValueChange={(value) => handleFilterChange('floor', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="الطابق" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {floorOptions.map(floor => (
                    <SelectItem key={floor} value={floor} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3" dir="rtl">
              <Input
                type="number"
                placeholder="المساحة بالمتر المربع"
                value={filters.area || ''}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none px-4`}
              />

              <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="العملة" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {currencyOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      <span className="flex items-center gap-2 justify-end">
                        <span>{opt.label}</span>
                        <span>{opt.flag}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="السعر"
                value={filters.price || ''}
                onChange={(e) => handleFilterChange('price', e.target.value)}
                className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all text-sm ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none px-4`}
              />
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3" dir="rtl">
              <Select value={filters['number of rooms']} onValueChange={(value) => handleFilterChange('number of rooms', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عدد الغرف" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {roomOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['number of livingRooms']} onValueChange={(value) => handleFilterChange('number of livingRooms', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عدد الصالونات" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {livingRoomOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['number of bathrooms']} onValueChange={(value) => handleFilterChange('number of bathrooms', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عدد الحمامات" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {bathroomOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['number of building floors']} onValueChange={(value) => handleFilterChange('number of building floors', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عدد طوابق المبنى" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {floorOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['year']} onValueChange={(value) => handleFilterChange('year', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="عمر المبنى" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {buildingAgeOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3" dir="rtl">
              <Select value={filters['property condition']} onValueChange={(value) => handleFilterChange('property condition', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="حالة العقار" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {propertyConditionOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['payment method']} onValueChange={(value) => handleFilterChange('payment method', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="طريقة الدفع" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {paymentOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['delivery conditions']} onValueChange={(value) => handleFilterChange('delivery conditions', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="شروط التسليم" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {deliveryOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters['deedType']} onValueChange={(value) => handleFilterChange('deedType', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="نوع الطابو" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {deedTypeOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => handleFilterChange('furnishing', !filters.furnishing)}
                  className={`flex items-center gap-2 rounded-full px-3 sm:px-4 h-[42px] font-medium text-sm sm:text-base cursor-pointer border-2 transition-all ${filters.furnishing ? 'border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'} ${isDarkMode ? 'bg-gray-900 text-gray-100 hover:bg-gray-700' : 'bg-white/0 text-black hover:bg-black/5'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${filters.furnishing ? 'bg-yellow-500 border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'}`}></div>
                  <span>مفروش</span>
                </button>
                <button
                  onClick={() => handleFilterChange('negotiable', !filters.negotiable)}
                  className={`flex items-center gap-2 rounded-full px-3 sm:px-4 h-[42px] font-medium text-sm sm:text-base cursor-pointer border-2 transition-all ${filters.negotiable ? 'border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'} ${isDarkMode ? 'bg-gray-900 text-gray-100 hover:bg-gray-700' : 'bg-white/0 text-black hover:bg-black/5'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${filters.negotiable ? 'bg-yellow-500 border-yellow-500' : isDarkMode ? 'border-gray-500' : 'border-black'}`}></div>
                  <span>قابل للتفاوض</span>
                </button>
              </div>
            </div>

            {/* Fifth Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 mb-3" dir="rtl">
              <Select value={filters['contact method']} onValueChange={(value) => handleFilterChange('contact method', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="طريقة التواصل" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {contactOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters['amenities']} onValueChange={(value) => handleFilterChange('amenities', value)}>
                <SelectTrigger className={`rounded-full w-full h-[42px] font-medium font-[Noor] border-0 transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none`}>
                  <SelectValue placeholder="الكماليات" className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </SelectTrigger>
                <SelectContent className={`font-[Noor] rounded-xl border-0 shadow-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                  {amenities.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2 px-3 text-right">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2 sm:gap-0" dir="rtl">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  onClick={resetFilters}
                  className={`flex items-center justify-center gap-2 rounded-full px-3 sm:px-4 h-[42px] font-medium text-sm cursor-pointer border w-full sm:w-auto transition-all ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-500 hover:bg-gray-700' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                >
                  <span>مسح الكل</span>
                </button>
                <button 
                  className={`flex items-center justify-center gap-2 rounded-full px-3 sm:px-4 h-[42px] font-medium text-sm cursor-pointer border w-full sm:w-auto transition-all ${isDarkMode ? 'bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-300' : 'bg-white/0 text-black border-black hover:bg-black/5'}`}
                >
                  <span>بحث</span>
                  <img src={searchIcon} alt="search" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <img src={background} alt="background" className={`absolute inset-0 w-full h-full object-cover opacity-30 rounded-[20px] sm:rounded-[30px] pointer-events-none ${isDarkMode ? 'mix-blend-luminosity' : ''}`} />
        </div>
        </div>

        {/* App Store Links */}
        <div className="container mx-auto py-4 sm:py-6 flex flex-row justify-center items-center gap-3 sm:gap-4 px-4">
          <a 
            href="https://apps.apple.com/app/albazar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 cursor-pointer"
          >
            <img src="/images/App Store  White.png" alt="App Store" className="h-10 sm:h-12" />
          </a>
          <a 
            href="https://play.google.com/store/apps/details?id=com.mohassan.albazar_ap&pcampaignid=web_share" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 cursor-pointer"
          >
            <img src="/images/Google Play.png" alt="Google Play" className="h-10 sm:h-12" />
          </a>
        </div>

        {/* Property Grid */}
        <div className="container mx-auto py-8 sm:py-12 px-4">
          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-32">
              <Spinner />
            </div>
          ) : listings?.data?.length === 0 ? (
            <div className="text-center py-16 sm:py-32 px-4">
              <div className="mb-4 sm:mb-6">
                <svg className="mx-auto h-16 sm:h-20 w-16 sm:w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-[Noor] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>لا توجد عقارات للبيع</h3>
              <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-[Noor] max-w-md mx-auto`}>لم يتم العثور على أي عقارات للبيع تطابق معايير البحث الخاصة بك</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className={`text-2xl sm:text-3xl font-bold font-[Noor] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>نتائج البحث</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {listings?.data?.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={transformPropertyData(property)}
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
        {!loading && listings?.data?.length > 0 && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-12 sm:py-16`}>
            <div className="container mx-auto px-4">
              <h2 className={`text-2xl sm:text-3xl font-bold text-right mb-8 sm:mb-10 font-[Noor] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>الأكثر بحثا في البيع</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {listings?.data?.slice(0, 4).map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={transformPropertyData(property)}
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

export default PropertiesForSale; 