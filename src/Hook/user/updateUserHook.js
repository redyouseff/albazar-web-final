import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUdpateData, useUpdateDataWithImage } from '../../hooks/UseUpdataData';
import { updateUser as updateUserAction } from '../../redux/Actions/UserActions';
import { toast } from "../../components/ui/sonner";

export const UpdateUserHook = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const response = useSelector((state) => state.user.updateUser);

    // التحقق من صحة كلمة المرور
    const validatePassword = (password, confirmPassword) => {
        const errors = {};
        
        if (!password) {
            errors.password = 'كلمة المرور مطلوبة';
        } else if (password.length < 6) {
            errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'كلمة المرور غير متطابقة';
        }

        return errors;
    };

    // تحديث كلمة المرور
    const updatePassword = async (password, confirmPassword) => {
        try {
            // التحقق من صحة كلمة المرور
            const errors = validatePassword(password, confirmPassword);
            if (Object.keys(errors).length > 0) {
                return {
                    success: false,
                    errors
                };
            }

            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await dispatch(updateUserAction({ password }));
            console.log('Password update result:', result);
            
            if (result?.payload?.status === 200 || result?.payload?.data?.status === 'success') {
                setSuccess(true);
                toast("تم تحديث كلمة المرور", {
                    description: "تم تحديث كلمة المرور بنجاح",
                    duration: 3000,
                    style: { 
                        background: '#10B981',
                        color: 'white',
                        direction: 'rtl'
                    }
                });
                return {
                    success: true,
                    message: "تم تحديث كلمة المرور بنجاح"
                };
            }
            
            const errorMessage = result?.payload?.data?.message || result?.payload?.message || "حدث خطأ في تحديث كلمة المرور";
            throw new Error(errorMessage);
            
        } catch (err) {
            console.error("Error updating password:", err);
            const errorMessage = err.message || "حدث خطأ في تحديث كلمة المرور";
            setError(errorMessage);
            toast("خطأ في تحديث كلمة المرور", {
                description: errorMessage,
                duration: 3000,
                style: { 
                    background: '#EF4444',
                    color: 'white',
                    direction: 'rtl'
                }
            });
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    // تحديث معلومات المستخدم
    const updateUser = async (userData, profileImage = null) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            let formData;
            
            if (profileImage) {
                formData = new FormData();
                Object.keys(userData).forEach(key => {
                    if (userData[key] !== undefined && userData[key] !== null && userData[key] !== '') {
                        formData.append(key, userData[key]);
                    }
                });
                formData.append('profileImage', profileImage);
            } else {
                // تجاهل الحقول الفارغة
                formData = Object.keys(userData).reduce((acc, key) => {
                    if (userData[key] !== undefined && userData[key] !== null && userData[key] !== '') {
                        acc[key] = userData[key];
                    }
                    return acc;
                }, {});
            }

            const result = await dispatch(updateUserAction(formData));
            console.log('Update result:', result);
            
            // تحقق من حالة النجاح
            if (result?.payload?.status === 200 || result?.payload?.data?.status === 'success') {
                setSuccess(true);
                
                // تحديث localStorage مع البيانات الجديدة
                try {
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    const updatedUser = {
                        ...currentUser,
                        ...userData,
                        profileImage: result?.payload?.data?.profileImage || currentUser.profileImage
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (error) {
                    console.error('Error updating localStorage:', error);
                }
                
                toast("تم تحديث البيانات", {
                    description: "تم تحديث معلومات حسابك بنجاح",
                    duration: 3000,
                    style: { 
                        background: '#10B981',
                        color: 'white',
                        direction: 'rtl'
                    }
                });
              
                return {
                    success: true,
                    data: result?.payload?.data,
                    message: "تم تحديث البيانات بنجاح"
                };
            }
            
            // إذا لم تكن الاستجابة ناجحة
            const errorMessage = result?.payload?.data?.message || result?.payload?.message || "حدث خطأ في تحديث البيانات";
            throw new Error(errorMessage);
            
        } catch (err) {
            console.error('Update error:', err);
            
            const errorMessage = err.message || "حدث خطأ في تحديث البيانات";
            setError(errorMessage);
            
            toast("خطأ في التحديث", {
                description: errorMessage,
                duration: 3000,
                style: { 
                    background: '#EF4444',
                    color: 'white',
                    direction: 'rtl'
                }
            });
            
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    // مراقبة التغييرات في response
    useEffect(() => {
        if (response) {
            console.log('Response in useEffect:', response);
            
            if (response?.status === 200 || response?.data?.status === 'success') {
                setSuccess(true);
                setError(null);
            } else if (response?.status >= 400 || response?.response?.status >= 400) {
                const errorMessage = response?.data?.message || response?.response?.data?.message || "حدث خطأ في العملية";
                setError(errorMessage);
                setSuccess(false);
            }
            
            setLoading(response?.loading || false);
        }
    }, [response]);

    const clearState = () => {
        setError(null);
        setSuccess(false);
    };

    return {
        updateUser,
        updatePassword,
        loading: response?.loading || loading,
        error: response?.error || error,
        success,
        clearState,
        validatePassword
    };
};