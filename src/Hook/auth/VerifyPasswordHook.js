import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import notify from '../useNotifaction'
import { useNavigate } from 'react-router-dom'
import { verifyCode } from '../../redux/Actions/AuthActions'

const VerifyPasswordHook = () => {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const onChangeCode = (e) => {
        const value = e.target.value
        // تقييد الإدخال للأرقام فقط وبحد أقصى 6 أرقام
        if (value === '' || (/^\d{0,6}$/.test(value))) {
            setCode(value)
        }
    }

    const validation = () => {
        let isValid = true

        if (!code.trim()) {
            notify("من فضلك أدخل رمز التحقق", "error")
            isValid = false
        } else if (code.length !== 6) {
            notify("رمز التحقق يجب أن يكون 6 أرقام", "error")
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

            const result = await dispatch(verifyCode({
                resetCode: code,
                email: email
            }))

            const response = result.payload

            if (response.status === 200 || (response.data && response.data.status === "Success")) {
                notify("تم التحقق من الرمز بنجاح", "success")
                setTimeout(() => {
                    navigate("/new-password")
                }, 1500)
            } else {
                let errorMessage = "رمز التحقق غير صالح"
                let shouldRedirect = false

                if (response.status === 500) {
                    errorMessage = "حدث خطأ في التحقق من الرمز"
                    shouldRedirect = true
                } else if (response.message === "Token expired" || response.data?.message === "Token expired") {
                    errorMessage = "انتهت صلاحية رمز التحقق"
                    shouldRedirect = true
                }

                notify(errorMessage, "error")

                if (shouldRedirect) {
                    setTimeout(() => {
                        navigate("/forgot-password")
                    }, 1500)
                }
            }
        } catch (error) {
            console.error('Verify code error:', error)
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

    return [code, onChangeCode, submit, loading]
}

export default VerifyPasswordHook
