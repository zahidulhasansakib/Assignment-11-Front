// src/components/Navbar/Aside.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaBoxOpen,
  FaPlusCircle,
  FaShoppingCart,
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaBook,
  FaMoneyBillWave,
  FaClock,
  FaFileAlt,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const Aside = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  // Get role-based icon and color
  const getRoleInfo = () => {
    switch (user?.role) {
      case "admin":
        return {
          icon: <FaUserTie className="text-2xl" />,
          color: "from-purple-600 to-indigo-600",
          text: "Admin",
        };
      case "tutor":
        return {
          icon: <FaChalkboardTeacher className="text-2xl" />,
          color: "from-green-600 to-emerald-600",
          text: "Tutor",
        };
      case "student":
        return {
          icon: <FaUserGraduate className="text-2xl" />,
          color: "from-blue-600 to-cyan-600",
          text: "Student",
        };
      default:
        return {
          icon: <FaUsers className="text-2xl" />,
          color: "from-gray-600 to-gray-700",
          text: "User",
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-base-200 to-base-300 shadow-xl flex flex-col">
      {/* Profile Section */}
      <div className={`p-6 bg-gradient-to-r ${roleInfo.color} text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              roleInfo.icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm opacity-90 truncate">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              {roleInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <ul className="menu px-4 py-6 gap-2 text-base-content">
          {/* Dashboard Home */}
          <li>
            <Link
              to={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "tutor"
                    ? "/tutor"
                    : "/dashboard"
              }
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white transition-all">
              <FaChartPie className="text-lg" />
              Dashboard
            </Link>
          </li>

          {/* Student Links */}
          {user?.role === "student" && (
            <>
              <li className="menu-title text-xs opacity-60 mt-4 mb-2">
                STUDENT MENU
              </li>
              <li>
                <Link
                  to="/dashboard/my-tuitions"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaBoxOpen className="text-lg" /> My Tuitions
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/post-tuition"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaPlusCircle className="text-lg" /> Post Tuition
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/applied-tutors"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaUsers className="text-lg" /> Applied Tutors
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/payments"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaShoppingCart className="text-lg" /> Payments
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/profile-settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaCog className="text-lg" /> Profile Settings
                </Link>
              </li>
            </>
          )}

          {/* Tutor Links */}
          {user?.role === "tutor" && (
            <>
              <li className="menu-title text-xs opacity-60 mt-4 mb-2">
                TUTOR MENU
              </li>
              <li>
                <Link
                  to="/tutor/my-applications"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaFileAlt className="text-lg" /> My Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/tutor/ongoing-tuitions"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaClock className="text-lg" /> Ongoing Tuitions
                </Link>
              </li>
              <li>
                <Link
                  to="/tutor/revenue"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaMoneyBillWave className="text-lg" /> Revenue History
                </Link>
              </li>
              <li>
                <Link
                  to="/tutor/profile-settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaCog className="text-lg" /> Profile Settings
                </Link>
              </li>
            </>
          )}

          {/* Admin Links */}
          {user?.role === "admin" && (
            <>
              <li className="menu-title text-xs opacity-60 mt-4 mb-2">
                ADMIN MENU
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaUsers className="text-lg" /> User Management
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/tuitions"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaBook className="text-lg" /> Tuition Management
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reports"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaChartPie className="text-lg" /> Reports & Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/profile-settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary hover:text-white">
                  <FaCog className="text-lg" /> Profile Settings
                </Link>
              </li>
            </>
          )}

          <div className="divider my-4"></div>

          {/* Common Links */}
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-secondary hover:text-white">
              <FaHome className="text-lg" /> Back to Home
            </Link>
          </li>

          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-error hover:text-white w-full text-left">
              <FaSignOutAlt className="text-lg" /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-300 text-center text-xs opacity-60">
        <p>© 2024 Tuition Management</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </aside>
  );
};

export default Aside;
