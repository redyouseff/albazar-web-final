import { useState } from 'react';
import Layout from '../components/Layout';
import { Calendar, Phone, Mail, MapPin, Edit, ExternalLink } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('ads');

  const userAds = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: 'عقار المنشور',
    description: 'وصف مختصر للعقار مع التفاصيل الأساسية والموقع',
    price: '000000',
    location: 'حي الملز، الرياض',
    image: '/api/placeholder/300/200',
    status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'sold'
  }));

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    active: 'نشط',
    pending: 'قيد المراجعة',
    sold: 'مباع'
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-reverse space-x-4">
              <img
                src="/api/placeholder/80/80"
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">اسم المستخدم</h1>
                <p className="text-gray-600">عضو منذ 20xx</p>
              </div>
            </div>
            <button className="flex items-center space-x-reverse space-x-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
              <Edit className="h-4 w-4" />
              <span>إعلاناتي</span>
            </button>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-yellow-600 font-medium">متابعين</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-yellow-600 font-medium">عدد الإعلانات</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center col-span-2 md:col-span-1">
              <div className="flex items-center justify-center space-x-reverse space-x-2">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">متابعة</span>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full ml-2"></span>
              واتساب
            </span>
            <span className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
              دردشة
            </span>
            <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-white rounded-full ml-2"></span>
              متابعة
            </span>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">اسم الحساب</h2>
          <p className="text-gray-600 mb-6">هذا الاسم سوف يظهر على الحساب</p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-900 font-medium mb-2">الاسم الأول</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2">الاسم الأخير</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">تغيير كلمة مرور جديدة</label>
              <input
                type="password"
                placeholder="كلمة مرور جديدة"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                placeholder="تأكيد كلمة المرور"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">تفاصيل الحساب</label>
              <p className="text-gray-600 text-sm mb-2">هذه المعلومات لا تظهر للمستخدمين</p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-reverse space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">تاريخ الميلاد</span>
                </div>
                
                <div className="flex items-center space-x-reverse space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">رقم الموبايل الأساسي</span>
                </div>
                
                <div className="flex items-center space-x-reverse space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">البريد الإلكتروني</span>
                </div>
                
                <div className="flex items-center space-x-reverse space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">المدينة</span>
                </div>
              </div>
            </div> 

            <div className="flex items-center space-x-reverse space-x-2">
              <div className="flex items-center space-x-reverse space-x-2">
                <span className="text-gray-600">📞</span>
                <span className="text-gray-900 font-medium">للدعم و التواصل و الإعلان</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-reverse space-x-2">
              <span className="text-gray-600">📋</span>
              <span className="text-gray-900 font-medium">تسجيل خروج</span>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-yellow-400 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              تحديث المعلومات
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
