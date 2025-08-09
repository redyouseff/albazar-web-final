import Layout from "@/components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import myadsIcon from "/images/my-ads/Vector (3).png";
import deleteIcon from  "/images/my-ads/Vector.png";
import GetLoggedUserListingHook from "../Hook/user/GetLoggedUserListingHook";
import { useDarkMode } from '../context/DarkModeContext';
import MyadsIconDarkmode from "/images/my-ads/My ads Icon.svg";

export default function MyAds() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [filter,setFilter]=useState({
post:null,
pending:null,
rejected:null,

  });


  const   {
    data,
    loading,
    error,
    hasUserData
}=GetLoggedUserListingHook(filter)

const handleOnClick=(tab)=>{
  if(tab==="الكل"){
    setFilter({
      post:null,
      pending:null,
      rejected:null,
    })

  }

  if(tab=="منشور"){
    setFilter({
      post:true,
      pending:null,
      rejected:null,
    })

  }
  if(tab=="معلق"){
    setFilter({
      post:null,
      pending:true,
      rejected:null,
    })

  }

  if(tab=="مرفوض"){
    setFilter({
      post:null,
      pending:null,
      rejected:true,
    })

  }

}

const handleAdClick = (adId) => {
  navigate(`/property/${adId}`);
}

const truncateDescription = (text, maxLength = 30) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

  const [activeTab, setActiveTab] = useState("الكل");
  const tabs = ["الكل", "منشور", "معلق", "مرفوض"];


  let dummyAds=data||[]

 
  



  
   

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} scroll-smooth`}>
        {/* Header with icon and tabs */}
        <div className={`mb-16 pb-6 sticky top-0 z-10 rounded-3xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-center pt-8 mb-12">
            <div className="flex items-center gap-2">
              <img src={isDarkMode? MyadsIconDarkmode : myadsIcon} alt="إعلاناتي" className="w-6 h-6" />
              <div className={`text-2xl ${isDarkMode ? 'text-purple-200' : ''}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>إعلاناتي</div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap justify-start gap-4 sm:gap-8 md:gap-12 mx-2 sm:mx-6 md:mx-16">
            {tabs?.map((tab) => (
              <button
                key={tab}
                onClick={() => { 
                  handleOnClick(tab)
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`
                  w-full sm:w-auto
                  px-4 sm:px-8 md:px-16
                  py-2 sm:py-3
                  rounded-full font-[Noor] font-normal text-base sm:text-lg min-w-[120px] sm:min-w-[140px] md:min-w-[180px] text-center
                  transition-all duration-300
                  ${activeTab === tab
                    ? isDarkMode
                      ? 'bg-yellow-400 text-gray-900 transform scale-105 border-2 border-yellow-400'
                      : 'bg-black text-white transform scale-105'
                    : isDarkMode
                      ? 'bg-gray-900 text-purple-200 border border-gray-700 hover:border-yellow-400'
                      : 'bg-white text-black border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Ads List */}
        <div className="space-y-6 mx-8 mt-16 overflow-y-auto">
          {dummyAds.length > 0 ? (
            dummyAds.map((ad) => (
              <div
                key={ad.id}
                className={`rounded-[32px] p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-purple-200' : 'bg-white'}`}
                onClick={() => handleAdClick(ad.id)}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={ad.images[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 mx-8 text-right">
                  <h3 className={`text-2xl mb-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-800'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>{ad.title}</h3>
                  <p className={`font-[Noor] font-normal ${isDarkMode ? 'text-purple-300' : 'text-gray-600'}`}>{truncateDescription(ad.description)}</p>
                </div>
                <img 
                  src={deleteIcon} 
                  alt="حذف" 
                  className={`w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity duration-200 ${isDarkMode ? 'invert' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add delete functionality here
                  }}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className={`rounded-3xl p-12 shadow-lg text-center max-w-md mx-auto ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="mb-6">
                  <svg className={`w-24 h-24 mx-auto ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-purple-200' : 'text-gray-600'}`} style={{ fontFamily: 'Cairo', fontWeight: 700 }}>
                  لا توجد إعلانات
                </h3>
                <p className={`font-[Noor] font-normal text-lg ${isDarkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                  {activeTab === "الكل" ? "لا توجد إعلانات في هذا القسم" :
                   activeTab === "منشور" ? "لا توجد إعلانات منشورة" :
                   activeTab === "معلق" ? "لا توجد إعلانات معلقة" :
                   "لا توجد إعلانات مرفوضة"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 