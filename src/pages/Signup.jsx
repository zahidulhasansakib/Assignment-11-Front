// src/pages/Signup.jsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import axios from "axios";

const Signup = () => {
  const { emailSignup } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student"); // default: student
  const [file, setFile] = useState(null);

  // 🔹 District & Upazila (optional for location)
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [showLocation, setShowLocation] = useState(false); // toggle location fields

  // 🔹 Password & Loading
  const [showPass, setShowPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= Load districts & upazilas =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const districtsRes = await fetch("/district.json");
        const districtsData = await districtsRes.json();
        setDistricts(districtsData.districts || []);

        const upazilasRes = await fetch("/upzila.json");
        const upazilasData = await upazilasRes.json();
        setUpazilas(upazilasData.upazilas || []);
      } catch (err) {
        console.error("Error loading district/upazila:", err);
      }
    };
    fetchData();
  }, []);

  // Filter upazilas when district changes
  useEffect(() => {
    if (district) {
      setFilteredUpazilas(upazilas.filter((u) => u.district_id === district));
      setUpazila("");
    }
  }, [district, upazilas]);

  // ================= Password Validation =================
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // ================= Handle Signup =================
  

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !role) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!validatePassword(password)) return;

    setLoading(true);

    try {
      // 1️⃣ Upload Image
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

      // 2️⃣ Firebase Signup - with ALL parameters
      const firebaseUser = await emailSignup(
        name, // name
        email, // email
        password, // password
        photoURL, // photoURL
        role, // role (student/tutor)
        phone, // phone number
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

  // ================= JSX =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role Selection - STUDENT / TUTOR */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                role === "student"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}>
              <FaUserGraduate /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                role === "tutor"
                  ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}>
              <FaChalkboardTeacher /> Tutor
            </button>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name *"
            className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address *"
            className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number *"
            className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-blue-500 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* Profile Image */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {/* Location Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showLocation"
              checked={showLocation}
              onChange={(e) => setShowLocation(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="showLocation" className="text-white text-sm">
              Add location information (optional)
            </label>
          </div>

          {/* Location Fields - shown only if checkbox checked */}
          {showLocation && (
            <>
              {/* District */}
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-blue-500 outline-none">
                <option value="" disabled>
                  Select District
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Upazila */}
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-blue-500 outline-none"
                disabled={!district}>
                <option value="" disabled>
                  Select Upazila
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password * (min 6 characters)"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-blue-500 outline-none pr-12"
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
              className="absolute right-4 top-3 text-gray-400 hover:text-white">
              {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {passwordError && (
            <p className="text-red-400 text-sm">{passwordError}</p>
          )}

          {/* Terms and Conditions */}
          <p className="text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-blue-400 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
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
        <p className="text-center mt-6 text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};;

export default Signup;
