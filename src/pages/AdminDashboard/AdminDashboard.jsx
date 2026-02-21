// src/pages/dashboard/AdminDashboard/AdminDashboard.jsx
import React, { useContext, useEffect } from "react";
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
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axios = useAxiosSecure();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Verify admin role
  useEffect(() => {
    checkAdminRole();
  }, []);

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

  const navItems = [
    { to: "/admin/users", icon: FaUsers, label: "User Management" },
    { to: "/admin/tuitions", icon: FaBook, label: "Tuition Management" },
    { to: "/admin/reports", icon: FaChartBar, label: "Reports & Analytics" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg">
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-gradient-to-b from-purple-800 to-indigo-800 text-white z-40
      `}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUsers />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.displayName || "Admin"}
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
                      ? "bg-white text-purple-800 shadow-lg"
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

export default AdminDashboard;
