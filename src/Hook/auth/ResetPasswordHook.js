import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import notify from '../useNotifaction'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '../../redux/Actions/AuthActions'

const ResetPasswordHook = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const validation = () => {
        let isValid = true

        if (!password.trim()) {
            notify("من فضلك أدخل كلمة المرور", "error")
            isValid = false
        } else if (password.length < 6) {
            notify("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error")
            isValid = false
        }

        if (!confirmPassword.trim()) {
            notify("من فضلك أدخل تأكيد كلمة المرور", "error")
            isValid = false
        } else if (password !== confirmPassword) {
            notify("كلمة المرور غير متطابقة", "error")
            isValid = false
        }

        return isValid
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submit = async () => {
        if (!validation()) return

        try {
            setLoading(true)
            const email = localStorage.getItem("email")
            if (!email) {
                notify("حدث خطأ، برجاء إعادة المحاولة من البداية", "error")
                navigate("/forgot-password")
                return
            }

            const result = await dispatch(resetPassword({
                email: email,
                password: password   
            }))

            const response = result.payload

            if (response.status === 200 || response.data?.status === "Success") {
                notify("تم تغيير كلمة المرور بنجاح", "success")
                setTimeout(() => {
                    localStorage.removeItem("email")
                    navigate("/login")
                }, 1500)
            } else {
                let errorMessage = "حدث خطأ غير متوقع، برجاء المحاولة مرة أخرى"
                let shouldRedirect = false

                if (response.status === 500 && response.data?.message === "reset code are not verifyied") {
                    errorMessage = "لم يتم التحقق من الرمز، برجاء إعادة طلب رمز جديد"
                    shouldRedirect = true
                } else if (response.message === "Token expired" || response.data?.message === "Token expired") {
                    errorMessage = "انتهت صلاحية رمز التحقق، برجاء المحاولة مرة أخرى"
                    shouldRedirect = true
                } else if (response.status === 429) {
                    errorMessage = "برجاء الانتظار قبل إعادة المحاولة"
                }

                notify(errorMessage, "error")

                if (shouldRedirect) {
                    setTimeout(() => {
                        navigate("/forgot-password")
                    }, 1500)
                }
            }
        } catch (error) {
            console.error('Reset password error:', error)
            notify("حدث خطأ في الاتصال بالخادم", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const email = localStorage.getItem("email")
        if (!email) {
            notify("برجاء إدخال البريد الإلكتروني أولاً", "error")
            navigate("/forgot-password")
        }
    }, [navigate])

    return [password, confirmPassword, onChangePassword, onChangeConfirmPassword, submit, loading]
}

export default ResetPasswordHook