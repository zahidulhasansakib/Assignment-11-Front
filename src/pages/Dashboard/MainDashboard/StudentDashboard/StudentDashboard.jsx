import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaSearch,
  FaChevronDown,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import Aside from "../../../../Components/Navbar/Aside";

const StudentDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); // Desktop এ sidebar খোলা রাখুন
      } else {
        setSidebarOpen(false); // Mobile এ sidebar বন্ধ রাখুন
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect based on role
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "tutor") {
      navigate("/tutor");
    }
  }, [user, navigate]);

  // Body scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, sidebarOpen]);

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const overlayVariants = {
    open: { opacity: 1, pointerEvents: "auto" },
    closed: { opacity: 0, pointerEvents: "none" },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isMobile ? (sidebarOpen ? "open" : "closed") : "open"}
        className={`fixed md:static top-0 left-0 h-screen z-50 ${
          !isMobile ? "translate-x-0" : ""
        }`}>
        <Aside onClose={() => setSidebarOpen(false)} />
      </motion.div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-gray-50 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                aria-label="Toggle menu">
                {sidebarOpen ? (
                  <FaTimes className="text-xl text-gray-700" />
                ) : (
                  <FaBars className="text-xl text-gray-700" />
                )}
              </button>

              {/* Page Title */}
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                Student Dashboard
              </h1>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:block relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <FaBell className="text-lg sm:text-xl text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "S"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.displayName || "Student"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {user?.email}
                    </p>
                  </div>
                  <FaChevronDown className="hidden md:block text-gray-500 text-xs" />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-40">
                      <div className="md:hidden px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">
                          {user?.displayName || "Student"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile Settings
                      </Link>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaHome className="inline mr-2 text-sm" />
                        Back to Home
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden px-3 pb-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          input,
          button {
            font-size: 16px !important;
          }
        }

        /* Hide scrollbar for mobile menu */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }

        /* Smooth transitions */
        * {
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
