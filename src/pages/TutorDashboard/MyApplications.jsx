
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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
  FaArrowLeft,
  FaArrowRight,
  FaChartLine,
  FaRegClock,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegCalendarCheck,
  FaRegMoneyBillAlt,
  FaRegUser,
  FaRegEnvelope,
  FaRegCommentDots,
  FaRegPaperPlane,
  FaEllipsisV,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaShare,
  FaDownload,
  FaPrint,
  FaLayerGroup,
  FaChartPie,
  FaPercentage,
} from "react-icons/fa";
import {
  MdOutlineSubject,
  MdOutlineClass,
  MdOutlineLocationOn,
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdOutlineAccessTime,
  MdOutlinePending,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdOutlineSearch,
  MdOutlineFilterList,
  MdOutlineSort,
  MdOutlineViewList,
  MdOutlineGridView,
  MdOutlineDashboard,
  MdOutlineTimeline,
  MdOutlineTrendingUp,
  MdOutlineTrendingDown,
  MdOutlineInfo,
  MdOutlineWarning,
  MdOutlineError,
} from "react-icons/md";
import {
  RiMoneyDollarCircleFill,
  RiMapPinFill,
  RiCalendarFill,
  RiTimeFill,
  RiGraduationCapFill,
  RiUserStarFill,
  RiVerifiedBadgeFill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiFireFill,
  RiStackFill,
  RiPieChartFill,
  RiBarChartFill,
} from "react-icons/ri";
import { GiTeacher, GiBookshelf, GiOpenBook, GiNotebook } from "react-icons/gi";
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
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/tutor-applications?tutorEmail=${user?.email}`,
      );
      setApplications(response.data.data || []);
      setFilteredApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort applications
  useEffect(() => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.tuition?.subject?.toLowerCase().includes(term) ||
          app.tuition?.class?.toLowerCase().includes(term) ||
          app.tuition?.location?.toLowerCase().includes(term) ||
          app.qualification?.toLowerCase().includes(term),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.appliedAt || b.createdAt) -
            new Date(a.appliedAt || a.createdAt)
          );
        case "oldest":
          return (
            new Date(a.appliedAt || a.createdAt) -
            new Date(b.appliedAt || b.createdAt)
          );
        case "fee-high":
          return (b.proposedFee || 0) - (a.proposedFee || 0);
        case "fee-low":
          return (a.proposedFee || 0) - (b.proposedFee || 0);
        case "subject":
          return (a.tuition?.subject || "").localeCompare(
            b.tuition?.subject || "",
          );
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm, sortBy]);

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
      pending:
        "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200",
      approved:
        "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
      rejected:
        "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200",
    };
    return (
      styles[status] ||
      "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700"
    );
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-amber-500" />,
      approved: <FaCheckCircle className="text-emerald-500" />,
      rejected: <FaTimesCircle className="text-rose-500" />,
    };
    return icons[status] || null;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "amber",
      approved: "emerald",
      rejected: "rose",
    };
    return colors[status] || "gray";
  };

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    totalProposed: applications.reduce(
      (sum, a) => sum + (a.proposedFee || 0),
      0,
    ),
  };

  const formatCurrency = (amount) => {
    return `৳${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaBook className="text-indigo-600 text-xl animate-pulse" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-indigo-600 font-medium">
            Loading your applications...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <GiBookshelf className="text-indigo-600" />
              My Applications
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <RiSparklingFill className="text-yellow-500" />
              Track and manage your tuition applications
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
              {viewMode === "grid" ? (
                <MdOutlineViewList className="text-xl text-gray-600" />
              ) : (
                <MdOutlineGridView className="text-xl text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl shadow-sm transition-all border ${
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:shadow-md"
              }`}>
              <FaFilter className="text-lg" />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards - GiChalkboard এর পরিবর্তে FaLayerGroup ব্যবহার */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: FaLayerGroup,
              color: "indigo",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: FaHourglassHalf,
              color: "amber",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: FaCheckCircle,
              color: "emerald",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: FaTimesCircle,
              color: "rose",
            },
            {
              label: "Total Value",
              value: formatCurrency(stats.totalProposed),
              icon: FaMoneyBillWave,
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600 text-lg`} />
                </div>
                <span className="text-xs text-gray-400">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="fee-high">Highest Fee</option>
                  <option value="fee-low">Lowest Fee</option>
                  <option value="subject">Subject</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm ||
                  statusFilter !== "all" ||
                  sortBy !== "recent") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setSortBy("recent");
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all">
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applications Grid/List */}
        {filteredApplications.length === 0 ? (
          <motion.div
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-4xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "No applications match your search criteria"
                : "You haven't applied to any tuitions yet"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortBy("recent");
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : viewMode === "grid" ? (
          // Grid View
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app._id}
                variants={fadeInUp}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden relative">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusBadge(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="capitalize">{app.status}</span>
                  </span>
                </div>

                {/* Header Gradient */}
                <div
                  className={`h-2 bg-gradient-to-r from-${getStatusColor(app.status)}-500 to-${getStatusColor(app.status)}-600`}></div>

                <div className="p-5">
                  {/* Title and Subject */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br from-${getStatusColor(app.status)}-100 to-${getStatusColor(app.status)}-200 rounded-xl flex items-center justify-center text-${getStatusColor(app.status)}-600 text-lg font-bold shadow-sm`}>
                      {app.tuition?.subject?.charAt(0) || "T"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {app.tuition?.subject}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <RiGraduationCapFill
                          className={`text-${getStatusColor(app.status)}-500`}
                        />
                        {app.tuition?.class}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaMapMarkerAlt className="text-rose-500 text-xs" />
                        <span className="text-xs text-gray-500">Location</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs truncate">
                        {app.tuition?.location}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaMoneyBillWave className="text-emerald-500 text-xs" />
                        <span className="text-xs text-gray-500">Budget</span>
                      </div>
                      <p className="font-semibold text-emerald-600 text-xs">
                        {formatCurrency(app.tuition?.budget)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <GiOpenBook className="text-blue-500 text-xs" />
                        <span className="text-xs text-gray-500">Your Fee</span>
                      </div>
                      <p className="font-semibold text-blue-600 text-xs">
                        {formatCurrency(app.proposedFee)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaCalendarAlt className="text-purple-500 text-xs" />
                        <span className="text-xs text-gray-500">Applied</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs">
                        {getTimeAgo(app.appliedAt || app.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Qualification
                        </p>
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {app.qualification || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Experience
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {app.experience || "N/A"}
                        </p>
                      </div>
                    </div>
                    {app.message && (
                      <div className="mt-2 pt-2 border-t border-indigo-200">
                        <p className="text-xs text-gray-500 mb-0.5">Message:</p>
                        <p className="text-xs text-gray-700 italic line-clamp-2">
                          "{app.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(app)}
                        className="flex-1 px-3 py-2 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5">
                        <FaEdit className="text-xs" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(app)}
                        className="flex-1 px-3 py-2 bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-200 transition-colors flex items-center justify-center gap-1.5">
                        <FaTrash className="text-xs" />
                        Delete
                      </button>
                    </div>
                  )}

                  {app.status === "approved" && (
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <FaCheckCircle className="text-emerald-600 text-lg mx-auto mb-1" />
                      <p className="text-emerald-700 font-semibold text-sm">
                        Application Approved!
                      </p>
                      <p className="text-emerald-600 text-xs">
                        You can now start teaching
                      </p>
                    </div>
                  )}

                  {app.status === "rejected" && (
                    <div className="bg-rose-50 rounded-lg p-3 text-center">
                      <FaTimesCircle className="text-rose-600 text-lg mx-auto mb-1" />
                      <p className="text-rose-700 font-semibold text-sm">
                        Application Rejected
                      </p>
                      <p className="text-rose-600 text-xs">
                        Try applying to other tuitions
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // List View
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Tuition
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Your Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((app, index) => (
                    <motion.tr
                      key={app._id}
                      variants={fadeInUp}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-${getStatusColor(app.status)}-100 rounded-lg flex items-center justify-center`}>
                            <FaBook
                              className={`text-${getStatusColor(app.status)}-600 text-sm`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {app.tuition?.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {app.tuition?.class}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs flex items-center gap-1">
                            <FaMapMarkerAlt className="text-rose-500 text-xs" />
                            <span className="text-gray-600">
                              {app.tuition?.location}
                            </span>
                          </p>
                          <p className="text-xs flex items-center gap-1">
                            <FaMoneyBillWave className="text-emerald-500 text-xs" />
                            <span className="text-gray-600">
                              {formatCurrency(app.tuition?.budget)}/mo
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-900">
                            {app.qualification || "N/A"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {app.experience || "N/A"} exp
                          </p>
                          <p className="text-xs font-semibold text-blue-600">
                            {formatCurrency(app.proposedFee)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusBadge(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600">
                          {getTimeAgo(app.appliedAt || app.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {app.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(app)}
                              className="p-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                              title="Edit">
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(app)}
                              className="p-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                              title="Delete">
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Summary Footer */}
        {filteredApplications.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-lg rounded-lg">
                  <FaPercentage className="text-xl text-yellow-300" />
                </div>
                <div>
                  <p className="text-white/80 text-xs">Success Rate</p>
                  <p className="text-lg font-bold">
                    {stats.total > 0
                      ? Math.round((stats.approved / stats.total) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-lg rounded-lg">
                  <FaMoneyBillWave className="text-xl text-yellow-300" />
                </div>
                <div>
                  <p className="text-white/80 text-xs">Average Proposed</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(stats.totalProposed / (stats.total || 1))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-lg rounded-lg text-sm">
                  {filteredApplications.length} of {applications.length} shown
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

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
