import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../redux/Actions/AuthActions';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const notify = (message, type) => {
    toast[type === "error" ? "error" : "success"](
        type === "error" ? "خطأ" : "نجاح",
        {
            description: message,
            duration: 4000,
            style: {
                background: type === "error" ? "#fee2e2" : "#f0fdf4",
                border: `1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"}`,
                color: type === "error" ? "#dc2626" : "#16a34a",
                fontFamily: "Cairo",
                direction: "rtl"
            }
        }
    );
};

const RegisterHook = () => {
   const [name, setname] = useState("");
   const [lastname, setlastname] = useState("");
   const [email, setemail] = useState("");
   const [phone, setphone] = useState("");
   const [pass, setpass] = useState("");
   const [rpass, setrpass] = useState("");
   const [loading, setLoading] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);

   const onchangename = (e) => {
    setname(e.target.value);
    if (isSubmitted && !e.target.value.trim()) {
      notify("الرجاء إدخال الاسم", "error");
    }
   }

   const onchangelastname = (e) => {
    setlastname(e.target.value);
    if (isSubmitted && !e.target.value.trim()) {
      notify("الرجاء إدخال اسم العائلة", "error");
    }
   }

   const onchangeEmail = (e) => {
    setemail(e.target.value);
    if (isSubmitted) {
      if (!e.target.value.trim()) {
        notify("الرجاء إدخال البريد الإلكتروني", "error");
      } else if (!e.target.value.includes('@') || e.target.value.length < 5) {
        notify("البريد الإلكتروني غير صحيح", "error");
      }
    }
   }

   const onchangePhone = (value) => {
    setphone(value);
    if (isSubmitted && !value) {
      notify("الرجاء إدخال رقم الهاتف", "error");
    }
   }

   const onchangePass = (e) => {
    setpass(e.target.value);
    if (isSubmitted) {
      if (!e.target.value) {
        notify("الرجاء إدخال كلمة المرور", "error");
      } else if (e.target.value.length < 6) {
        notify("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
      }
    }
   }

   const onchangeRpass = (e) => {
    setrpass(e.target.value);
    if (isSubmitted && pass !== e.target.value) {
      notify("كلمة المرور غير متطابقة", "error");
    }
   }

   const validation = () => {
    setIsSubmitted(true);
    let isValid = true;

    if (!name.trim()) {
        notify("الرجاء إدخال الاسم", "error");
        isValid = false;
    }

    if (!lastname.trim()) {
        notify("الرجاء إدخال اسم العائلة", "error");
        isValid = false;
    }

    if (!email.trim()) {
        notify("الرجاء إدخال البريد الإلكتروني", "error");
        isValid = false;
    } else if (!email.includes('@') || email.length < 5) {
        notify("البريد الإلكتروني غير صحيح", "error");
        isValid = false;
    }

    if (!phone) {
        notify("الرجاء إدخال رقم الهاتف", "error");
        isValid = false;
    }

    if (!pass) {
        notify("الرجاء إدخال كلمة المرور", "error");
        isValid = false;
    } else if (pass.length < 6) {
        notify("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
        isValid = false;
    }

    if (pass !== rpass) {
        notify("كلمة المرور غير متطابقة", "error");
        isValid = false;
    }

    return isValid;
   }

   const dispatch = useDispatch();
   const onsubmit = async () => {
    if (!validation()) {
        return;
    }
    
    setLoading(true);
    await dispatch(createUser({
        firstname: name,
        lastname: lastname,
        email: email,
        password: pass,
        passwordConfirm: rpass,
        phone: phone
    }));
    setLoading(false);
   }

   const res = useSelector((state) => state.auth.createuser);
   const navigate = useNavigate();
   
   useEffect(() => {
    if (loading) return;

    if (res) {
        console.log("Registration response:", res);
        
        // Check for errors first
        if (res.data?.errors) {
            const errorMessage = res.data.errors[0]?.msg || "حدث خطأ في التسجيل";
            notify(errorMessage, "error");
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (error) {
                console.error('Storage removal error:', error);
            }
            return;
        }

        // Check for error status codes
        if (res.status >= 400) {
            let errorMessage = "حدث خطأ في التسجيل";
            
            // Handle specific error cases
            if (res.data?.message) {
                const message = res.data.message;
                
                // Handle duplicate email error
                if (message.includes("E11000") && message.includes("email")) {
                    errorMessage = "البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد إلكتروني آخر";
                }
                // Handle duplicate phone error  
                else if (message.includes("E11000") && message.includes("phone")) {
                    errorMessage = "رقم الهاتف مستخدم بالفعل، يرجى استخدام رقم آخر";
                }
                // Handle validation errors
                else if (message.includes("validation")) {
                    errorMessage = "بيانات غير صحيحة، يرجى التحقق من المعلومات المدخلة";
                }
                // Handle email format errors
                else if (message.includes("email") && message.includes("invalid")) {
                    errorMessage = "البريد الإلكتروني غير صحيح";
                }
                // Handle password errors
                else if (message.includes("password")) {
                    errorMessage = "كلمة المرور غير صحيحة أو ضعيفة";
                }
                // Default case
                else {
                    errorMessage = "حدث خطأ في التسجيل، يرجى المحاولة مرة أخرى";
                }
            }
            
            notify(errorMessage, "error");
            return;
        }

        // Handle successful registration
        if (res.status === 200 || res.status === 201) {
            try {
                // Try different possible response structures
                let userData = null;
                let token = null;

                // Check different possible response structures
                if (res.data?.data) {
                    userData = res.data.data;
                    token = userData.token || res.data.token;
                } else if (res.data?.user) {
                    userData = res.data.user;
                    token = res.data.token;
                } else if (res.data?.token) {
                    userData = res.data;
                    token = res.data.token;
                }

                console.log("Extracted userData:", userData);
                console.log("Extracted token:", token);

                if (token && userData) {
                    // Save token and user data
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(userData));
                    
                    notify("تم التسجيل بنجاح", "success");
                    
                    // Navigate to home page
                    setTimeout(() => {
                        navigate("/");
                        window.location.reload(); // Force reload to update auth state
                    }, 1500);
                } else {
                    console.error("Token or user data missing from response");
                    notify("تم التسجيل ولكن حدث خطأ في حفظ البيانات", "warning");
                }
            } catch (error) {
                console.error('Storage error:', error);
                notify("حدث خطأ في حفظ بيانات المستخدم", "error");
            }
        } else if (res.data) {
            // Fallback for older response format or handle any remaining errors
            try {
                // Check if there are still errors in the response
                if (res.data.message) {
                    const message = res.data.message;
                    
                    // Handle duplicate email error in fallback
                    if (message.includes("E11000") && message.includes("email")) {
                        notify("البريد الإلكتروني مستخدم بالفعل، يرجى استخدام بريد إلكتروني آخر", "error");
                        return;
                    }
                    // Handle duplicate phone error  
                    else if (message.includes("E11000") && message.includes("phone")) {
                        notify("رقم الهاتف مستخدم بالفعل، يرجى استخدام رقم آخر", "error");
                        return;
                    }
                }
                
                const userData = res.data.data || res.data;
                const token = userData.token || res.data.token;
                
                if (token) {
                    localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));
                notify("تم التسجيل بنجاح", "success");
                    
                    setTimeout(() => {
                navigate("/");
                        window.location.reload();
                    }, 1500);
                } else {
                    notify("حدث خطأ في الحصول على بيانات المصادقة", "error");
                }
            } catch (error) {
                console.error('Storage error:', error);
                notify("حدث خطأ في حفظ بيانات المستخدم", "error");
            }
        } else {
            // No response data at all
            notify("حدث خطأ في التواصل مع الخادم، يرجى المحاولة مرة أخرى", "error");
        }
    }
   }, [res, navigate, loading]);

   useEffect(() => {
    return () => {
        setIsSubmitted(false);
        setLoading(false);
    };
   }, []);

  return [onchangename, onchangeEmail, onchangePhone, onchangePass, onchangeRpass, onsubmit, onchangelastname, name, email, phone, pass, rpass, loading, lastname];
}

export default RegisterHook;
