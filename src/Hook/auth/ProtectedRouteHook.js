import React, { useEffect, useState } from 'react'

const ProtectedRouteHook = () => {
    // التعامل الآمن مع localStorage
    const getUserFromStorage = () => {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return null;
        }
    };

    const [userData, setUserData] = useState(getUserFromStorage());
    const [isUser, setIsUser] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // استخدام useEffect لتجنب infinite re-renders

    useEffect(() => {
        console.log("ProtectedRouteHook - userData:", userData);
        
        if (userData != null) {
            if (userData?.role === "user") {
                setIsAdmin(false);
                setIsUser(true);
            } else if (userData?.role === "admin") {
                setIsAdmin(true);
                setIsUser(false);
            } else {
                // في حالة وجود role غير معروف
                setIsAdmin(false);
                setIsUser(false);
            }
        } else {
            setIsAdmin(false);
            setIsUser(false);
        }
        
        // انتهى التحميل
        setLoading(false);
    }, [userData]); // يتم تشغيله عند تغيير userData

    // دالة لتحديث بيانات المستخدم
    const updateUserData = () => {
        setUserData(getUserFromStorage());   
    };

    return [isUser, isAdmin, userData, updateUserData, loading];
};

export default ProtectedRouteHook;

