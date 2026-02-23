// src/pages/dashboard/TutorDashboard/ProfileSettings.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaKey,
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
  FaGraduationCap,
  FaCalendarAlt,
  FaVenusMars,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEdit,
  FaUpload,
  FaBirthdayCake,
  FaTransgender,
  FaBriefcase,
  FaCity,
  FaGlobeAsia,
} from "react-icons/fa";
import {
  MdEmail,
  MdLocationOn,
  MdOutlineInfo,
  MdOutlineError,
} from "react-icons/md";
import {
  RiUserSettingsFill,
  RiSparklingFill,
  RiShieldCheckFill,
  RiGlobalFill,
} from "react-icons/ri";

const ProfileSettings = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const fileInputRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: "",
    gender: "",
    education: "",
    occupation: "",
    bio: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    github: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  // Fetch user profile data
  useEffect(() => {
    if (user?.email) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${user.email}`);
      const userData = response.data.data || response.data;

      // Set form data
      const profileData = {
        name: userData.name || user?.displayName || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
        education: userData.education || "",
        occupation: userData.occupation || "",
        bio: userData.bio || "",
        facebook: userData.facebook || "",
        twitter: userData.twitter || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
      };

      setFormData(profileData);
      setOriginalData(profileData);
      setPhotoURL(userData.photoURL || user?.photoURL || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Set default from auth user
      setFormData((prev) => ({
        ...prev,
        name: user?.displayName || "",
        email: user?.email || "",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate password
  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle photo selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload photo
  const uploadPhoto = async () => {
    if (!photoFile) return;

    try {
      setUploadingPhoto(true);

      // Create form data
      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("email", user.email);

      const response = await axios.post("/upload-profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const photoUrl = response.data.photoURL;
        setPhotoURL(photoUrl);
        setPhotoFile(null);
        setPhotoPreview("");

        // Update auth profile
        await updateUserProfile({ photoURL: photoUrl });

        toast.success("Profile photo updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Cancel photo upload
  const cancelPhotoUpload = () => {
    setPhotoFile(null);
    setPhotoPreview("");
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Check if any changes were made
      const hasChanges = Object.keys(formData).some(
        (key) => formData[key] !== originalData[key],
      );

      if (!hasChanges && !photoFile) {
        toast.info("No changes to save");
        return;
      }

      // Upload photo first if selected
      if (photoFile) {
        await uploadPhoto();
      }

      // Update profile data
      const response = await axios.put(`/users/${user.email}`, formData);

      if (response.data.success) {
        setOriginalData(formData);
        toast.success("Profile updated successfully!");

        // Update auth profile name if changed
        if (formData.name !== originalData.name) {
          await updateUserProfile({ displayName: formData.name });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put("/update-password", {
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges = Object.keys(formData).some(
    (key) => formData[key] !== originalData[key],
  );

  // Tabs configuration
  const tabs = [
    { id: "profile", label: "Profile Information", icon: FaUser },
  
    { id: "social", label: "Social Links", icon: FaGlobe },
  ];

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUser className="text-indigo-600 text-2xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-indigo-600 text-lg font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <RiUserSettingsFill className="text-indigo-600" />
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <RiSparklingFill className="text-yellow-500" />
            Manage your personal information and account settings
          </p>
        </motion.div>

        {/* Profile Photo Section */}
        <motion.div
          variants={fadeInUp}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-6 border border-white/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo Display */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-indigo-200 shadow-lg">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : photoURL ? (
                  <img
                    src={photoURL}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {formData.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300 disabled:opacity-50">
                <FaCamera className="text-lg" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Photo Upload Controls */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Profile Photo
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload a new profile photo. Recommended: Square image, at least
                200x200 pixels.
              </p>

              {photoFile && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={uploadPhoto}
                    disabled={uploadingPhoto}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center gap-2">
                    {uploadingPhoto ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload Photo
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelPhotoUpload}
                    disabled={uploadingPhoto}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all duration-300">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeInUp}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-2 mb-6 border border-white/50">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                <tab.icon className="text-lg" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Profile Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaUser className="text-indigo-600" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <MdEmail className="text-indigo-600 text-lg" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-900 font-medium cursor-not-allowed"
                      readOnly
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MdOutlineInfo className="text-blue-500" />
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaPhone className="text-indigo-600" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaBirthdayCake className="text-indigo-600" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaTransgender className="text-indigo-600" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium">
                      <option value="" className="text-gray-500">
                        Select gender
                      </option>
                      <option value="male" className="text-gray-900">
                        Male
                      </option>
                      <option value="female" className="text-gray-900">
                        Female
                      </option>
                      <option value="other" className="text-gray-900">
                        Other
                      </option>
                      <option
                        value="prefer-not-to-say"
                        className="text-gray-900">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaGraduationCap className="text-indigo-600" />
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="e.g., B.Sc in Computer Science"
                    />
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaBriefcase className="text-indigo-600" />
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="e.g., Student, Teacher, etc."
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-indigo-600" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="Street address"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaCity className="text-indigo-600" />
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="City"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaGlobeAsia className="text-indigo-600" />
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="Country"
                    />
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-lg" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

    

          {/* Social Links Tab */}
          {activeTab === "social" && (
            <motion.div
              key="social"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit" 
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <RiGlobalFill className="text-indigo-600" />
                  Social Media Links
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaFacebook className="text-blue-600" />
                      Facebook Profile
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaTwitter className="text-sky-500" />
                      Twitter Profile
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaLinkedin className="text-blue-700" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaGithub className="text-gray-800" />
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-lg" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSettings;
