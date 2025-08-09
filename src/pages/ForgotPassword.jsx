import { useState } from 'react';
import bacground from "../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg";
import ForgetPasswordHook from '../Hook/auth/forgetPasswordHook';

const ForgotPassword = () => {
  const [shake, setShake] = useState(false);
  const [onChangeEmail, submit, email, loading] = ForgetPasswordHook();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    await submit();
  };

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
          style={{ minHeight: "400px" }}
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4" style={{ fontFamily: 'Cairo' }}>
            نسيت كلمة المرور
          </h1>
          
          <p className="text-gray-600 text-center mb-8 text-sm px-4" style={{ fontFamily: 'Cairo' }}>
            أدخل بريدك الإلكتروني المسجل أو اسم المستخدم لمساعدتك
            <br />
            في إعادة تعيين كلمة المرور الخاصة بك.
          </p>

          <form onSubmit={handleSubmit} className={`space-y-6 w-full ${shake ? 'animate-shake' : ''}`}>
            <div>
              <label className="block text-gray-900 text-right mb-2" style={{ fontFamily: 'Cairo' }}>
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={onChangeEmail}
                  className="w-full px-4 py-3 rounded-full border-2 border-black/50 text-black text-right bg-transparent hover:border-yellow-400 transition-colors focus:outline-none focus:border-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed placeholder-black"
                  style={{ fontFamily: 'Cairo' }}
                  placeholder="example@gmail.com"
                  required
                  disabled={loading}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" style={{ fontFamily: 'Cairo' }}>
                  {loading && '...جاري التحقق'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0e1414] text-yellow-400 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Cairo' }}
              disabled={loading}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');

        @keyframes shake {
          0%, 100% { 
            transform: translateX(0);
            opacity: 1;
          }
          10%, 30%, 50%, 70%, 90% { 
            transform: translateX(-8px);
            opacity: 0.9;
          }
          20%, 40%, 60%, 80% { 
            transform: translateX(8px);
            opacity: 0.9;
          }
        }

        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        ::placeholder {
          color: black !important;
          opacity: 0.8 !important;
        }
      `}</style>
    </>
  );
};

export default ForgotPassword; 