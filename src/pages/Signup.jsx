import { Link } from 'react-router-dom';
import google from "../images/google.png";
import facbook from "../images/facebook.png";
import apple from "../images/apple.png";
import bacground from "../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'country-flag-icons/react/3x2';
import RegisterHook from '../Hook/auth/registerHook';
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

const Signup = () => {
  const [
    onchangename,
    onchangeEmail,
    onchangePhone,
    onchangePass,
    onchangeRpass,
    onsubmit,
    onchangelastname,
    name,
    email,
    phone,
    pass,
    rpass,
    loading,
    lastname
  ] = RegisterHook();

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check terms agreement
    if (!agreeToTerms) {
      notify("يجب الموافقة على الشروط والأحكام", "error");
      return;
    }
    
    // Call the hook's submit function which has its own validation
      await onsubmit();
  };
//default sourai
  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bacground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="min-h-screen w-full flex items-center justify-center font-sans relative" dir="rtl">
        <div
          className="bg-[#FFED00] bg-opacity-100 hover:bg-opacity-90 rounded-[40px] border border-yellow-300 shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center transition-all"
          style={{ minHeight: "750px" }}
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 font-cairo">إنشاء حساب</h1>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2" style={{ fontFamily: 'Cairo' }}>الاسم الأول</label>
                <input
                  type="text"
                  placeholder="الاسم الأول"
                  value={name}
                  onChange={onchangename}
                  className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400"
                  required
                  style={{ fontFamily: 'Cairo' }}
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2" style={{ fontFamily: 'Cairo' }}>الاسم الأخير</label>
                <input
                  type="text"
                  placeholder="الاسم الأخير"
                  value={lastname}
                  onChange={onchangelastname}
                  className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400"
                  required
                  style={{ fontFamily: 'Cairo' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2" style={{ fontFamily: 'Cairo' }}>البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="البريد الالكتروني"
                value={email}
                onChange={onchangeEmail}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400"
                required
                autoComplete="username"
                style={{ fontFamily: 'Cairo' }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium mb-2 text-right" style={{ fontFamily: 'Cairo' }}>رقم الموبايل</label>
              <div className="phone-input-container" style={{ position: 'relative', zIndex: 50 }}>
                <PhoneInput
                  international
                  defaultCountry="SY"
                  value={phone}
                  onChange={onchangePhone}
                  className="custom-phone-input"
                  placeholder="أدخل رقم الموبايل"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2" style={{ fontFamily: 'Cairo' }}>كلمة المرور</label>
              <input
                type="password"
                placeholder="كلمة المرور"
                value={pass}
                onChange={onchangePass}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400"
                required
                style={{ fontFamily: 'Cairo' }}
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2" style={{ fontFamily: 'Cairo' }}>تأكيد كلمة المرور</label>
              <input
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={rpass}
                onChange={onchangeRpass}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400"
                required
                style={{ fontFamily: 'Cairo' }}
              />
            </div>

            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="sr-only"
                  required
                />
                <label
                  htmlFor="terms"
                  className={`
                    w-5 h-5 border-2 border-black rounded cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-yellow-600
                    ${agreeToTerms ? "bg-[#FFED00] border-[#FFED00]" : "bg-transparent"}
                  `}
                >
                  {agreeToTerms && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </label>
              </div>
              <label htmlFor="terms" className="text-xs text-gray-900 leading-relaxed cursor-pointer">
              اعرض منتجاتك علي عالبازار
                
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreeToTerms}
              className={`w-full bg-[#0e1414] text-yellow-400 py-3 rounded-lg font-medium transition-colors ${
                loading || !agreeToTerms ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Cairo' }}
            >
              {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
            </button>



            <div className="text-center mt-4">
              <span className="text-gray-700 text-sm" style={{ fontFamily: 'Cairo' }}>
                لديك حساب بالفعل؟{" "}
                <Link to="/login" className="text-gray-900 font-medium hover:underline" style={{ fontFamily: 'Cairo' }}>
                  تسجيل الدخول
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

        .phone-input-container {
          position: relative;
        }

        .custom-phone-input .PhoneInputInput {
          width: 100% !important;
          padding: 12px 16px !important;
          border-radius: 9999px !important;
          border: 1px solid black !important;
          background: transparent !important;
          color: black !important;
          font-size: 16px !important;
          transition: all 0.2s ease !important;
          font-family: 'Cairo', sans-serif !important;
        }

        .custom-phone-input .PhoneInputInput:hover {
          border-color: #facc15 !important;
        }

        .custom-phone-input .PhoneInputInput::placeholder {
          color: black !important;
          opacity: 0.7 !important;
          font-family: 'Cairo', sans-serif !important;
        }

        .custom-phone-input .PhoneInputCountry {
          background: transparent !important;
          border-radius: 9999px !important;
          padding: 6px 12px !important;
          border: 1px solid black !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          min-width: 90px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .custom-phone-input .PhoneInputCountry:hover {
          border-color: #facc15 !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .custom-phone-input .PhoneInputCountryIcon {
          width: 24px !important;
          height: 16px !important;
          border-radius: 2px !important;
          overflow: hidden !important;
        }

        .custom-phone-input .PhoneInputCountryIcon img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .custom-phone-input .PhoneInputCountrySelectArrow {
          color: black !important;
          opacity: 0.7 !important;
          margin-right: 8px !important;
        }

        .custom-phone-input .PhoneInputCountrySelect {
          position: absolute !important;
          inset: auto 0 auto 0 !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          background: white !important;
          cursor: pointer !important;
          direction: rtl !important;
          z-index: 100 !important;
        }

        .custom-phone-input select {
          direction: rtl !important;
        }

        .custom-phone-input select option {
          font-family: 'Cairo', sans-serif !important;
          padding: 8px 12px !important;
          background: white !important;
          color: black !important;
          direction: rtl !important;
        }

        .custom-phone-input {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          position: relative !important;
        }

        .PhoneInputCountry select {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background: white !important;
          border: 1px solid black !important;
          border-radius: 12px !important;
          margin-top: 4px !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
          max-height: 200px !important;
          overflow-y: auto !important;
        }

        .PhoneInputCountrySelect option {
          padding: 10px 15px !important;
          cursor: pointer !important;
          transition: background 0.2s ease !important;
        }

        .PhoneInputCountrySelect option:hover {
          background-color: #f3f4f6 !important;
        }

        .phone-input-container .PhoneInput {
          position: relative !important;
          z-index: 10 !important;
        }

        .phone-input-container .PhoneInputCountry {
          z-index: 20 !important;
        }
      `}</style>
    </>
  );
};

export default Signup;