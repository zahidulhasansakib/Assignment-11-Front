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
  FaTachometerAlt,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";

const TutorDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
    setSidebarOpen(false);
  };

  const navItems = [
    {
      to: "/",
      icon: FaHome,
      label: "Home",
      onClick: handleGoHome,
      isHome: true,
    },
    {
      to: "/tutor/my-applications",
      icon: FaFileAlt,
      label: "My Applications",
    },
    {
      to: "/tutor/ongoing-tuitions",
      icon: FaClock,
      label: "Ongoing Tuitions",
    },
    {
      to: "/tutor/revenue",
      icon: FaMoneyBillWave,
      label: "Revenue History",
    },
    {
      to: "/tutor/profile-settings",
      icon: FaUser,
      label: "Profile Settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white z-40 shadow-2xl
      `}>
        <div className="p-6">
          {/* Logo/Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent flex items-center gap-2">
              <FaGraduationCap className="text-yellow-300" />
              Tutor Panel
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Manage your tutoring journey
            </p>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                user?.displayName?.charAt(0) || <FaUser />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.displayName || "Tutor"}
              </p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setSidebarOpen(false);
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
                  ${
                    isActive && !item.isHome
                      ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                  ${item.isHome ? "mb-2 border-b border-white/10 pb-4" : ""}
                `}>
                <item.icon
                  className={`text-xl ${item.isHome ? "text-yellow-300" : ""}`}
                />
                <span className="font-medium">{item.label}</span>
                {item.isHome && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">
                    Main
                  </span>
                )}
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-white/80 hover:bg-red-500/20 hover:text-white rounded-xl transition-all mt-6 group">
              <FaSignOutAlt className="text-xl group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-xs text-white/30 text-center">
              <p>© 2024 Tutor Panel</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="p-4 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-6 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {user?.displayName?.split(" ")[0] || "Tutor"}! 👋
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Here's what's happening with your tutoring today
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-3">
              <button
                onClick={handleGoHome}
                className="px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-gray-700 hover:text-indigo-600">
                <FaHome />
                <span>Main Website</span>
              </button>
            </motion.div>
          </div>

          {/* Dashboard Content */}
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TutorDashboard;
