// src/pages/Signup.jsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Signup = () => {
  const { emailSignup } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [blood, setBlood] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [file, setFile] = useState(null);

  // 🔹 District & Upazila
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

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
        setDistricts(districtsData.districts);

        const upazilasRes = await fetch("/upzila.json");
        const upazilasData = await upazilasRes.json();
        setUpazilas(upazilasData.upazilas);
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
      setUpazila(""); // reset upazila on district change
    }
  }, [district, upazilas]);

  // ================= Password Validation =================
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(pass)) {
      setPasswordError("Password must contain at least 1 uppercase letter.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // ================= Handle Signup =================
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !blood || !district || !upazila) {
      toast.error("Please fill all fields");
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
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_KEY
          }`,
          formData
        );

        photoURL = imgRes.data.data.display_url;
      }

      // 2️⃣ Firebase Signup
      const firebaseUser = await emailSignup(name, email, password, photoURL);

      // 3️⃣ Convert district/upazila ID to name
      const districtName = districts.find((d) => d.id === district)?.name || "";
      const upazilaName = upazilas.find((u) => u.id === upazila)?.name || "";

      // 4️⃣ Send to Backend
      const userInfo = {
        name,
        email,
        role: "donor",
        password, 
        blood,
        district: districtName,
        upazila: upazilaName,
        photoURL,
        uid: firebaseUser.uid,
      };

      await axios.post("http://localhost:5000/user", userInfo);

      toast.success("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= JSX =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 px-4">
      <div className="w-full max-w-md bg-gray-900/90 rounded-3xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
          />

          {/* Blood Group */}
          <select
            value={blood}
            onChange={(e) => setBlood(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required>
            <option value="" disabled>
              Select Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* District */}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required>
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
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required>
            <option value="" disabled>
              Select Upazila
            </option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 pr-10"
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
              className="absolute right-3 top-3 text-gray-400">
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {passwordError && (
            <p className="text-red-400 text-sm">{passwordError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
