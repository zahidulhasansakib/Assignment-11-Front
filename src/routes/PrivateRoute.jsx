// src/routes/PrivateRoute.jsx
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const axios = useAxiosSecure();

  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.email) {
        try {
          // ইউজারের role fetch করুন
          const response = await axios.get(`/users/role/${user.email}`);
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Role check error:", error);
        }
      }
      setChecking(false);
    };

    checkUserRole();
  }, [user, axios]);

  // Loading state
  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User না থাকলে login page এ redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Blocked user check
  if (user.status === "blocked") {
    return <Navigate to="/login" replace />;
  }

  // Role check - allowedRoles empty হলে সব role allowed
  if (allowedRoles.length > 0) {
    // Admin সবকিছু access করতে পারে
    if (userRole === "admin") {
      return children;
    }

    // নির্দিষ্ট role check
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
