import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from '../context/DarkModeContext';
import propertyrent from "/images/categore/Rent Black 0000.svg";
import propertybuy from "/images/categore/Sell Black 0000.svg";
import building from "/images/categore/Lands Black 0000.svg";
import car from "/images/categore/Cars Black 0000.svg";

const categories = [
  {
    label: "عقارات للإيجار",
    img: propertyrent,
    path: "/add-property-for-rent"
  },
  {
    label: "عقارات للبيع",
    img: propertybuy,
    path: "/add-property-for-sale"
  },
  {
    label: "مباني و أراضي",
    img: building,
    path: "/add-buildings-and-lands"
  },
  {
    label: "سيارات",
    img: car,
    path: "/add-car"
  },
];

export default function CategoryLanding() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  return (
    <Layout>
      <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 py-8">
            {categories.map((cat) => (
              <div 
                key={cat.label} 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(cat.path)}
              >
                <div className={`w-24 h-24 flex items-center justify-center rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ border: "2px solid #FFED00" }}>
                  <img src={cat.img} alt={cat.label} className="w-12 h-12 object-contain" />
                </div>
                <div className={`text-base font-bold text-center mt-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 