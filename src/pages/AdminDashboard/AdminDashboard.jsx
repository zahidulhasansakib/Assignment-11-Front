// src/pages/dashboard/AdminDashboard/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBook,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaCog,
  FaMoneyBillWave,
  FaBell,
  FaUserCircle,
  FaChevronDown,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axios = useAxiosSecure();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Verify admin role
  useEffect(() => {
    if (user?.email) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const response = await axios.get(`/users/role/${user?.email}`);
      if (response.data.role !== "admin") {
        toast.error("Unauthorized access");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking role:", error);
    }
  };

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
      color: "yellow",
    },
    {
      to: "/admin/users",
      icon: FaUsers,
      label: "User Management",
      color: "blue",
    },
    {
      to: "/admin/tuitions",
      icon: FaBook,
      label: "Tuition Management",
      color: "green",
    },
    {
      to: "/admin/reports",
      icon: FaChartBar,
      label: "Reports & Analytics",
      color: "purple",
    },
  
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <FaBars size={20} />
        </button>
        <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-indigo-600 text-2xl" />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-gradient-to-b from-indigo-800 to-purple-800 text-white z-50 shadow-2xl
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Close Button for Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <FaTimes />
          </button>

          {/* Logo */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaShieldAlt className="text-yellow-300" />
              Admin Panel
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Manage your platform</p>
          </div>

          {/* User Info */}
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.displayName?.charAt(0) || "A"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {user?.displayName || "Admin"}
                </p>
                <p className="text-indigo-200 text-sm truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={
                  item.onClick ||
                  (() => {
                    navigate(item.to);
                    setSidebarOpen(false);
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.isHome
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}>
                <item.icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
                {item.isHome && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">
                    Main
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-white rounded-xl transition-all">
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <p className="text-indigo-200 text-xs">© 2024 Admin Panel v2.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        {/* Top Bar */}
        <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <FaBars className="text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.displayName?.split(" ")[0] || "Admin"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <FaBell className="text-gray-600 text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.displayName?.charAt(0) || "A"}
                  </div>
                  <FaChevronDown className="text-gray-400 text-sm" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => navigate("/admin/profile")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                      <FaUserCircle className="text-gray-500" />
                      <span className="text-sm">Profile</span>
                    </button>
                 
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2">
                      <FaSignOutAlt />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
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
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
