// src/pages/dashboard/PostTuition.jsx
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
} from "react-icons/fa";

const PostTuition = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    subject: "",
    class: "",
    curriculum: "",

    // Schedule & Location
    daysPerWeek: "3",
    timeSlot: "",
    location: "",
    tuitionType: "in-person", // 'in-person', 'online', 'both'

    // Budget & Duration
    budget: "",
    budgetNegotiable: false,
    duration: "", // in months

    // Requirements
    genderPreference: "any",
    tutorExperience: "1-3",
    requirements: "",
    studentGender: "",
    studentAge: "",

    // Contact Info
    contactNumber: "",
    whatsappAvailable: true,
    preferredContact: "phone", // 'phone', 'whatsapp', 'email'
  });

  // Subjects list
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

  // Classes list
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

  // Curriculum options
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle next step
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // Form validation
  const validateStep = () => {
    const errors = [];

    if (step === 1) {
      if (!formData.subject) errors.push("Subject is required");
      if (!formData.class) errors.push("Class is required");
    }

    if (step === 2) {
      if (!formData.daysPerWeek) errors.push("Days per week is required");
      if (!formData.timeSlot) errors.push("Time slot is required");
      if (!formData.location) errors.push("Location is required");
    }

    if (step === 3) {
      if (!formData.budget) errors.push("Budget is required");
      if (formData.budget && parseFloat(formData.budget) < 1000) {
        errors.push("Minimum budget should be 1000 BDT");
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateStep();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    if (step < 4) {
      handleNext();
      return;
    }

    // Final submission
    setLoading(true);

    const tuitionData = {
      ...formData,
      studentEmail: user?.email,
      studentName: user?.displayName || user?.email?.split("@")[0],
      status: "pending",
      postedDate: new Date().toISOString(),
      views: 0,
      applications: 0,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/tuitions",
        tuitionData,
      );

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
        setStep(1);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to post tuition. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Preview card component
  const PreviewCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaCheckCircle className="text-green-500" />
        Preview Your Tuition Post
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-semibold">{formData.subject}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-semibold">{formData.class}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Budget</p>
            <p className="font-semibold text-green-600">
              BDT {formData.budget} / month
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold">{formData.location}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Schedule</p>
            <p className="font-semibold">
              {formData.daysPerWeek} days/week, {formData.timeSlot}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tutor Experience</p>
            <p className="font-semibold">{formData.tutorExperience} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preferred Tutor</p>
            <p className="font-semibold capitalize">
              {formData.genderPreference}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-semibold">{formData.contactNumber}</p>
          </div>
        </div>
      </div>

      {formData.requirements && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">Additional Requirements</p>
          <p className="text-gray-700">{formData.requirements}</p>
        </div>
      )}
    </motion.div>
  );

  // Progress bar component
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaChalkboardTeacher className="text-blue-600" />
          Post New Tuition
        </h1>
        <span className="text-sm font-medium text-gray-500">
          Step {step} of 4
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <div className="flex justify-between mt-2">
        {["Basic Info", "Schedule", "Budget", "Review"].map((label, index) => (
          <div key={index} className="text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                index + 1 <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}>
              {index + 1 <= step ? <FaCheck /> : index + 1}
            </div>
            <span
              className={`text-sm ${
                index + 1 <= step
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <ProgressBar />

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaBook className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Basic Information
                  </h2>
                  <p className="text-gray-600">
                    Tell us about the tuition requirements
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBook className="inline mr-2" />
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required>
                    <option value="">Select a subject</option>
                    {subjects.map((subject, idx) => (
                      <option key={idx} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaGraduationCap className="inline mr-2" />
                    Class/Grade *
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required>
                    <option value="">Select class</option>
                    {classes.map((cls, idx) => (
                      <option key={idx} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Curriculum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBook className="inline mr-2" />
                    Curriculum
                  </label>
                  <select
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="">Select curriculum</option>
                    {curricula.map((curr, idx) => (
                      <option key={idx} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserGraduate className="inline mr-2" />
                    Student Gender
                  </label>
                  <select
                    name="studentGender"
                    value={formData.studentGender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Student Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserGraduate className="inline mr-2" />
                    Student Age
                  </label>
                  <input
                    type="number"
                    name="studentAge"
                    value={formData.studentAge}
                    onChange={handleChange}
                    min="3"
                    max="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 15"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Schedule & Location */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCalendarAlt className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Schedule & Location
                  </h2>
                  <p className="text-gray-600">
                    Set the timing and location for tuition
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Days Per Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Days Per Week *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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
                        className={`py-3 rounded-lg font-medium transition-all ${
                          formData.daysPerWeek === days.toString()
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                        {days} days
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline mr-2" />
                    Preferred Time Slot *
                  </label>
                  <input
                    type="text"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 4:00 PM - 6:00 PM"
                    required
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., Dhanmondi, Dhaka"
                    required
                  />
                </div>

                {/* Tuition Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaChalkboardTeacher className="inline mr-2" />
                    Tuition Type
                  </label>
                  <div className="flex gap-4">
                    {["in-person", "online", "both"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="tuitionType"
                          value={type}
                          checked={formData.tuitionType === type}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="capitalize">
                          {type.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="24"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 6"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget & Requirements */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaMoneyBillWave className="text-yellow-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Budget & Requirements
                  </h2>
                  <p className="text-gray-600">
                    Set your budget and tutor requirements
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMoneyBillWave className="inline mr-2" />
                    Monthly Budget (BDT) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ৳
                    </span>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., 5000"
                      min="1000"
                      required
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="budgetNegotiable"
                      checked={formData.budgetNegotiable}
                      onChange={handleChange}
                      className="mr-2"
                      id="negotiable"
                    />
                    <label
                      htmlFor="negotiable"
                      className="text-sm text-gray-600">
                      Budget is negotiable
                    </label>
                  </div>
                </div>

                {/* Tutor Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaChalkboardTeacher className="inline mr-2" />
                    Tutor Experience
                  </label>
                  <select
                    name="tutorExperience"
                    value={formData.tutorExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="any">Any Experience</option>
                    <option value="0-1">0-1 years (Fresh)</option>
                    <option value="1-3">1-3 years (Beginner)</option>
                    <option value="3-5">3-5 years (Intermediate)</option>
                    <option value="5+">5+ years (Expert)</option>
                  </select>
                </div>

                {/* Gender Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserGraduate className="inline mr-2" />
                    Preferred Tutor Gender
                  </label>
                  <select
                    name="genderPreference"
                    value={formData.genderPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="any">Any Gender</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 017XXXXXXXX"
                    required
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="whatsappAvailable"
                      checked={formData.whatsappAvailable}
                      onChange={handleChange}
                      className="mr-2"
                      id="whatsapp"
                    />
                    <label htmlFor="whatsapp" className="text-sm text-gray-600">
                      Available on WhatsApp
                    </label>
                  </div>
                </div>

                {/* Additional Requirements */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaInfoCircle className="inline mr-2" />
                    Additional Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Any specific requirements for the tutor (e.g., must have references, specific teaching style, etc.)"></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaCheckCircle className="text-purple-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Review & Submit
                  </h2>
                  <p className="text-gray-600">
                    Review your tuition post before publishing
                  </p>
                </div>
              </div>

              <PreviewCard />

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Important Notes
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>
                        • Your tuition will be visible to qualified tutors
                      </li>
                      <li>• You can edit or delete your post anytime</li>
                      <li>• Approved tutors can contact you directly</li>
                      <li>
                        • Your contact number will be shown to interested tutors
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                step === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              ← Previous
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : step === 4 ? (
                <span className="flex items-center gap-2">
                  <FaUpload />
                  Publish Tuition
                </span>
              ) : (
                <span className="flex items-center gap-2">Next Step →</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostTuition;
