import { useState } from 'react';
import bacground from "../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg";
import ResetPasswordHook from '../Hook/auth/ResetPasswordHook';

const NewPassword = () => {
  const [password, confirmPassword, onChangePassword, onChangeConfirmPassword, submit, loading] = ResetPasswordHook();
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword || password !== confirmPassword) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    submit();
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
      <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center font-sans relative" dir="rtl">
        <div
          className="bg-[#FFED00] bg-opacity-100 hover:bg-opacity-90 rounded-[40px] border border-yellow-300 shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center transition-all"
          style={{ minHeight: "450px" }}
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4" style={{ fontFamily: 'Cairo' }}>
            إنشاء كلمة مرور جديدة
          </h1>
          
          <p className="text-gray-600 text-center mb-8 text-sm px-4" style={{ fontFamily: 'Cairo' }}>
            قم بإنشاء كلمة مرور جديدة
          </p>

          <form onSubmit={handleSubmit} className={`space-y-6 w-full ${shake ? 'animate-shake' : ''}`}>
            <div>
              <label className="block text-gray-900 text-right mb-2" style={{ fontFamily: 'Cairo' }}>
                كلمة مرور
              </label>
              <input
                type="password"
                value={password}
                onChange={onChangePassword}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400 transition-colors"
                style={{ fontFamily: 'Cairo' }}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-gray-900 text-right mb-2" style={{ fontFamily: 'Cairo' }}>
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={onChangeConfirmPassword}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400 transition-colors"
                style={{ fontFamily: 'Cairo' }}
                required
                minLength={6}
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-2 text-right" style={{ fontFamily: 'Cairo' }}>
                  كلمة المرور غير متطابقة
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e1414] text-yellow-400 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Cairo' }}
            >
              {loading ? 'جاري التحميل...' : 'تأكيد'}
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
      `}</style>
    </>
  );
};

export default NewPassword; 