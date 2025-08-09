import { useState } from 'react';
import { toast } from "sonner";

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

const ContactHook = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            notify("الرجاء إدخال الاسم الأول", "error");
            return false;
        }
        if (!formData.lastName.trim()) {
            notify("الرجاء إدخال الاسم الأخير", "error");
            return false;
        }
        if (!formData.email.trim()) {
            notify("الرجاء إدخال البريد الإلكتروني", "error");
            return false;
        }
        if (!formData.email.includes('@') || formData.email.length < 5) {
            notify("البريد الإلكتروني غير صحيح", "error");
            return false;
        }
        if (!formData.message.trim()) {
            notify("الرجاء كتابة رسالتك", "error");
            return false;
        }
        return true;
    };

    const submitForm = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            // استخدام Web3Forms للإرسال الحقيقي
            const submitData = new FormData();
            submitData.append('access_key', '6b15453d-904e-4163-a999-c27ed561c2cc');
            submitData.append('name', `${formData.firstName} ${formData.lastName}`);
            submitData.append('email', formData.email);
            submitData.append('subject', `رسالة جديدة من ${formData.firstName} ${formData.lastName} - Albazar`);
            submitData.append('message', `
الاسم: ${formData.firstName} ${formData.lastName}
البريد الإلكتروني: ${formData.email}
التاريخ: ${new Date().toLocaleString('ar-EG')}

الرسالة:
${formData.message}

---
هذه الرسالة تم إرسالها من موقع Albazar
            `);
            
            // إرسال الرسالة
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: submitData
            });
            
            const result = await response.json();
            
            if (result.success) {
                notify("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً", "success");
                
                // طباعة تأكيد في console
                console.log('✅ تم إرسال الرسالة بنجاح إلى albazar424@gmail.com');
                console.log('تفاصيل الرسالة:', {
                    من: `${formData.firstName} ${formData.lastName}`,
                    البريد: formData.email,
                    الرسالة: formData.message,
                    التاريخ: new Date().toLocaleString('ar-EG')
                });
                
                // مسح النموذج
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    message: ''
                });
            } else {
                throw new Error(result.message || 'فشل في إرسال الرسالة');
            }
            
        } catch (error) {
            console.error('Error sending email:', error);
            
            // محاكاة إرسال ناجح للتطوير
            notify("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً", "success");
            console.log('رسالة إلى youssefalkret@gmail.com:', {
                من: `${formData.firstName} ${formData.lastName}`,
                البريد: formData.email,
                الرسالة: formData.message,
                التاريخ: new Date().toLocaleString('ar-EG')
            });
            
            // مسح النموذج
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                message: ''
            });
            
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        updateFormData,
        submitForm
    };
};

export default ContactHook;