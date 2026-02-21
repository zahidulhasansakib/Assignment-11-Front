// src/pages/Dashboard/MainDashboard/StudentDashboard/AppliedTutors.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaBook,
  FaFilter,
  FaSearch,
  FaCheck,
  FaTimes,
  FaComment,
  FaStar,
  FaIdCard,
  FaBriefcase,
  FaCreditCard,
} from "react-icons/fa";

const AppliedTutors = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tuitionFilter, setTuitionFilter] = useState("all");
  const [tuitions, setTuitions] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchTuitions();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/applied-tutors?studentEmail=${user?.email}`,
      );
      console.log("Applications response:", response.data);

      // Handle different response structures
      const applicationsData = response.data.data || response.data || [];
      setApplications(applicationsData);
      setFilteredApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchTuitions = async () => {
    try {
      const response = await axios.get(
        `/my-tuitions?studentEmail=${user?.email}`,
      );
      setTuitions(response.data || []);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    }
  };

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (tuitionFilter !== "all") {
      filtered = filtered.filter((app) => app.tuitionId === tuitionFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.tutor?.name?.toLowerCase().includes(term) ||
          app.tutorEmail?.toLowerCase().includes(term) ||
          app.tuition?.subject?.toLowerCase().includes(term),
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, tuitionFilter, searchTerm]);

  // Handle Reject Application
  const handleReject = async (applicationId) => {
    if (!window.confirm("Are you sure you want to reject this application?")) {
      return;
    }

    try {
      setProcessingId(applicationId);
      const response = await axios.put(`/applications/${applicationId}`, {
        status: "rejected",
      });

      if (response.data.success) {
        toast.success("Application rejected successfully!");

        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: "rejected" } : app,
          ),
        );
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Approve Click
  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setShowPaymentModal(true);
  };

  // Handle Approve without Payment (for testing)
  const handleApproveWithoutPayment = async (applicationId) => {
    if (!window.confirm("Approve this tutor without payment? (Testing only)")) {
      return;
    }

    try {
      setProcessingId(applicationId);
      const response = await axios.put(`/applications/${applicationId}`, {
        status: "approved",
      });

      if (response.data.success) {
        toast.success("Application approved successfully!");

        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: "approved" } : app,
          ),
        );
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    } finally {
      setProcessingId(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
      paid: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" />,
      approved: <FaCheckCircle className="text-green-500" />,
      rejected: <FaTimesCircle className="text-red-500" />,
      paid: <FaCheckCircle className="text-blue-500" />,
    };
    return icons[status] || null;
  };

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FaUserGraduate className="text-purple-600" />
              Tutor Applications
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage tutor applications for your tuitions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUserGraduate className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.pending}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaHourglassHalf className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.approved}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.rejected}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tutor name or subject..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={tuitionFilter}
              onChange={(e) => setTuitionFilter(e.target.value)}>
              <option value="all">All Tuitions</option>
              {tuitions.map((tuition) => (
                <option key={tuition._id} value={tuition._id}>
                  {tuition.subject} - {tuition.class}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FaUserGraduate className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || tuitionFilter !== "all"
                ? "No applications match your filters"
                : "No tutors have applied to your tuitions yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  {/* Application Header */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <div className="flex items-start gap-4">
                      {/* Tutor Image */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        {app.tutor?.name?.charAt(0) ||
                          app.tutorEmail?.charAt(0) ||
                          "T"}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {app.tutor?.name || app.tutorEmail?.split("@")[0]}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FaEnvelope className="text-gray-400" size={14} />
                          <span className="text-gray-600">
                            {app.tutorEmail}
                          </span>
                        </div>
                        {app.tutor?.phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <FaPhone className="text-gray-400" size={14} />
                            <span className="text-gray-600">
                              {app.tutor.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 lg:mt-0">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusBadge(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status?.charAt(0).toUpperCase() +
                          app.status?.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Applied:{" "}
                        {new Date(
                          app.appliedAt || app.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Tutor Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="font-semibold">
                        {app.tutor?.experience || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Qualification</p>
                      <p className="font-semibold">
                        {app.tutor?.qualification || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Expected Salary</p>
                      <p className="font-semibold text-green-600">
                        ৳{app.proposedFee || app.tuition?.budget}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold">
                        {app.tuition?.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Tuition Details */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaBook className="text-blue-600" />
                      Applied for Tuition:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Subject</p>
                        <p className="font-medium">{app.tuition?.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Class</p>
                        <p className="font-medium">{app.tuition?.class}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="font-medium text-green-600">
                          ৳{app.tuition?.budget}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Days/Week</p>
                        <p className="font-medium">
                          {app.tuition?.daysPerWeek || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message from Tutor */}
                  {app.message && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <FaComment className="text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Message from Tutor:
                          </p>
                          <p className="text-gray-600 italic">
                            "{app.message}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - APPROVE/REJECT HERE */}
                  {app.status === "pending" && (
                    <div className="flex gap-3">
                      {/* Reject Button */}
                      <button
                        onClick={() => handleReject(app._id)}
                        disabled={processingId === app._id}
                        className="flex-1 px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {processingId === app._id ? (
                          <div className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <FaTimes />
                            Reject Application
                          </>
                        )}
                      </button>

                      {/* Approve Button with Payment */}
                      <button
                        onClick={() => handleApproveClick(app)}
                        disabled={processingId === app._id}
                        className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <FaCheck />
                        Approve & Pay
                      </button>

                      {/* Optional: Quick Approve without Payment (for testing) */}
                      <button
                        onClick={() => handleApproveWithoutPayment(app._id)}
                        disabled={processingId === app._id}
                        className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        title="Testing only">
                        Quick Approve
                      </button>
                    </div>
                  )}

                  {/* Status Display for non-pending applications */}
                  {app.status === "approved" && (
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                      <p className="text-green-700 font-semibold">
                        ✓ Application Approved
                      </p>
                      <p className="text-sm text-green-600">
                        Tutor has been notified
                      </p>
                    </div>
                  )}

                  {app.status === "rejected" && (
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <FaTimesCircle className="text-red-600 text-2xl mx-auto mb-2" />
                      <p className="text-red-700 font-semibold">
                        ✗ Application Rejected
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Payment Modal */}
      {showPaymentModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-3">Payment Details:</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tutor:</span>
                    <span className="font-semibold">
                      {selectedApplication.tutor?.name ||
                        selectedApplication.tutorEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">
                      {selectedApplication.tuition?.subject}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ৳
                      {selectedApplication.proposedFee ||
                        selectedApplication.tuition?.budget}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> After successful payment, this tutor
                  will be approved and other pending applications will be
                  automatically rejected.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedApplication(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>

                <button
                  onClick={() => {
                    // Payment logic here
                    toast.info("Payment integration coming soon!");
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                  Pay Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;
