// src/pages/dashboard/TutorDashboard/TutorDashboard.jsx
import React, { useContext, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import { motion } from "framer-motion";
import {
  FaHome,
  FaFileAlt,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const TutorDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const navItems = [
    { to: "/tutor/my-applications", icon: FaFileAlt, label: "My Applications" },
    { to: "/tutor/ongoing-tuitions", icon: FaClock, label: "Ongoing Tuitions" },
    { to: "/tutor/revenue", icon: FaMoneyBillWave, label: "Revenue History" },
    { to: "/tutor/profile-settings", icon: FaUser, label: "Profile Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg">
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-gradient-to-b from-blue-800 to-purple-800 text-white z-40
      `}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Tutor Panel</h2>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.displayName || "Tutor"}
              </p>
              <p className="text-xs text-white/70 truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-white text-blue-800 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }
                `}
                onClick={() => setSidebarOpen(false)}>
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all mt-4">
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TutorDashboard;
