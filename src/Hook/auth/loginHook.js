import { useState } from "react"
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/Actions/AuthActions";
import notify from '../useNotifaction';

const loginHook = () => {
    const [email, setemail] = useState("");
    const [pass, setpass] = useState("");
    const [loading, setloading] = useState(false);

    const onChangeEmail = (e) => {
        setemail(e.target.value);
    }

    const onChangePass = (e) => {           
        setpass(e.target.value);
    }

    const validation = () => {
        let isValid = true;
        
        if (!email.trim()) {
            notify("البريد الإلكتروني مطلوب", "error");
            isValid = false;
        }
        if (!pass.trim()) {
            notify("كلمة المرور مطلوبة", "error");
            isValid = false;
        }
        
        return isValid;
    }

    const dispatch = useDispatch();

    const onSubmit = async () => {
        if (!validation()) return;
        if (loading) return;
        
        try {
            setloading(true);
            const result = await dispatch(loginUser({
                email: email,
                password: pass
            }));

            if (!result.payload) {
                notify("حدث خطأ في الاتصال بالخادم", "error");
                return;
            }

            const response = result.payload;
            console.log("Login Response:", response);

            if (response.status === 200 && response.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data));
                notify("تم تسجيل الدخول بنجاح", "success");
                
                // Check if user is admin and redirect accordingly
                const userData = response.data.data;
                if (userData.role === 'admin') {
                    setTimeout(() => {
                        window.location.href = "/admin";
                    }, 1500);
                } else {
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                }
                return;
            }
            
            // معالجة الأخطاء
            let errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
            
            if (response.data?.message) {
                const message = response.data.message;
                
                if (message.includes("email or password is not correct")) {
                errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
                } else if (message.includes("E11000")) {
                    errorMessage = "حدث خطأ في البيانات، يرجى المحاولة مرة أخرى";
                } else if (message.includes("validation")) {
                    errorMessage = "بيانات غير صحيحة، يرجى التحقق من المعلومات المدخلة";
                } else if (message.includes("account")) {
                    errorMessage = "مشكلة في الحساب، يرجى التواصل مع الدعم";
                } else {
                    errorMessage = message;
                }
            } else if (response.status === 429) {
                errorMessage = "برجاء الانتظار قبل إعادة المحاولة";
            } else if (response.status === 500) {
                errorMessage = "حدث خطأ في النظام، برجاء المحاولة مرة أخرى";
            }
            
            notify(errorMessage, "error");
            localStorage.removeItem("token");
            localStorage.removeItem("user");

        } catch (error) {
            console.error('Login error:', error);
            notify("حدث خطأ في الاتصال بالخادم", "error");
        } finally {
            setloading(false);
        }
    }

    return [email, pass, onChangeEmail, onChangePass, onSubmit, loading];
}

export default loginHook;