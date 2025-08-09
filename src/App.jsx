import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import NewPassword from "./pages/NewPassword";
import AddCarListing from "./pages/AddCarListing";
import AddPropertyForRent from './pages/AddPropertyForRent';
import AddPropertyForSale from './pages/AddPropertyForSale';
import AddBuildingsAndLands from './pages/AddBuildingsAndLands';
import MyAccount from './pages/MyAccount';
import CategoryLanding from './pages/CategoryLanding';
import MyAds from './pages/MyAds';
import UserProfile from './pages/UserProfile';
import PropertiesForRent from './pages/PropertiesForRent';
import PropertiesForSale from './pages/PropertiesForSale';
import BuildingsAndLands from './pages/BuildingsAndLands';
import Cars from './pages/Cars';
import AdminLanding from './pages/AdminLanding';
import ShowUsersForAdmin from './pages/showUsersForAdmin';
import AdminUserProfile from './pages/AdminUserProfile';
import AllListingForAdmin from './pages/allListingForAdmin';
import ProtectedRouteHook from "./Hook/auth/ProtectedRouteHook";
import ProtectedRoute from "./components/utilts/ProtectedRoute";
import { SocketContextProvider } from './context/SocketContext.jsx';
import { DarkModeProvider } from './context/DarkModeContext.jsx';
import ListingDetailsForAdmin from './pages/listingDetailsForAdmin';
import ListingDetailsRentForAdmin from './pages/listingDetailsRentForAdmin';
import ListingDetailsBuildingsForAdmin from './pages/listingDetailsBuildingsForAdmin';
import ListingDetailsCarsForAdmin from './pages/listingDetailsCarsForAdmin';


const queryClient = new QueryClient();

const App = () =>{

  const [isUser,isAdmin,userData,updateUserData,loading]=ProtectedRouteHook();
  console.log("App - isUser:", isUser, "loading:", loading)
 

  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner 
            position="top-center"
            expand
            richColors
            closeButton
            theme="light"
            dir="rtl"
            style={{
              fontFamily: 'Cairo',
            }}
          />
          <BrowserRouter>
            <SocketContextProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-code" element={<VerifyCode />} />
              <Route path="/new-password" element={<NewPassword />} />
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />   
          
              <Route path="/categories-landing" element={<CategoryLanding />} />   
          
            {/* user routes */}
            <Route element={<ProtectedRoute auth={isUser} loading={loading} />}>
              <Route path="/propertiesForRent" element={<PropertiesForRent />} /> 
              <Route path="/propertiesForSale" element={<PropertiesForSale />} />
              <Route path="/buildingsAndLands" element={<BuildingsAndLands />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/add-property-for-rent" element={<AddPropertyForRent />} /> 
              <Route path="/add-property-for-sale" element={<AddPropertyForSale />} />
              <Route path="/add-buildings-and-lands" element={<AddBuildingsAndLands />} />   
              <Route path="/add-car" element={<AddCarListing />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/my-account" element={<MyAccount />} />


              <Route path="/my-ads" element={<MyAds />} />   
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/user/:id" element={<UserProfile />} />
           

            </Route> 

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLanding />} />
            <Route path="/admin/users" element={<ShowUsersForAdmin />} />
            <Route path="/admin/user/:id" element={<AdminUserProfile />} />
            <Route path="/admin/listings" element={<AllListingForAdmin />} />
            <Route path="/listing-details-admin/:id" element={<ListingDetailsForAdmin />} />
            <Route path="/listing-details-rent-admin/:id" element={<ListingDetailsRentForAdmin />} />
            <Route path="/listing-details-buildings-admin/:id" element={<ListingDetailsBuildingsForAdmin />} />
            <Route path="/listing-details-cars-admin/:id" element={<ListingDetailsCarsForAdmin />} />
    
              <Route element={<Layout />}> 
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            </SocketContextProvider>
          </BrowserRouter>
        </TooltipProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;
