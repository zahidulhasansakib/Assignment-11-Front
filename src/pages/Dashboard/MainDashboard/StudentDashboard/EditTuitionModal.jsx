// src/components/EditTuitionModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaSave } from "react-icons/fa";
import { MdSubject, MdLocationOn } from "react-icons/md";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const EditTuitionModal = ({ isOpen, onClose, tuition, onSuccess }) => {
  const axios = useAxiosSecure();
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    budget: "",
    location: "",
    daysPerWeek: "",
    timeSlot: "",
    requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Subjects and Classes lists
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

  // Load tuition data when modal opens
  useEffect(() => {
    if (tuition) {
      setFormData({
        subject: tuition.subject || "",
        class: tuition.class || "",
        budget: tuition.budget || "",
        location: tuition.location || "",
        daysPerWeek: tuition.daysPerWeek || "",
        timeSlot: tuition.timeSlot || "",
        requirements: tuition.requirements || "",
      });
    }
  }, [tuition]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.class) newErrors.class = "Class is required";
    if (!formData.budget) newErrors.budget = "Budget is required";
    if (formData.budget && parseFloat(formData.budget) < 1000) {
      newErrors.budget = "Minimum budget should be 1000 BDT";
    }
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.daysPerWeek)
      newErrors.daysPerWeek = "Days per week is required";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(`/tuitions/${tuition._id}`, formData);

      if (response.data.success) {
        onSuccess({ ...tuition, ...formData });
        toast.success("Tuition updated successfully!");
      }
    } catch (error) {
      console.error("Error updating tuition:", error);
      toast.error("Failed to update tuition");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Edit Tuition</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdSubject className="inline mr-2 text-blue-600" />
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}>
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-blue-600" />
              Class/Grade *
            </label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.class ? "border-red-500" : "border-gray-300"
              }`}>
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">{errors.class}</p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaMoneyBillWave className="inline mr-2 text-blue-600" />
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
                min="1000"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.budget ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., 5000"
              />
            </div>
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdLocationOn className="inline mr-2 text-blue-600" />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Dhanmondi, Dhaka"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Days Per Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-blue-600" />
              Days Per Week *
            </label>
            <select
              name="daysPerWeek"
              value={formData.daysPerWeek}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.daysPerWeek ? "border-red-500" : "border-gray-300"
              }`}>
              <option value="">Select days</option>
              <option value="2">2 days/week</option>
              <option value="3">3 days/week</option>
              <option value="4">4 days/week</option>
              <option value="5">5 days/week</option>
              <option value="6">6 days/week</option>
            </select>
            {errors.daysPerWeek && (
              <p className="text-red-500 text-sm mt-1">{errors.daysPerWeek}</p>
            )}
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaClock className="inline mr-2 text-blue-600" />
              Time Slot *
            </label>
            <input
              type="text"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.timeSlot ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 4:00 PM - 6:00 PM"
            />
            {errors.timeSlot && (
              <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaInfoCircle className="inline mr-2 text-blue-600" />
              Additional Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Any specific requirements for the tutor..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTuitionModal;
