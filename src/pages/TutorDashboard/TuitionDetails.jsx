// src/pages/TuitionDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaBook,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaGraduationCap,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const TuitionDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    qualification: "",
    experience: "",
    proposedFee: "",
    message: "",
  });

  useEffect(() => {
    fetchTuitionDetails();
  }, [id]);

  const fetchTuitionDetails = async () => {
    try {
      const response = await axios.get(`/tuitions/${id}`);
      setTuition(response.data);
      setApplicationData((prev) => ({
        ...prev,
        proposedFee: response.data.budget,
      }));
    } catch (error) {
      console.error("Error fetching tuition:", error);
      toast.error("Failed to load tuition details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    // Check if user is tutor (role check)
    const userRole = await axios.get(`/users/role/${user.email}`);
    if (userRole.data.role !== "tutor") {
      toast.error("Only tutors can apply for tuitions");
      return;
    }

    try {
      setApplying(true);

      const applyData = {
        tuitionId: id,
        tutorEmail: user.email,
        ...applicationData,
        proposedFee: parseFloat(applicationData.proposedFee),
      };

      const response = await axios.post("/apply-tuition", applyData);

      if (response.data.success) {
        toast.success("Application submitted successfully!");
        setShowApplyModal(false);
        navigate("/tutor/my-applications");
      }
    } catch (error) {
      console.error("Error applying:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Tuition not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{tuition.subject}</h1>
          <p className="text-lg opacity-90">{tuition.class}</p>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaMoneyBillWave className="text-green-600 text-xl" />
                <span className="font-semibold">Monthly Budget</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ৳{tuition.budget}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaMapMarkerAlt className="text-red-600 text-xl" />
                <span className="font-semibold">Location</span>
              </div>
              <p className="text-lg">{tuition.location}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-blue-600 text-xl" />
                <span className="font-semibold">Schedule</span>
              </div>
              <p className="text-lg">{tuition.daysPerWeek} days/week</p>
              <p className="text-gray-600">{tuition.timeSlot}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaUserGraduate className="text-purple-600 text-xl" />
                <span className="font-semibold">Student</span>
              </div>
              <p className="text-lg">{tuition.studentName}</p>
            </div>
          </div>

          {tuition.requirements && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">Requirements:</h3>
              <p className="text-gray-700">{tuition.requirements}</p>
            </div>
          )}

          {/* Apply Button - only for tutors */}
          {user && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Apply for this Tuition
            </button>
          )}
        </div>
      </motion.div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Apply for Tuition</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">You're applying for:</p>
                <p className="font-semibold">
                  {tuition.subject} - {tuition.class}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full p-3 bg-gray-100 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full p-3 bg-gray-100 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Qualifications *
                </label>
                <input
                  type="text"
                  value={applicationData.qualification}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      qualification: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., B.Sc in Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Experience *
                </label>
                <input
                  type="text"
                  value={applicationData.experience}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      experience: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3 years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Salary (৳) *
                </label>
                <input
                  type="number"
                  value={applicationData.proposedFee}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      proposedFee: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message to Student
                </label>
                <textarea
                  value={applicationData.message}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      message: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell the student why you're the best candidate..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {applying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TuitionDetails;
