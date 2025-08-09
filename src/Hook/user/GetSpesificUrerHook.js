import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../redux/Actions/UserActions";

const GetSpesificUrerHook = (id) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [numberOfListing, setNumberOfListing] = useState(0);
    const dispatch = useDispatch();

    const response = useSelector((state) => state.user.userById);

    const getData = async () => {
        try {
            setLoading(true);
            setError(null);
            await dispatch(getUserById(id));
        } catch (err) {
            setError("حدث خطأ في جلب بيانات المستخدم");
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    useEffect(() => {
        if (response) {
            if (response.status === 200 && response.data) {
                // Handle different possible API response structures
                if (response.data.state === "success" && response.data.data) {
                    // Structure: { state: "success", data: {...}, numberOfListing: 27 }
                    setUserData(response.data.data);
                    setNumberOfListing(response.data.numberOfListing || 0);
                    setError(null);
                    setLoading(false);
                } else if (response.data.data) {
                    // Structure: { data: {...} }
                    setUserData(response.data.data);
                    setNumberOfListing(response.data.numberOfListing || 0);
                    setError(null);
                    setLoading(false);
                } else if (response.data._id) {
                    // Structure: { _id: "...", firstname: "...", ... }
                    setUserData(response.data);
                    setNumberOfListing(response.data.numberOfListing || 0);
                    setError(null);
                    setLoading(false);
                } else {
                    setError("لم يتم العثور على بيانات المستخدم");
                    setUserData(null);
                    setLoading(false);
                }
            } else if (response.status >= 400) {
                setError(response.data?.message || "حدث خطأ في جلب بيانات المستخدم");
                setUserData(null);
                setLoading(false);
            }
        }
    }, [response]);

    const hasUserData = () => {
        return userData && response && response.status === 200;
    };

    return {
        userData,
        numberOfListing,
        loading,
        error,
        hasUserData: hasUserData()
    };
}

export default GetSpesificUrerHook;