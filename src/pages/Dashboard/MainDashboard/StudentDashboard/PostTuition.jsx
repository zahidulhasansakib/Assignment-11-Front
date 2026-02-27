import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaBook,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUserGraduate,
  FaPhone,
  FaInfoCircle,
  FaUpload,
  FaCheck,
  FaTimes,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaUserTie,
  FaDollarSign,
  FaWhatsapp,
  FaEnvelope,
  FaMapPin,
} from "react-icons/fa";
import { MdSubject, MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

const PostTuition = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    curriculum: "",
    daysPerWeek: "3",
    timeSlot: "",
    location: "",
    tuitionType: "in-person",
    budget: "",
    budgetNegotiable: false,
    duration: "",
    genderPreference: "any",
    tutorExperience: "1-3",
    requirements: "",
    studentGender: "",
    studentAge: "",
    contactNumber: "",
    whatsappAvailable: true,
    preferredContact: "phone",
  });

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Bangla",
    "ICT",
    "Accounting",
    "Finance",
    "Economics",
    "Business Studies",
    "Statistics",
    "General Science",
    "Religion Studies",
    "Social Science",
    "Computer Science",
  ];

  const classes = [
    "Play Group",
    "Nursery",
    "KG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "SSC Candidate",
    "Class 11",
    "Class 12",
    "HSC Candidate",
    "College/University",
    "Admission Test",
  ];

  const curricula = [
    "National Curriculum",
    "English Version",
    "English Medium",
    "Madrasa",
    "International",
    "Cambridge",
    "Edexcel",
    "IB",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.subject ||
      !formData.class ||
      !formData.budget ||
      !formData.location ||
      !formData.timeSlot ||
      !formData.contactNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.budget && parseFloat(formData.budget) < 1000) {
      toast.error("Minimum budget should be 1000 BDT");
      return;
    }

    setLoading(true);

    const tuitionData = {
      ...formData,
      studentEmail: user?.email,
      studentName: user?.displayName || user?.email?.split("@")[0],
      status: "pending",
      postedDate: new Date().toISOString(),
      views: 0,
      applications: 0,
      budget: parseFloat(formData.budget),
    };

    try {
      const response = await axios.post("/tuitions", tuitionData);

      if (response.data.success) {
        toast.success("✅ Tuition posted successfully!");

        // Reset form
        setFormData({
          subject: "",
          class: "",
          curriculum: "",
          daysPerWeek: "3",
          timeSlot: "",
          location: "",
          tuitionType: "in-person",
          budget: "",
          budgetNegotiable: false,
          duration: "",
          genderPreference: "any",
          tutorExperience: "1-3",
          requirements: "",
          studentGender: "",
          studentAge: "",
          contactNumber: "",
          whatsappAvailable: true,
          preferredContact: "phone",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to post tuition. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-3 sm:py-6 sm:px-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto">
        {/* Header - Responsive Text Sizes */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 sm:mb-3 leading-tight">
            Post New Tuition
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium px-2 sm:px-0">
            Fill in the details below to find the perfect tutor
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Section 1: Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl text-white shadow-lg">
                <FaBook className="text-lg sm:text-2xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Basic Information
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Tell us about the tuition requirements
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Subject */}
              <div className="col-span-1">
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <MdSubject className="inline mr-1 sm:mr-2 text-indigo-600 text-base sm:text-xl" />
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  required>
                  <option value="" className="text-gray-700">
                    Select a subject
                  </option>
                  {subjects.map((subject, idx) => (
                    <option
                      key={idx}
                      value={subject}
                      className="text-gray-900 font-medium">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaGraduationCap className="inline mr-1 sm:mr-2 text-indigo-600 text-base sm:text-xl" />
                  Class/Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  required>
                  <option value="" className="text-gray-700">
                    Select class
                  </option>
                  {classes.map((cls, idx) => (
                    <option
                      key={idx}
                      value={cls}
                      className="text-gray-900 font-medium">
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Curriculum */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaBook className="inline mr-1 sm:mr-2 text-indigo-600 text-base sm:text-xl" />
                  Curriculum
                </label>
                <select
                  name="curriculum"
                  value={formData.curriculum}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white">
                  <option value="" className="text-gray-700">
                    Select curriculum
                  </option>
                  {curricula.map((curr, idx) => (
                    <option
                      key={idx}
                      value={curr}
                      className="text-gray-900 font-medium">
                      {curr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Age */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaUserGraduate className="inline mr-1 sm:mr-2 text-indigo-600 text-base sm:text-xl" />
                  Student Age
                </label>
                <input
                  type="number"
                  name="studentAge"
                  value={formData.studentAge}
                  onChange={handleChange}
                  min="3"
                  max="50"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="e.g., 15"
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Schedule & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg sm:rounded-xl text-white shadow-lg">
                <FaCalendarAlt className="text-lg sm:text-2xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Schedule & Location
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Set the timing and location for tuition
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Days Per Week */}
              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3">
                  <FaCalendarAlt className="inline mr-1 sm:mr-2 text-green-600 text-base sm:text-xl" />
                  Days Per Week <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          daysPerWeek: days.toString(),
                        }))
                      }
                      className={`py-2 sm:py-3 text-xs sm:text-sm md:text-base font-bold rounded-lg sm:rounded-xl transition-all ${
                        formData.daysPerWeek === days.toString()
                          ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                      }`}>
                      {days} {days === 1 ? "day" : "days"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaClock className="inline mr-1 sm:mr-2 text-green-600 text-base sm:text-xl" />
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="e.g., 4:00 PM - 6:00 PM"
                  required
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaMapPin className="inline mr-1 sm:mr-2 text-green-600 text-base sm:text-xl" />
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="e.g., Dhanmondi, Dhaka"
                  required
                />
              </div>

              {/* Tuition Type */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaChalkboardTeacher className="inline mr-1 sm:mr-2 text-green-600 text-base sm:text-xl" />
                  Tuition Type
                </label>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {["in-person", "online", "both"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-1 sm:gap-2">
                      <input
                        type="radio"
                        name="tuitionType"
                        value={type}
                        checked={formData.tuitionType === type}
                        onChange={handleChange}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
                      />
                      <span className="text-xs sm:text-sm md:text-base text-gray-800 font-medium capitalize">
                        {type.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaCalendarAlt className="inline mr-1 sm:mr-2 text-green-600 text-base sm:text-xl" />
                  Duration (Months)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="24"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="e.g., 6"
                />
              </div>
            </div>
          </motion.div>

          {/* Section 3: Budget & Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg sm:rounded-xl text-white shadow-lg">
                <FaMoneyBillWave className="text-lg sm:text-2xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Budget & Requirements
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Set your budget and tutor preferences
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Budget */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaDollarSign className="inline mr-1 sm:mr-2 text-yellow-600 text-base sm:text-xl" />
                  Monthly Budget (BDT) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-700 text-base sm:text-xl font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full pl-8 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-bold border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                    placeholder="5000"
                    min="1000"
                    required
                  />
                </div>
                <div className="flex items-center mt-2 sm:mt-3">
                  <input
                    type="checkbox"
                    name="budgetNegotiable"
                    checked={formData.budgetNegotiable}
                    onChange={handleChange}
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-indigo-600"
                    id="negotiable"
                  />
                  <label
                    htmlFor="negotiable"
                    className="text-xs sm:text-sm md:text-base text-gray-800 font-medium">
                    Budget is negotiable
                  </label>
                </div>
              </div>

              {/* Tutor Experience */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaUserTie className="inline mr-1 sm:mr-2 text-yellow-600 text-base sm:text-xl" />
                  Tutor Experience
                </label>
                <select
                  name="tutorExperience"
                  value={formData.tutorExperience}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white">
                  <option value="any">Any Experience</option>
                  <option value="0-1">0-1 years (Fresh)</option>
                  <option value="1-3">1-3 years (Beginner)</option>
                  <option value="3-5">3-5 years (Intermediate)</option>
                  <option value="5+">5+ years (Expert)</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaUserGraduate className="inline mr-1 sm:mr-2 text-yellow-600 text-base sm:text-xl" />
                  Preferred Tutor Gender
                </label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white">
                  <option value="any">Any Gender</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaPhone className="inline mr-1 sm:mr-2 text-yellow-600 text-base sm:text-xl" />
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="e.g., 017XXXXXXXX"
                  required
                />
                <div className="flex items-center mt-2 sm:mt-3">
                  <input
                    type="checkbox"
                    name="whatsappAvailable"
                    checked={formData.whatsappAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-indigo-600"
                    id="whatsapp"
                  />
                  <label
                    htmlFor="whatsapp"
                    className="text-xs sm:text-sm md:text-base text-gray-800 font-medium">
                    <FaWhatsapp className="inline mr-1 text-green-500" />
                    Available on WhatsApp
                  </label>
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                  <FaInfoCircle className="inline mr-1 sm:mr-2 text-yellow-600 text-base sm:text-xl" />
                  Additional Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 font-medium border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white"
                  placeholder="Any specific requirements for the tutor..."
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-base sm:text-lg md:text-xl font-bold rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : (
                <>
                  <FaUpload className="text-sm sm:text-base md:text-xl" />
                  <span className="text-sm sm:text-base md:text-xl">
                    Post Tuition
                  </span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>

      {/* Responsive Style Adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          input,
          select,
          textarea,
          button {
            font-size: 16px !important; /* Prevents zoom on mobile */
          }

          .grid {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PostTuition;
