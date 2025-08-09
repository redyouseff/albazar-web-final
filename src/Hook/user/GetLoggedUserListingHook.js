import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { getLoggedInUser } from "../../redux/Actions/AuthActions"
import { getLoggedUserListing } from '../../redux/Actions/UserActions';


const  GetLoggedUserListingHook=(filter)=>{
    console.log(filter)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const response = useSelector((state) => state.user.loggeduserlisting);

    
    const getListing = async () => {
        try {
            setLoading(true);
            setError(null);
            await dispatch(getLoggedUserListing(filter));
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("حدث خطأ في جلب اعلانات المستخدم");
        }
    };

    useEffect(() => {
        getListing();
    }, [filter]);



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


    const hasUserData = () => {
        return response && response.data && response.data.data && response.status === 200;
    };

    return {
        data: hasUserData() ? response.data.data : null,
        loading,
        error,
        hasUserData: hasUserData()
    };


}

export default  GetLoggedUserListingHook ;