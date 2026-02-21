// src/pages/dashboard/mainDashboard/StudentDashboard/StudentDashboard.jsx
import { Outlet } from "react-router-dom";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import Aside from "../../../../Components/Navbar/Aside";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not student, redirect to appropriate dashboard
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "tutor") {
      navigate("/tutor");
    }
  }, [user]);

  return (
    <div className="flex">
      <Aside />
      <div className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;
