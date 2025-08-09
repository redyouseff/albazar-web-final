import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addListing } from "../../redux/Actions/ListingActions"

const AddListingHook = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const dispatch = useDispatch()

    const response = useSelector((state) => state.listing.addListing);
    console.log("Hook response:", response) 

    const submitListing = (formData) => {
        console.log("Submitting listing with data:", formData)
        setLoading(true)
        setError(null)
        setSuccess(false)
        
        dispatch(addListing(formData))
    }

    useEffect(() => {
        if (response && Object.keys(response).length > 0) {
            console.log("Response updated:", response)
            setLoading(false)
            
            // التحقق من حالة الاستجابة
            if (response.status === 200 || response.status === 201) {
                console.log("تم نشر الإعلان بنجاح")
                setSuccess(true)
                setError(null)
            } else if (response.name === 'AxiosError') {
                // التعامل مع AxiosError
                console.error("AxiosError:", response)
                
                if (response.response && response.response.data) {
                    // استخراج رسالة الخطأ من response.data.message
                    const errorMessage = response.response.data.message;
                    
                    // تحويل رسائل الخطأ التقنية إلى رسائل مفهومة بالعربية
                    if (errorMessage && errorMessage.includes('Cast to Boolean failed')) {
                        setError("خطأ في تنسيق البيانات. يرجى المحاولة مرة أخرى.");
                    } else if (errorMessage && errorMessage.includes('validation failed')) {
                        setError("فشل في التحقق من صحة البيانات. تأكد من ملء جميع الحقول المطلوبة.");
                    } else if (errorMessage && errorMessage.includes('required')) {
                        setError("يرجى ملء جميع الحقول المطلوبة.");
                    } else {
                        setError(errorMessage || "حدث خطأ أثناء إرسال البيانات");
                    }
                } else if (response.message) {
                    setError(response.message);
                } else {
                    setError("حدث خطأ أثناء إرسال البيانات");
                }
                
                setSuccess(false)
            } else if (response.response && response.response.status >= 400) {
                // في حالة وجود خطأ فعلي من الـ API
                console.error("خطأ من الـ API:", response)
                setError(response.response.data?.message || "حدث خطأ أثناء إرسال البيانات")
                setSuccess(false)
            } else if (response.message) {
                // في حالة وجود خطأ في الشبكة أو خطأ آخر
                console.error("خطأ في الشبكة:", response)
                setError(response.message || "حدث خطأ أثناء إرسال البيانات")
                setSuccess(false)
            }
        }
    }, [response])    

    return [submitListing, response, loading, error, success]
}                           

export default AddListingHook;
                                 