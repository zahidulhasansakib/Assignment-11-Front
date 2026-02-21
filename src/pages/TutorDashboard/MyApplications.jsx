// src/pages/TutorDashboard/MyApplications.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaBook,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEdit,
  FaTrash,
  FaEye,
  FaMoneyBillWave,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import EditApplicationModal from "./EditApplicationModa";
import DeleteConfirmationModal from "../dashboard/mainDashboard/StudentDashboard/DeleteConfirmationModal";



const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/tutor-applications?tutorEmail=${user?.email}`,
      );
      console.log("Applications:", response.data);
      setApplications(response.data.data || []);
      setFilteredApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.tuition?.subject?.toLowerCase().includes(term) ||
          app.tuition?.class?.toLowerCase().includes(term) ||
          app.tuition?.location?.toLowerCase().includes(term),
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  // Handle Edit
  const handleEdit = (application) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  // Handle Update Success
  const handleUpdateSuccess = (updatedApplication) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === updatedApplication._id ? updatedApplication : app,
      ),
    );
    setShowEditModal(false);
    setSelectedApplication(null);
    toast.success("Application updated successfully!");
  };

  // Handle Delete Click
  const handleDeleteClick = (application) => {
    setApplicationToDelete(application);
    setShowDeleteModal(true);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;

    try {
      setDeleting(true);
      await axios.delete(`/tutor-applications/${applicationToDelete._id}`);

      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationToDelete._id),
      );
      toast.success("Application deleted successfully!");
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setDeleting(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" />,
      approved: <FaCheckCircle className="text-green-500" />,
      rejected: <FaTimesCircle className="text-red-500" />,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FaBook className="text-blue-600" />
              My Applications
            </h1>
            <p className="text-gray-600 mt-2">
              Track your tuition applications - Edit or Delete until approved
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
                <FaBook className="text-blue-600 text-xl" />
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

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject, class or location..."
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
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No applications match your filters"
                : "You haven't applied to any tuitions yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {app.tuition?.subject}
                      </h3>
                      <p className="text-gray-600">{app.tuition?.class}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusBadge(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status?.charAt(0).toUpperCase() +
                        app.status?.slice(1)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold flex items-center gap-1">
                        <FaMapMarkerAlt className="text-red-500" />
                        {app.tuition?.location}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-semibold text-green-600">
                        ৳{app.tuition?.budget}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Your Expected</p>
                      <p className="font-semibold text-blue-600">
                        ৳{app.proposedFee}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Applied On</p>
                      <p className="font-semibold flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-500" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Qualifications</p>
                        <p className="font-medium">
                          {app.qualification || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="font-medium">{app.experience || "N/A"}</p>
                      </div>
                    </div>
                    {app.message && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs text-gray-500">Message:</p>
                        <p className="text-sm text-gray-700 italic">
                          "{app.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {app.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(app)}
                        className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2">
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(app)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  )}

                  {app.status === "approved" && (
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                      <p className="text-green-700 font-semibold">
                        Application Approved!
                      </p>
                      <p className="text-sm text-green-600">
                        You can now start teaching
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <EditApplicationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onSuccess={handleUpdateSuccess}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setApplicationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default MyApplications;
