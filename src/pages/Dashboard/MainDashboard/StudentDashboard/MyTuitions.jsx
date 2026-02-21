// src/pages/dashboard/MyTuitions.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaSearch,
  FaMoneyBillWave,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPlus,
  FaUserGraduate,
  FaCalendarAlt,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdLocationOn, MdSubject } from "react-icons/md";
import EditTuitionModal from "./EditTuitionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";


const MyTuitions = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [filteredTuitions, setFilteredTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tuitionToDelete, setTuitionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTuitions();
  }, [user]);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/my-tuitions?studentEmail=${user?.email}`,
      );
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

  // Filter and search
  useEffect(() => {
    let result = tuitions;

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.subject?.toLowerCase().includes(term) ||
          t.class?.toLowerCase().includes(term) ||
          t.location?.toLowerCase().includes(term),
      );
    }

    setFilteredTuitions(result);
  }, [tuitions, statusFilter, searchTerm]);

  // Handle Edit
  const handleEdit = (tuition) => {
    setSelectedTuition(tuition);
    setShowEditModal(true);
  };

  // Handle Update Success
  const handleUpdateSuccess = (updatedTuition) => {
    setTuitions((prev) =>
      prev.map((t) => (t._id === updatedTuition._id ? updatedTuition : t)),
    );
    setShowEditModal(false);
    setSelectedTuition(null);
    toast.success("Tuition updated successfully!");
  };

  // Handle Delete Click
  const handleDeleteClick = (tuition) => {
    setTuitionToDelete(tuition);
    setShowDeleteModal(true);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!tuitionToDelete) return;

    try {
      setDeleting(true);
      await axios.delete(`/tuitions/${tuitionToDelete._id}`);

      setTuitions((prev) => prev.filter((t) => t._id !== tuitionToDelete._id));
      toast.success("Tuition deleted successfully!");
      setShowDeleteModal(false);
      setTuitionToDelete(null);
    } catch (error) {
      console.error("Error deleting tuition:", error);
      toast.error("Failed to delete tuition");
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
      completed: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Stats
  const stats = {
    total: tuitions.length,
    pending: tuitions.filter((t) => t.status === "pending").length,
    approved: tuitions.filter((t) => t.status === "approved").length,
    completed: tuitions.filter((t) => t.status === "completed").length,
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
              My Tuitions
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your tuition posts - Create, Edit, or Delete
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard/post-tuition")}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
            <FaPlus />
            Post New Tuition
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Tuitions</p>
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
                <FaClock className="text-yellow-600 text-xl" />
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

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.completed}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaCheckCircle className="text-blue-600 text-xl" />
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
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tuitions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : filteredTuitions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Tuitions Found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "No tuitions match your filters"
                : "You haven't posted any tuitions yet"}
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard/post-tuition")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Post Your First Tuition
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTuitions.map((tuition, index) => (
              <motion.div
                key={tuition._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300">
                {/* Card Header */}
                <div
                  className={`p-6 ${
                    tuition.status === "approved"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50"
                      : tuition.status === "pending"
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50"
                        : tuition.status === "rejected"
                          ? "bg-gradient-to-r from-red-50 to-pink-50"
                          : "bg-gradient-to-r from-blue-50 to-cyan-50"
                  }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {tuition.subject}
                      </h3>
                      <p className="text-gray-600">{tuition.class}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(tuition.status)}`}>
                      {tuition.status?.charAt(0).toUpperCase() +
                        tuition.status?.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaMoneyBillWave className="text-green-600" />
                      <span className="font-semibold">
                        ৳{tuition.budget}/month
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{tuition.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3">
                    {tuition.daysPerWeek && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>{tuition.daysPerWeek} days/week</span>
                      </div>
                    )}

                    {tuition.timeSlot && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-purple-500" />
                        <span>{tuition.timeSlot}</span>
                      </div>
                    )}

                    {tuition.requirements && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-1">
                          Requirements:
                        </p>
                        <p className="text-gray-700 text-sm">
                          {tuition.requirements}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer - Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() =>
                      (window.location.href = `/dashboard/tuition/${tuition._id}`)
                    }
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <FaEye />
                    View
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tuition)}
                      disabled={
                        tuition.status === "approved" ||
                        tuition.status === "completed"
                      }
                      className={`px-4 py-2 font-medium flex items-center gap-2 rounded-lg transition-colors ${
                        tuition.status === "approved" ||
                        tuition.status === "completed"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                      title={
                        tuition.status === "approved"
                          ? "Cannot edit approved tuition"
                          : "Edit tuition"
                      }>
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(tuition)}
                      disabled={
                        tuition.status === "approved" ||
                        tuition.status === "completed"
                      }
                      className={`px-4 py-2 font-medium flex items-center gap-2 rounded-lg transition-colors ${
                        tuition.status === "approved" ||
                        tuition.status === "completed"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      title={
                        tuition.status === "approved"
                          ? "Cannot delete approved tuition"
                          : "Delete tuition"
                      }>
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <EditTuitionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTuition(null);
        }}
        tuition={selectedTuition}
        onSuccess={handleUpdateSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTuitionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Tuition"
        message={`Are you sure you want to delete the tuition for "${tuitionToDelete?.subject}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default MyTuitions;
