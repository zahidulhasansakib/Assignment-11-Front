// src/pages/dashboard/AdminDashboard/TuitionManagement.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSearch,
  FaFilter,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaCheck,
  FaTimes,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const TuitionManagement = () => {
  const axios = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [filteredTuitions, setFilteredTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/all-tuitions");
      console.log("Tuitions:", response.data);
      setTuitions(response.data || []);
      setFilteredTuitions(response.data || []);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
      toast.error("Failed to fetch tuitions");
    } finally {
      setLoading(false);
    }
  };

  // Filter tuitions
  useEffect(() => {
    let filtered = tuitions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.subject?.toLowerCase().includes(term) ||
          t.class?.toLowerCase().includes(term) ||
          t.location?.toLowerCase().includes(term) ||
          t.studentName?.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    setFilteredTuitions(filtered);
    setCurrentPage(1);
  }, [tuitions, searchTerm, statusFilter]);

  // Fetch applications for a tuition
  const fetchApplications = async (tuitionId) => {
    try {
      setApplicationsLoading(true);
      const response = await axios.get(`/tuition-applications/${tuitionId}`);
      console.log("Applications for tuition:", response.data);
      setApplications(response.data.data || []);
      setShowApplicationsModal(true);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Handle Approve Tuition
  const handleApprove = async (tuitionId) => {
    try {
      setUpdating(true);
      const response = await axios.put(`/tuitions/${tuitionId}`, {
        status: "approved",
        approvedAt: new Date(),
      });

      if (response.data.success) {
        toast.success("✅ Tuition approved successfully!");

        // Update local state to reflect the change
        setTuitions((prevTuitions) =>
          prevTuitions.map((t) =>
            t._id === tuitionId
              ? { ...t, status: "approved", approvedAt: new Date() }
              : t,
          ),
        );

        // Also close modal if open
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      }
    } catch (error) {
      console.error("Error approving tuition:", error);
      toast.error("Failed to approve tuition");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Reject Tuition
  const handleReject = async (tuitionId) => {
    try {
      setUpdating(true);
      const response = await axios.put(`/tuitions/${tuitionId}`, {
        status: "rejected",
        rejectedAt: new Date(),
      });

      if (response.data.success) {
        toast.success("❌ Tuition rejected!");

        // Update local state
        setTuitions((prevTuitions) =>
          prevTuitions.map((t) =>
            t._id === tuitionId
              ? { ...t, status: "rejected", rejectedAt: new Date() }
              : t,
          ),
        );

        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      }
    } catch (error) {
      console.error("Error rejecting tuition:", error);
      toast.error("Failed to reject tuition");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Approve Tutor Application
  const handleApproveTutor = async (applicationId, tuitionId, tutorEmail) => {
    try {
      setUpdating(true);

      // 1. Update application status to approved
      const appResponse = await axios.put(`/applications/${applicationId}`, {
        status: "approved",
      });

      if (appResponse.data.success) {
        // 2. Update tuition with assigned tutor
        await axios.put(`/tuitions/${tuitionId}`, {
          status: "approved",
          tutorEmail: tutorEmail,
          approvedAt: new Date(),
          tutorAssigned: true,
        });

        toast.success(`✅ Tutor approved successfully!`);

        // Refresh data
        fetchTuitions();
        setShowApplicationsModal(false);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Error approving tutor:", error);
      toast.error("Failed to approve tutor");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Reject Tutor Application
  const handleRejectTutor = async (applicationId) => {
    try {
      setUpdating(true);

      const response = await axios.put(`/applications/${applicationId}`, {
        status: "rejected",
      });

      if (response.data.success) {
        toast.success(`❌ Application rejected`);

        // Refresh applications list
        if (selectedTuition) {
          fetchApplications(selectedTuition._id);
        }
      }
    } catch (error) {
      console.error("Error rejecting tutor:", error);
      toast.error("Failed to reject application");
    } finally {
      setUpdating(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" />,
      approved: <FaCheckCircle className="text-green-500" />,
      rejected: <FaTimesCircle className="text-red-500" />,
      completed: <FaCheckCircle className="text-blue-500" />,
    };
    return icons[status] || null;
  };

  // Calculate stats with real-time counts
  const stats = {
    total: tuitions.length,
    pending: tuitions.filter((t) => t.status === "pending").length,
    approved: tuitions.filter((t) => t.status === "approved").length,
    rejected: tuitions.filter((t) => t.status === "rejected").length,
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTuitions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredTuitions.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FaBook className="text-blue-600" />
          Tuition Management
        </h1>
        <p className="text-gray-600 mt-2">
          Review, approve or reject tuition posts
        </p>
      </div>

      {/* Stats Cards with Live Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tuitions</p>
              <motion.h3
                key={stats.total}
                initial={{ scale: 1.5, color: "#3b82f6" }}
                animate={{ scale: 1, color: "#1f2937" }}
                className="text-3xl font-bold text-gray-800">
                {stats.total}
              </motion.h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBook className="text-blue-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <motion.h3
                key={stats.pending}
                initial={{ scale: 1.5, color: "#eab308" }}
                animate={{ scale: 1, color: "#1f2937" }}
                className="text-3xl font-bold text-gray-800">
                {stats.pending}
              </motion.h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaHourglassHalf className="text-yellow-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved</p>
              <motion.h3
                key={stats.approved}
                initial={{ scale: 1.5, color: "#22c55e" }}
                animate={{ scale: 1, color: "#1f2937" }}
                className="text-3xl font-bold text-gray-800">
                {stats.approved}
              </motion.h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejected</p>
              <motion.h3
                key={stats.rejected}
                initial={{ scale: 1.5, color: "#ef4444" }}
                animate={{ scale: 1, color: "#1f2937" }}
                className="text-3xl font-bold text-gray-800">
                {stats.rejected}
              </motion.h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, class, location or student..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <select
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Tuitions Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tuition
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tutor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((tuition) => (
                  <motion.tr
                    key={tuition._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {tuition.subject}
                        </p>
                        <p className="text-sm text-gray-500">{tuition.class}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {tuition.studentName ||
                          tuition.studentEmail?.split("@")[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tuition.studentEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-red-500" size={14} />
                        <span>{tuition.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        ৳{tuition.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 w-fit ${getStatusBadge(tuition.status)}`}>
                        {getStatusIcon(tuition.status)}
                        {tuition.status?.charAt(0).toUpperCase() +
                          tuition.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {tuition.tutorEmail ? (
                        <div className="flex items-center gap-1">
                          <FaUserTie className="text-green-600" />
                          <span className="text-sm">
                            {tuition.tutorEmail.split("@")[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTuition(tuition);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details">
                          <FaEye />
                        </button>

                        {tuition.applications > 0 && (
                          <button
                            onClick={() => {
                              setSelectedTuition(tuition);
                              fetchApplications(tuition._id);
                            }}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                            title="View Applications">
                            {tuition.applications} Applied
                          </button>
                        )}

                        {tuition.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(tuition._id)}
                              disabled={updating}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve">
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(tuition._id)}
                              disabled={updating}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject">
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTuitions.length > 0 && (
            <div className="flex justify-between items-center px-6 py-4 border-t">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                <FaArrowLeft /> Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                Next <FaArrowRight />
              </button>
            </div>
          )}

          {filteredTuitions.length === 0 && (
            <div className="text-center py-16">
              <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
              <p className="text-gray-500">No tuitions found</p>
            </div>
          )}
        </div>
      )}

      {/* Tuition Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTuition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tuition Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{selectedTuition.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-medium">{selectedTuition.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium text-green-600">
                        ৳{selectedTuition.budget}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedTuition.location}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Days/Week</p>
                      <p className="font-medium">
                        {selectedTuition.daysPerWeek || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time Slot</p>
                      <p className="font-medium">
                        {selectedTuition.timeSlot || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Student Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedTuition.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedTuition.studentEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Posted On</p>
                      <p className="font-medium">
                        {new Date(
                          selectedTuition.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border inline-flex items-center gap-1 ${getStatusBadge(selectedTuition.status)}`}>
                        {getStatusIcon(selectedTuition.status)}
                        {selectedTuition.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tutor Info if assigned */}
                {selectedTuition.tutorEmail && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Assigned Tutor</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-xl font-bold">
                        {selectedTuition.tutorEmail?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedTuition.tutorEmail}
                        </p>
                        <p className="text-sm text-green-600">
                          Approved on:{" "}
                          {new Date(
                            selectedTuition.approvedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {selectedTuition.requirements && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <p className="text-gray-700">
                      {selectedTuition.requirements}
                    </p>
                  </div>
                )}

                {/* Applications Button */}
                {selectedTuition.applications > 0 && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      fetchApplications(selectedTuition._id);
                    }}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                    <FaUsers />
                    View {selectedTuition.applications} Tutor Applications
                  </button>
                )}

                {/* Action Buttons for pending */}
                {selectedTuition.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleReject(selectedTuition._id)}
                      disabled={updating}
                      className="flex-1 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {updating ? (
                        <div className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaTimes />
                          Reject
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTuition._id)}
                      disabled={updating}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {updating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaCheck />
                          Approve
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Applications Modal */}
      <AnimatePresence>
        {showApplicationsModal && selectedTuition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Tutor Applications for {selectedTuition.subject}
                </h2>
                <button
                  onClick={() => setShowApplicationsModal(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-6">
                {applicationsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          {/* Tutor Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                {app.tutorEmail?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {app.tutorEmail?.split("@")[0]}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <FaEnvelope
                                    className="text-gray-400"
                                    size={12}
                                  />
                                  {app.tutorEmail}
                                </p>
                              </div>
                            </div>

                            {/* Application Details */}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">
                                  Qualification
                                </p>
                                <p className="font-medium">
                                  {app.qualification || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">
                                  Experience
                                </p>
                                <p className="font-medium">
                                  {app.experience || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">
                                  Expected Fee
                                </p>
                                <p className="font-medium text-green-600">
                                  ৳{app.proposedFee}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">
                                  Applied On
                                </p>
                                <p className="font-medium">
                                  {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {app.message && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700 italic">
                                  "{app.message}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Status & Actions */}
                          <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                app.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}>
                              {app.status}
                            </span>

                            {app.status === "pending" && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleRejectTutor(app._id)}
                                  disabled={updating}
                                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1">
                                  <FaTimes size={12} />
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    handleApproveTutor(
                                      app._id,
                                      selectedTuition._id,
                                      app.tutorEmail,
                                    )
                                  }
                                  disabled={updating}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1">
                                  <FaCheck size={12} />
                                  Approve
                                </button>
                              </div>
                            )}

                            {app.status === "approved" && (
                              <p className="text-xs text-green-600 mt-2">
                                Tutor approved
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TuitionManagement;
