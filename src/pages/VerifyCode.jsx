import { useState } from 'react';
import { Link } from 'react-router-dom';
import bacground from "../images/d546f6e96a498159a7e5672cb4265c5aa09ad7f8.jpg";
import VerifyPasswordHook from '../Hook/auth/VerifyPasswordHook';

const VerifyCode = () => {
  const [code, onChangeCode, submit, loading] = VerifyPasswordHook();

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <div className="min-h-screen w-full flex items-center justify-center font-sans relative" dir="rtl">
        <div
          className="bg-[#FFED00] bg-opacity-100 hover:bg-opacity-90 rounded-[40px] border border-yellow-300 shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center transition-all"
          style={{ minHeight: "400px" }}
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4" style={{ fontFamily: 'Cairo' }}>
            تأكيد الرمز المرسل
          </h1>
          
          <p className="text-gray-600 text-center mb-8 text-sm px-4" style={{ fontFamily: 'Cairo' }}>
            قم بإدخال رمز التفعيل المرسل لبريدك الإلكتروني/ رقم
            <br />
            الموبايل لتغيير كلمة المرور
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-gray-900 text-right mb-2" style={{ fontFamily: 'Cairo' }}>
                رمز التأكيد
              </label>
              <input
                type="text"
                value={code}
                onChange={onChangeCode}
                maxLength={6}
                className="w-full px-4 py-3 rounded-full border border-black text-black text-right placeholder-black bg-transparent hover:border-yellow-400 transition-colors"
                style={{ fontFamily: 'Cairo' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e1414] text-yellow-400 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Cairo' }}
            >
              {loading ? 'جاري التحقق...' : 'تأكيد'}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
      `}</style>
    </>
  );
};

export default VerifyCode; 