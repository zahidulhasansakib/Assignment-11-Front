
import React, { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUpload,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const Signup = () => {
  const { emailSignup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // UI States
  const [showPass, setShowPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Validation
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !role) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!validatePassword(password)) return;

    setLoading(true);

    try {
      // Upload Image to ImgBB
      let photoURL = "https://i.ibb.co/4pDNDk1/avatar.png";
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
          formData,
        );

        if (imgRes.data.success) {
          photoURL = imgRes.data.data.display_url;
        }
      }

      // Firebase Signup with all parameters
      const firebaseUser = await emailSignup(
        name,
        email,
        password,
        photoURL,
        role,
        phone,
      );

      toast.success("Signup successful! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-600/10 to-orange-700/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
              Create Account
            </h2>
            <p className="text-gray-400">Join our learning community today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  role === "student"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                }`}>
                <FaUserGraduate /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole("tutor")}
                className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  role === "tutor"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                }`}>
                <FaChalkboardTeacher /> Tutor
              </button>
            </div>

            {/* Name Field */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address *"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone Field */}
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number *"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Profile Image Upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="flex items-center gap-3 px-4 py-4 rounded-xl bg-gray-700/50 text-gray-300 border border-gray-600 cursor-pointer hover:bg-gray-700 transition-all">
                <FaUpload className="text-orange-500" />
                <span className="flex-1">
                  {fileName || "Upload profile picture (optional)"}
                </span>
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password * (min 6 characters)"
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded-lg">
                {passwordError}
              </p>
            )}

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-orange-500 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
