import { Car, Building, Home, Store } from 'lucide-react';

const NavbarForAdmin = ({ activeTab, onTabClick }) => {
  const tabs = [
    { id: 'سيارات', icon: Car, label: 'سيارات' },
    { id: 'أراضي و مباني', icon: Building, label: 'أراضي و مباني' },
    { id: 'عقارات للإيجار', icon: Home, label: 'عقارات للإيجار' },
    { id: 'عقارات للبيع', icon: Store, label: 'عقارات للبيع' }
  ];

  return (
    <div className="container bg-white p-4 mx-auto rounded-[3rem]">   
      <div className="bg-yellow-400 p-4 rounded-[2rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center space-x-4 space-x-reverse">
            {tabs.map((tab) => (
              <button  
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-black text-yellow-400' 
                    : 'text-black hover:bg-black hover:text-yellow-400'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold text-lg">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarForAdmin; 