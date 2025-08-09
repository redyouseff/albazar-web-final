import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ auth, children, loading }) => {
  console.log("ProtectedRoute - auth:", auth, "loading:", loading);
  
  // إذا كان لسة بيحمّل، أظهر loading
  if (loading) {
    return React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }
    }, "جاري التحميل...");
  }
  
  // إذا مش مصرح له، حوله للـ login
  if (!auth) {
    return React.createElement(Navigate, { to: "/login", replace: true });
  }

  return children || React.createElement(Outlet);
};

export default ProtectedRoute;
