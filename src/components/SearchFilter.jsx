import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const SearchFilter = () => {
  return (
    <div className="bg-[#FFED00] relative px-8 md:px-12 w-[95%] mx-auto rounded-[30px] my-8">
      <div className="container mx-auto py-8 relative z-10 px-6 font-[Noor]">
        {/* First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="الطابق" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="1" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">الأول</SelectItem>
              <SelectItem value="2" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">الثاني</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="نوع العقار" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="apartment" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">شقة</SelectItem>
              <SelectItem value="villa" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">فيلا</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="صاحب الإعلان" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="owner" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">مالك</SelectItem>
              <SelectItem value="agent" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">وسيط</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="التنظيم" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="furnished" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">مفروش</SelectItem>
              <SelectItem value="unfurnished" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">غير مفروش</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="المحافظة" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="cairo" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">القاهرة</SelectItem>
              <SelectItem value="giza" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">الجيزة</SelectItem>
            </SelectContent>
          </Select>
          </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <Input 
              type="number"
            placeholder="السعر"
            className="bg-white rounded-full h-[52px] font-medium font-[Noor] border-0 hover:border-0 focus:border-black px-6 text-lg"
          />

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="العملة" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="egp" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">جنيه مصري</SelectItem>
              <SelectItem value="usd" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">دولار</SelectItem>
            </SelectContent>
          </Select>

          <Input 
              type="number"
            placeholder="المساحة"
            className="bg-white rounded-full h-[52px] font-medium font-[Noor] border-0 hover:border-0 focus:border-black px-6 text-lg"
          />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="عمر المبنى" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="new" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">جديد</SelectItem>
              <SelectItem value="old" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">قديم</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="شروط التسليم" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="immediate" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">فوري</SelectItem>
              <SelectItem value="scheduled" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">مجدول</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="طرق الدفع" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="cash" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">كاش</SelectItem>
              <SelectItem value="installment" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">تقسيط</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="عدد الحمامات" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="1" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">1</SelectItem>
              <SelectItem value="2" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">2</SelectItem>
              <SelectItem value="3" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">3+</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="عدد الغرف" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="1" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">1</SelectItem>
              <SelectItem value="2" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">2</SelectItem>
              <SelectItem value="3" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <Select>
            <SelectTrigger className="bg-white rounded-full w-full h-[52px] font-medium font-[Noor] border border-transparent hover:border-transparent focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none transition-all">
              <SelectValue placeholder="حالة العقار" className="text-lg text-gray-900" />
            </SelectTrigger>
            <SelectContent className="font-[Noor] bg-white rounded-xl border-0 shadow-lg p-2 mt-2">
              <SelectItem value="available" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">متاح</SelectItem>
              <SelectItem value="reserved" className="text-base font-medium focus:outline-none rounded-lg hover:bg-black/5 cursor-pointer py-2.5 px-4">محجوز</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-4">
            <Button variant="outline" className="bg-white rounded-full px-6 h-[52px] font-medium text-black hover:bg-black/5 text-lg flex-1">
              قابل للتفاوض
            </Button>
            <Button variant="outline" className="bg-white rounded-full px-6 h-[52px] font-medium text-black hover:bg-black/5 text-lg flex-1">
              مفروش
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <div className="flex gap-4">
            <Button variant="outline" className="bg-white rounded-full px-8 h-[52px] font-medium text-black hover:bg-black/5 text-lg">
              مسح الكل
            </Button>
            <Button variant="outline" className="bg-white rounded-full px-8 h-[52px] font-medium text-black hover:bg-black/5 text-lg">
              بحث
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
