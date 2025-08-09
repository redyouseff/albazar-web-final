import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProprtyForCarListing, getProprtyForLandtListing, getProprtyForRentListing, getProprtyForSelltListing } from "../../redux/Actions/ListingActions";
import notify from '../useNotifaction';

const IndexListingHook = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page] = useState(1);
    const [limit] = useState(5);

    const dispatch = useDispatch();
    
    // تحديث طريقة استدعاء البيانات من الريدكس
    const rentListings = useSelector((state) => state.listing?.propertyForRentListing?.data?.data || []);
    const sellListings = useSelector((state) => state.listing?.propertyForSellListing?.data?.data || []);
    const landListings = useSelector((state) => state.listing?.propertyForLandListing?.data?.data || []);
    const carListings = useSelector((state) => state.listing?.propertyForCarListing?.data?.data || []);

    // تحديث طريقة استدعاء معلومات الصفحات
    const rentPaginate = useSelector((state) => state.listing?.propertyForRentListing?.data?.paginate);
    const sellPaginate = useSelector((state) => state.listing?.propertyForSellListing?.data?.paginate);
    const landPaginate = useSelector((state) => state.listing?.propertyForLandListing?.data?.paginate);
    const carPaginate = useSelector((state) => state.listing?.propertyForCarListing?.data?.paginate);
    

    const getListings = async () => {
        try {
            setLoading(true);
            setError(null);

            // تنفيذ كل طلب على حدة للتعامل مع الأخطاء بشكل أفضل
            try {
                await dispatch(getProprtyForRentListing( page, limit,true));
            } catch (rentError) {
                console.error("Error fetching rent listings:", rentError);
            }

            try {
                await dispatch(getProprtyForSelltListing( page, limit,true));
            } catch (sellError) {
                console.error("Error fetching sell listings:", sellError);
            }

            try {
                console.log(page)
                await dispatch(getProprtyForLandtListing( page, limit,true));
            } catch (landError) {
                console.error("Error fetching land listings:", landError);
            }

            try {
                await dispatch(getProprtyForCarListing( page, limit,true));
            } catch (carError) {
                console.error("Error fetching car listings:", carError);
            }

        } catch (error) {
            console.error("Error in getListings:", error);
            setError("حدث خطأ في تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    // تحميل البيانات عند تحميل المكون
    useEffect(() => {
        getListings();
    }, []);

    // دالة لتحديث البيانات
    const refresh = () => {
        getListings();
    };

    return {
        // البيانات
        rentListings,
        sellListings,
        landListings,
        carListings,
        
        // معلومات الصفحات
        rentPaginate,
        sellPaginate,
        landPaginate,
        carPaginate,
        
        // الحالة
        loading,
        error,
        refresh
    };
};

export default IndexListingHook;