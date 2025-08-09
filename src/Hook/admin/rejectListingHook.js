import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { rejectListing } from "../../redux/Actions/ListingActions";

const RejectListingHook = (id) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const currentIdRef = useRef(id);
    const lastProcessedIdRef = useRef(null);

    const response = useSelector((state) => state.listing.rejectlisting);

    // إعادة تعيين الحالات عند تغيير الـ ID
    useEffect(() => {
        // إذا تغير الـ ID، إعادة تعيين جميع الحالات
        if (currentIdRef.current !== id) {
            setLoading(false);
            setError(null);
            setSuccess(false);
            lastProcessedIdRef.current = null;
            currentIdRef.current = id;
        }
    }, [id]);

    const rejectListingHandler = async () => {
        if (!id) {
            setError("معرف الإعلان مطلوب");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            lastProcessedIdRef.current = id;
            await dispatch(rejectListing(id));
        } catch (err) {
            setError("حدث خطأ في رفض الإعلان");
            setLoading(false);
        }
    };

    useEffect(() => {
        // التحقق من أن الـ response ينتمي للإعلان الحالي
        if (response && response.id === id && lastProcessedIdRef.current === id) {
            setLoading(false);
            
            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setError(null);
            } else if (response.status >= 400) {
                setError(response.data?.message || "حدث خطأ في رفض الإعلان");
                setSuccess(false);
            }
        }
    }, [response, id]);

    const isSuccess = () => {
        return success && response && response.id === id;
    };

    const hasError = () => {
        return error && response && response.id === id;
    };

    return {
        loading,
        error,
        success,
        response: response && response.id === id ? response : null,
        rejectListingHandler,
        isSuccess: isSuccess(),
        hasError: hasError()
    };
};

export default RejectListingHook;