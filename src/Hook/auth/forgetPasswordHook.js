import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgetPassword } from '../../redux/Actions/AuthActions'
import notify from '../useNotifaction'
import { useNavigate } from 'react-router-dom'

const ForgetPasswordHook = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    
    const onChangeEmail = (e) => {
        const value = e.target.value
        setEmail(value)
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validation = () => {
        setIsSubmitted(true)
        let isValid = true

        if (!email.trim()) {
            notify("من فضلك أدخل البريد الإلكتروني", "error")
            isValid = false
        } else if (!validateEmail(email)) {
            notify("من فضلك أدخل بريد إلكتروني صحيح", "error")
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
            const result = await dispatch(forgetPassword({
                email: email
            }))

            if (result.payload?.data?.status === "success" || result.payload?.status === 200) {
                notify("تم إرسال رمز التحقق إلى بريدك الإلكتروني", "success")
                localStorage.setItem("email", email)
                setTimeout(() => {
                    navigate("/verify-code")
                }, 1500)
                return
            }

            if (result.payload?.message?.includes("Email not found")) {
                notify("البريد الإلكتروني غير مسجل في النظام", "error")
                return
            }

            const errorMessage = 
                result.payload?.status === 429 ? "برجاء الانتظار قبل إعادة المحاولة" :
                result.payload?.status === 500 ? "حدث خطأ في الخادم، برجاء المحاولة لاحقاً" :
                result.payload?.message || "حدث خطأ غير متوقع، برجاء المحاولة مرة أخرى"
            
            notify(errorMessage, "error")
        } catch (error) {
            console.error('Forget password error:', error)
            notify("حدث خطأ في الاتصال بالخادم", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            setIsSubmitted(false)
            setLoading(false)
        }
    }, [])

    return [onChangeEmail, submit, email, loading]
}

export default ForgetPasswordHook
