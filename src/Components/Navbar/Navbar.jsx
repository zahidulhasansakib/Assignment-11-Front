
import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import {
  FaUserCircle,
  FaHome,
  FaBook,
  FaChalkboardTeacher,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const activeClass = ({ isActive }) =>
    isActive
      ? "text-orange-500 font-bold"
      : "text-white hover:text-orange-400 transition-colors";

  // Determine dashboard route based on role
  const getDashboardRoute = () => {
    if (!user) return "/dashboard";

    switch (user.role) {
      case "admin":
        return "/admin";
      case "tutor":
        return "/tutor";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-50 shadow-lg px-4 md:px-8">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
          <span className="mr-2">📚</span>eTuitionBd
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 items-center">
        <NavLink to="/" className={activeClass}>
          <FaHome className="inline mr-1" /> Home
        </NavLink>
        <NavLink to="/tuitions" className={activeClass}>
          <FaBook className="inline mr-1" /> Tuitions
        </NavLink>
        <NavLink to="/tutors" className={activeClass}>
          <FaChalkboardTeacher className="inline mr-1" /> Tutors
        </NavLink>
        <NavLink to="/about" className={activeClass}>
          <FaInfoCircle className="inline mr-1" /> About
        </NavLink>
        <NavLink to="/contact" className={activeClass}>
          <FaEnvelope className="inline mr-1" /> Contact
        </NavLink>

        {/* Auth Links */}
        {!user ? (
          <div className="flex gap-2 ml-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
              Login
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all">
              Register
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-10 h-10 rounded-full border-2 border-orange-500"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-orange-500" />
              )}
              <span className="ml-2 hidden lg:inline">
                {user.displayName || user.email?.split("@")[0]}
              </span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-gray-800 rounded-box w-56 mt-2 border border-gray-700">
              <li className="menu-title px-4 py-2 text-gray-400 border-b border-gray-700">
                {user.email}
              </li>
              <li>
                <Link
                  to={getDashboardRoute()}
                  className="hover:bg-orange-500 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile-settings"
                  className="hover:bg-orange-500 hover:text-white">
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-history"
                  className="hover:bg-orange-500 hover:text-white">
                  Payment History
                </Link>
              </li>
              <li className="border-t border-gray-700 mt-2">
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-red-500 hover:text-white">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <button
          className="btn btn-square btn-ghost text-white"
          onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col gap-2 p-4 md:hidden z-40 border-t border-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-orange-500 text-white" : "text-white hover:bg-gray-700"}`
            }
            onClick={() => setMenuOpen(false)}>
            <FaHome className="inline mr-2" /> Home
          </NavLink>

          <NavLink
            to="/tuitions"
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-orange-500 text-white" : "text-white hover:bg-gray-700"}`
            }
            onClick={() => setMenuOpen(false)}>
            <FaBook className="inline mr-2" /> Tuitions
          </NavLink>

          <NavLink
            to="/tutors"
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-orange-500 text-white" : "text-white hover:bg-gray-700"}`
            }
            onClick={() => setMenuOpen(false)}>
            <FaChalkboardTeacher className="inline mr-2" /> Tutors
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-orange-500 text-white" : "text-white hover:bg-gray-700"}`
            }
            onClick={() => setMenuOpen(false)}>
            <FaInfoCircle className="inline mr-2" /> About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-orange-500 text-white" : "text-white hover:bg-gray-700"}`
            }
            onClick={() => setMenuOpen(false)}>
            <FaEnvelope className="inline mr-2" /> Contact
          </NavLink>

          {!user ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                className="px-4 py-3 text-center rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-3 text-center rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all"
                onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2 border-t border-gray-700 pt-2">
              <div className="px-4 py-2 text-gray-400 text-sm">
                {user.email}
              </div>
              <Link
                to={getDashboardRoute()}
                className="px-4 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link
                to="/profile-settings"
                className="px-4 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}>
                Profile Settings
              </Link>
              <Link
                to="/payment-history"
                className="px-4 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}>
                Payment History
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-3 text-left rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
