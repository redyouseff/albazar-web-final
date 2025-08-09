import { useState } from 'react';
import { Link } from 'react-router-dom';
import google from "../images/google.png"
import facbook from "../images/facebook.png"
import apple from "../images/apple.png"
import loginBg from "../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg"
import loginHook from '../Hook/auth/loginHook';

const Login = () => {
  const [email, pass, onChangeEmail, onChangePass, onSubmit, press, loading] = loginHook();
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      return;
    }
    onSubmit();
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#ffe600",
          backgroundImage: "url('../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -10,
        }}
      />
      <div className="min-h-screen w-full flex items-center justify-center font-sans relative" dir="rtl">
        <div
          className="bg-[#FFED00] bg-opacity-100 hover:bg-opacity-90 rounded-[40px] border border-yellow-300 shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center transition-all"
          style={{ minHeight: "550px" }}
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 font-cairo">
            تسجيل الدخول
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-gray-900 text-right mb-2 font-cairo">
                البريد الإلكتروني
              </label> 
              <input
                type="email"
                value={email}
                onChange={onChangeEmail}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400 transition-colors font-noon"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 text-right mb-2 font-cairo">
                كلمة المرور
              </label>
              <input
                type="password"
                value={pass}
                onChange={onChangePass}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400 transition-colors font-noon"
                required
              />
              <div className="text-right mt-1">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-gray-600 hover:text-gray-800 font-cairo"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="sr-only"
                  required
                />
                <label
                  htmlFor="agree"
                  className={`
                    w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center transition-all duration-200
                    ${agree ? "bg-[#FFED00] border-[#FFED00]" : "bg-transparent"}
                  `}
                >
                  {agree && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </label>
              </div>
              <label htmlFor="agree" className="text-gray-800 cursor-pointer" style={{ fontFamily: 'Cairo' }}>
                موافق على الشروط والأحكام
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agree}
              className={`w-full bg-[#0e1414] text-yellow-400 py-3 rounded-full font-medium transition-colors ${
                loading || !agree ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Cairo' }}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>



            <div className="text-center mt-4">
              <span className="text-gray-700" style={{ fontFamily: 'Cairo' }}>
                ليس لديك حساب؟{" "}
                <Link to="/signup" className="text-gray-900 hover:underline" style={{ fontFamily: 'Cairo' }}>
                  سجل الآن
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
      `}</style>
    </>
  );
};

export default Login;
