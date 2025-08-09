import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { toast } from "../../components/ui/sonner";
import { changePassword } from '../../redux/Actions/UserActions';

const ChangePasswordHook = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch();
    const response = useSelector((state) => state.user.changePassword);

    // مراقبة التغييرات في response
    useEffect(() => {
        if (response) {
            setLoading(response.loading || false);
            
            if (response.status === 200 && response.data?.token) {
                setSuccess(true);
                setError(null);
                
                // عرض رسالة النجاح
                toast("تم تحديث كلمة المرور بنجاح", {
                    duration: 3000,
                    style: { 
                        background: '#10B981',
                        color: 'white',
                        direction: 'rtl'
                    }
                });

                // مسح بيانات المستخدم من localStorage و التحويل بعد ثانيتين
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }, 2000);
            } else if (response.error) {
                setError(response.error);
                setSuccess(false);
                
                // عرض رسالة الخطأ
                toast("خطأ", {
                    description: response.error,
                    duration: 3000,
                    style: { 
                        background: '#EF4444',
                        color: 'white',
                        direction: 'rtl'
                    }
                });
            }
        }
    }, [response]);

    // تحديث كلمة المرور
    const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            setFormErrors({});

            // التحقق من صحة المدخلات
            const errors = validatePassword(currentPassword, newPassword, confirmPassword);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                setLoading(false);
                return {
                    success: false,
                    errors
                };
            }

            // إرسال طلب تحديث كلمة المرور
            await dispatch(changePassword({
                currrentPassword: currentPassword,
                password: newPassword,
                confirmPassword: confirmPassword
            }));

            return {
                success: true
            };

        } catch (err) {
            setError(err.message);
            return {
                success: false,
                error: err.message
            };
        }
    };

    // التحقق من صحة كلمة المرور
    const validatePassword = (currentPassword, newPassword, confirmPassword) => {
        const errors = {};

        if (!currentPassword) {
            errors.currentPassword = 'كلمة المرور الحالية مطلوبة';
        }

        if (!newPassword) {
            errors.password = 'كلمة المرور الجديدة مطلوبة';
        } else if (newPassword.length < 6) {
            errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'كلمة المرور غير متطابقة';
        }

        return errors;
    };

    // مسح الحالة
    const clearState = () => {
        setError(null);
        setSuccess(false);
        setFormErrors({});
    };

    return {
        updatePassword,
        loading,
        error,
        success,
        formErrors,
        clearState,
        validatePassword
    };
};

export default ChangePasswordHook;
