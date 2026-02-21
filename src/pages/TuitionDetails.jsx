// src/pages/TuitionDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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
  FaArrowLeft,
  FaEye,
  FaEnvelope,
  FaInfoCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaHeart,
  FaShare,
  FaRegClock,
  FaRegCalendarAlt,
  FaMapPin,
  FaDollarSign,
  FaCertificate,
  FaBriefcase,
  FaQuoteRight,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const TuitionDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [applicationData, setApplicationData] = useState({
    qualification: "",
    experience: "",
    proposedFee: "",
    message: "",
  });

  useEffect(() => {
    if (!id || id === ":id") {
      setError("Invalid tuition ID");
      setLoading(false);
      return;
    }
    fetchUserRole();
    fetchTuitionDetails();
  }, [id]);

  const fetchUserRole = async () => {
    if (!user?.email) return;
    try {
      const response = await axios.get(`/users/role/${user.email}`);
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const fetchTuitionDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/tuitions/${id}`);
      const tuitionData = response.data.data || response.data;

      setTuition(tuitionData);
      setApplicationData((prev) => ({
        ...prev,
        proposedFee: tuitionData.budget,
      }));

      if (user?.email) {
        checkIfApplied();
      }
    } catch (error) {
      console.error("Error fetching tuition:", error);
      setError("Failed to load tuition details");
      toast.error("Failed to load tuition details");
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!user?.email || !tuition?._id) return;
    try {
      const response = await axios.get(
        `/check-application?tuitionId=${id}&tutorEmail=${user.email}`,
      );
      setHasApplied(response.data.exists);
    } catch (error) {
      console.error("Error checking application:", error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    if (userRole !== "tutor") {
      toast.error("Only tutors can apply for tuitions");
      return;
    }
    if (hasApplied) {
      toast.error("You have already applied for this tuition");
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
        setHasApplied(true);
        setShowApplyModal(false);
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

  const isOwner = user?.email === tuition?.studentEmail;

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold",
      approved:
        "bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold",
      rejected:
        "bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold",
      completed:
        "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold",
    };
    return (
      styles[status] ||
      "bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold"
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaBook className="text-indigo-600 text-2xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-indigo-600 font-medium text-lg">
            Loading tuition details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tuition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-4xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Unable to Load
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {error || "Tuition not found"}
            </p>
            <button
              onClick={() => navigate("/tuitions")}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all">
              Browse All Tuitions
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-gray-700 text-base">
            <FaArrowLeft className="text-indigo-600 text-lg" />
            <span>Back</span>
          </button>

          <span
            className={`px-5 py-3 rounded-full text-base font-bold flex items-center gap-2 shadow-lg ${getStatusBadge(tuition.status)}`}>
            {tuition.status === "pending" && (
              <FaHourglassHalf className="animate-pulse" />
            )}
            {tuition.status === "approved" && <FaCheckCircle />}
            {tuition.status === "rejected" && <FaTimes />}
            {tuition.status === "completed" && <FaCheckCircle />}
            {tuition.status?.charAt(0).toUpperCase() + tuition.status?.slice(1)}
          </span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 md:p-14 text-white mb-8 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                {tuition.subject}
              </h1>
              <p className="text-2xl flex items-center gap-3 text-indigo-100 font-medium">
                <FaGraduationCap className="text-3xl" />
                {tuition.class}
              </p>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-lg text-indigo-200 mb-2 font-medium">
                Monthly Budget
              </p>
              <p className="text-6xl font-black">৳{tuition.budget}</p>
              <p className="text-lg text-indigo-200 mt-2 font-medium">
                per month
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info Cards - FIXED VISIBILITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Location Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FaMapPin className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Location
                </p>
                <p className="font-bold text-gray-900 text-xl">
                  {tuition.location}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FaRegCalendarAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Schedule
                </p>
                <p className="font-bold text-gray-900 text-xl">
                  {tuition.daysPerWeek || "N/A"} days/week
                </p>
              </div>
            </div>
          </div>

          {/* Time Slot Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FaRegClock className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Time Slot
                </p>
                <p className="font-bold text-gray-900 text-xl">
                  {tuition.timeSlot || "Flexible"}
                </p>
              </div>
            </div>
          </div>

          {/* Views Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FaEye className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Views</p>
                <p className="font-bold text-gray-900 text-xl">
                  {tuition.views || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Tuition Details
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Subject
                  </p>
                  <p className="font-bold text-gray-900 text-xl">
                    {tuition.subject}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Class
                  </p>
                  <p className="font-bold text-gray-900 text-xl">
                    {tuition.class}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Curriculum
                  </p>
                  <p className="font-bold text-gray-900 text-xl">
                    {tuition.curriculum || "National"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                  <p className="text-sm text-gray-500 font-medium mb-2">Type</p>
                  <p className="font-bold text-gray-900 text-xl capitalize">
                    {tuition.tuitionType || "In-person"}
                  </p>
                </div>
              </div>

              {tuition.requirements && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Requirements
                  </h4>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {tuition.requirements}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Student Information
                </h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {tuition.studentName?.charAt(0) ||
                      tuition.studentEmail?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {tuition.studentName || "Student"}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 text-lg mt-1">
                      <MdEmail className="text-indigo-500 text-xl" />
                      {tuition.studentEmail}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-base flex items-center gap-2 mt-3">
                  <FaRegCalendarAlt />
                  Posted on {formatDate(tuition.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Apply Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 sticky top-24 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Apply for this Tuition
              </h3>

              {!user ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg mb-4">
                    Please login to apply for this tuition
                  </p>
                  <Link
                    to="/login"
                    className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all text-center">
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block w-full py-4 border-2 border-indigo-600 text-indigo-600 text-lg font-semibold rounded-xl hover:bg-indigo-50 transition-all text-center">
                    Sign Up
                  </Link>
                </div>
              ) : userRole === "tutor" &&
                !isOwner &&
                tuition.status === "pending" ? (
                hasApplied ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-4xl text-green-500" />
                    </div>
                    <p className="text-green-600 text-xl font-semibold mb-2">
                      Already Applied!
                    </p>
                    <p className="text-gray-600 text-lg mb-4">
                      You've already submitted your application
                    </p>
                    <Link
                      to="/tutor/my-applications"
                      className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all text-center">
                      View My Applications
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-4">
                      Apply Now
                    </button>
                    <p className="text-gray-500 text-base text-center">
                      You'll need to provide your qualifications
                    </p>
                  </>
                )
              ) : (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 text-center">
                  <FaInfoCircle className="text-4xl text-yellow-600 mx-auto mb-3" />
                  <p className="text-yellow-800 text-lg font-medium">
                    {isOwner
                      ? "This is your own tuition post"
                      : tuition.status !== "pending"
                        ? "This tuition is no longer available"
                        : "You need to be a tutor to apply"}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-bold text-gray-900 text-xl">
                    {tuition.applications || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg mt-3">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-bold text-gray-900 text-xl">
                    {formatDate(tuition.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Apply for Tuition
                </h2>

                <form onSubmit={handleApply} className="space-y-5">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      <FaCertificate className="inline mr-2 text-indigo-600" />
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
                      className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g., B.Sc in Mathematics"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      <FaBriefcase className="inline mr-2 text-indigo-600" />
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
                      className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g., 3 years"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-indigo-600" />
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
                      className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                      min="1000"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Minimum suggested: ৳{tuition.budget}
                    </p>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      <FaQuoteRight className="inline mr-2 text-indigo-600" />
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
                      className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all resize-none"
                      placeholder="Tell the student why you're the best candidate..."
                    />
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {applying ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Submit
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TuitionDetails;
