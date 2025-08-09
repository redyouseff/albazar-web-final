import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { useDarkMode } from '../context/DarkModeContext';

const Layout = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} dir="rtl">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
