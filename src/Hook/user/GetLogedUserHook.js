import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { getLoggedInUser } from "../../redux/Actions/AuthActions"

export const GetLogedUserHook = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const response = useSelector((state) => state.auth.getLoggedInUser);

    const getUser = async () => {
        try {
            setLoading(true);
            setError(null);
            await dispatch(getLoggedInUser);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("حدث خطأ في جلب بيانات المستخدم");
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    // Update loading and error states based on response
    useEffect(() => {
        if (response) {
            setLoading(false);
            
            if (response.status === 200 && response.data) {
                setError(null);
            } else if (response.status >= 400) {
                setError(response.data?.message || "حدث خطأ في جلب بيانات المستخدم");
            }
        }
    }, [response]);

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    };

    // Check if user data is valid
    const hasUserData = () => {
        return response && response.data && response.data.data && response.status === 200;
    };

    return {
        user: hasUserData() ? response.data : null,
        loading,
        error,
        refetch: getUser,
        isAuthenticated: isAuthenticated(),
        hasUserData: hasUserData()
    };
};   

