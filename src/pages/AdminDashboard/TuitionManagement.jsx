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
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaChartLine,
  FaDownload,
  FaPrint,
  FaEllipsisV,
  FaRegClock,
  FaRegCalendarCheck,
  FaRegMoneyBillAlt,
  FaRegUser,
  FaRegEnvelope,
  FaRegCommentDots,
  FaRegPaperPlane,
  FaRegHeart,
  FaRegBookmark,
  FaShare,
  FaGlobe,
  FaVideo,
  FaRegSmile,
  FaRegFrown,
  FaRegMeh,
  FaRegLaugh,
  FaRegLaughSquint,
  FaRegGrin,
  FaRegGrinStars,
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
  MdOutlinePerson,
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlineSchool,
  MdOutlineWork,
  MdOutlineDescription,
  MdOutlineVisibility,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineMoreVert,
  MdOutlineRefresh,
  MdOutlineFileDownload,
  MdOutlinePrint,
  MdOutlineShare,
} from "react-icons/md";
import {
  RiGraduationCapFill,
  RiUserStarFill,
  RiMapPinFill,
  RiCalendarFill,
  RiTimeFill,
  RiMoneyDollarCircleFill,
  RiVerifiedBadgeFill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiFireFill,
  RiMedalFill,
  RiAwardFill,
  RiStarFill,
  RiStarHalfFill,
  RiStarLine,
  RiUserSettingsFill,
  RiLockPasswordFill,
  RiGlobalFill,
  RiFacebookFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiGithubFill,
  RiMailFill,
  RiPhoneFill,
  RiMapPinFill as RiMapPinFillAlias,
  RiCalendarFill as RiCalendarFillAlias,
  RiUserFill,
} from "react-icons/ri";

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
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

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
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/all-tuitions");
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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "budget-high":
          return (b.budget || 0) - (a.budget || 0);
        case "budget-low":
          return (a.budget || 0) - (b.budget || 0);
        default:
          return 0;
      }
    });

    setFilteredTuitions(filtered);
    setCurrentPage(1);
  }, [tuitions, searchTerm, statusFilter, sortBy]);

  // Fetch applications for a tuition
  const fetchApplications = async (tuitionId) => {
    try {
      setApplicationsLoading(true);
      const response = await axios.get(`/tuition-applications/${tuitionId}`);
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
        setTuitions((prevTuitions) =>
          prevTuitions.map((t) =>
            t._id === tuitionId
              ? { ...t, status: "approved", approvedAt: new Date() }
              : t,
          ),
        );
        if (showDetailsModal) setShowDetailsModal(false);
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
        setTuitions((prevTuitions) =>
          prevTuitions.map((t) =>
            t._id === tuitionId
              ? { ...t, status: "rejected", rejectedAt: new Date() }
              : t,
          ),
        );
        if (showDetailsModal) setShowDetailsModal(false);
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

      const appResponse = await axios.put(`/applications/${applicationId}`, {
        status: "approved",
      });

      if (appResponse.data.success) {
        await axios.put(`/tuitions/${tuitionId}`, {
          status: "approved",
          tutorEmail: tutorEmail,
          approvedAt: new Date(),
          tutorAssigned: true,
        });

        toast.success(`✅ Tutor approved successfully!`);
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
      pending:
        "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200",
      approved:
        "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
      rejected:
        "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200",
      completed:
        "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200",
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
      completed: <FaCheckCircle className="text-blue-500" />,
    };
    return icons[status] || null;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "amber",
      approved: "emerald",
      rejected: "rose",
      completed: "blue",
    };
    return colors[status] || "gray";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${amount?.toLocaleString() || 0}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate stats
  const stats = {
    total: tuitions.length,
    pending: tuitions.filter((t) => t.status === "pending").length,
    approved: tuitions.filter((t) => t.status === "approved").length,
    rejected: tuitions.filter((t) => t.status === "rejected").length,
    completed: tuitions.filter((t) => t.status === "completed").length,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaBook className="text-indigo-600" />
              Tuition Management
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <RiSparklingFill className="text-yellow-500" />
              Review, approve or reject tuition posts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "grid" : "table")
              }
              className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
              {viewMode === "table" ? (
                <MdOutlineGridView className="text-xl text-gray-600" />
              ) : (
                <MdOutlineViewList className="text-xl text-gray-600" />
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
            <button
              onClick={fetchTuitions}
              className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
              <MdOutlineRefresh className="text-xl text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: FaBook,
              color: "indigo",
              trend: "+12%",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: FaHourglassHalf,
              color: "amber",
              trend: "+5%",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: FaCheckCircle,
              color: "emerald",
              trend: "+8%",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: FaTimesCircle,
              color: "rose",
              trend: "-2%",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: FaStar,
              color: "blue",
              trend: "+15%",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2.5 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600 text-lg`} />
                </div>
                <span className="text-xs text-gray-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <FaArrowUp className="text-xs" />
                {stat.trend}
              </p>
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-5 mb-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tuitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900">
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
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
                    className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tuitions Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBook className="text-indigo-600 text-xl animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredTuitions.length === 0 ? (
          <motion.div
            variants={scaleIn}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-4xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Tuitions Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "No tuitions match your search criteria"
                : "There are no tuitions in the system yet."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortBy("recent");
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : viewMode === "table" ? (
          /* Table View */
          <motion.div
            variants={fadeInUp}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Tuition
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Tutor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((tuition, index) => (
                    <motion.tr
                      key={tuition._id}
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-${getStatusColor(tuition.status)}-100 rounded-xl flex items-center justify-center`}>
                            <FaBook
                              className={`text-${getStatusColor(tuition.status)}-600 text-sm`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {tuition.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tuition.class}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {tuition.studentName ||
                              tuition.studentEmail?.split("@")[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tuition.studentEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaMapMarkerAlt className="text-rose-500 text-xs" />
                          <span className="text-sm">{tuition.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600">
                          {formatCurrency(tuition.budget)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${getStatusBadge(tuition.status)}`}>
                          {getStatusIcon(tuition.status)}
                          <span className="capitalize">{tuition.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tuition.tutorEmail ? (
                          <div className="flex items-center gap-1">
                            <FaUserTie className="text-indigo-600" />
                            <span className="text-sm text-gray-700">
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
                            className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
                            title="View Details">
                            <FaEye />
                          </button>

                          {tuition.applications > 0 && (
                            <button
                              onClick={() => {
                                setSelectedTuition(tuition);
                                fetchApplications(tuition._id);
                              }}
                              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors">
                              {tuition.applications} Applied
                            </button>
                          )}

                          {tuition.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(tuition._id)}
                                disabled={updating}
                                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors text-emerald-600"
                                title="Approve">
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleReject(tuition._id)}
                                disabled={updating}
                                className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600"
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredTuitions.length)} of{" "}
                {filteredTuitions.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200"
                  }`}>
                  Previous
                </button>
                <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium">
                  {currentPage}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200"
                  }`}>
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Grid View */
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((tuition, index) => (
              <motion.div
                key={tuition._id}
                variants={scaleIn}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden group">
                {/* Header Gradient */}
                <div
                  className={`h-2 bg-gradient-to-r from-${getStatusColor(tuition.status)}-500 to-${getStatusColor(tuition.status)}-600`}></div>

                <div className="p-5">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`w-12 h-12 bg-${getStatusColor(tuition.status)}-100 rounded-xl flex items-center justify-center`}>
                      <FaBook
                        className={`text-${getStatusColor(tuition.status)}-600 text-xl`}
                      />
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusBadge(tuition.status)}`}>
                      {getStatusIcon(tuition.status)}
                      <span className="capitalize">{tuition.status}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {tuition.subject}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{tuition.class}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <FaMapMarkerAlt className="text-rose-500 text-xs" />
                        <span className="text-xs text-gray-500">Location</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {tuition.location}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <FaMoneyBillWave className="text-emerald-500 text-xs" />
                        <span className="text-xs text-gray-500">Budget</span>
                      </div>
                      <p className="font-bold text-emerald-600 text-sm">
                        {formatCurrency(tuition.budget)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <FaUserGraduate className="text-indigo-500 text-xs" />
                        <span className="text-xs text-gray-500">Student</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {tuition.studentName ||
                          tuition.studentEmail?.split("@")[0]}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <FaCalendarAlt className="text-purple-500 text-xs" />
                        <span className="text-xs text-gray-500">Posted</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">
                        {formatDate(tuition.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Tutor Info */}
                  {tuition.tutorEmail && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 mb-4">
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-indigo-600" />
                        <span className="text-sm text-gray-700">
                          Tutor: {tuition.tutorEmail.split("@")[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedTuition(tuition);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors flex items-center justify-center gap-1">
                      <FaEye className="text-sm" />
                      Details
                    </button>

                    {tuition.applications > 0 && (
                      <button
                        onClick={() => {
                          setSelectedTuition(tuition);
                          fetchApplications(tuition._id);
                        }}
                        className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-1">
                        <FaUsers className="text-sm" />
                        {tuition.applications}
                      </button>
                    )}

                    {tuition.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(tuition._id)}
                          disabled={updating}
                          className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                          title="Approve">
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleReject(tuition._id)}
                          disabled={updating}
                          className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                          title="Reject">
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Summary Footer */}
        {filteredTuitions.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-lg rounded-lg">
                  <FaChartLine className="text-xl text-yellow-300" />
                </div>
                <div>
                  <p className="text-white/80 text-xs">Total Budget Value</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(
                      tuitions.reduce((sum, t) => sum + (t.budget || 0), 0),
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-lg rounded-lg">
                  <FaUsers className="text-xl text-yellow-300" />
                </div>
                <div>
                  <p className="text-white/80 text-xs">Total Applications</p>
                  <p className="text-lg font-bold">
                    {tuitions.reduce(
                      (sum, t) => sum + (t.applications || 0),
                      0,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-lg rounded-lg text-sm">
                  {filteredTuitions.length} of {tuitions.length} shown
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tuition Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTuition && (
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailsModal(false)}>
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="relative h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all hover:rotate-90">
                  <FaTimes size={18} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">
                    Tuition Details
                  </h2>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <FaBook className="text-pink-200" />
                    {selectedTuition.subject} - {selectedTuition.class}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MdOutlineInfo className="text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Subject</p>
                      <p className="font-medium text-gray-900">
                        {selectedTuition.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="font-medium text-gray-900">
                        {selectedTuition.class}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-medium text-emerald-600">
                        {formatCurrency(selectedTuition.budget)}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-rose-500 text-xs" />
                        {selectedTuition.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    Schedule
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Days/Week</p>
                      <p className="font-medium text-gray-900">
                        {selectedTuition.daysPerWeek || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time Slot</p>
                      <p className="font-medium text-gray-900">
                        {selectedTuition.timeSlot || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUserGraduate className="text-purple-600" />
                    Student Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedTuition.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedTuition.studentEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Posted On</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(selectedTuition.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusBadge(selectedTuition.status)}`}>
                        {getStatusIcon(selectedTuition.status)}
                        <span className="capitalize">
                          {selectedTuition.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tutor Info if assigned */}
                {selectedTuition.tutorEmail && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaUserTie className="text-emerald-600" />
                      Assigned Tutor
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 text-xl font-bold">
                        {selectedTuition.tutorEmail?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedTuition.tutorEmail}
                        </p>
                        <p className="text-xs text-emerald-600">
                          Approved on: {formatDate(selectedTuition.approvedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {selectedTuition.requirements && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MdOutlineDescription className="text-amber-600" />
                      Requirements
                    </h3>
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
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
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
                      className="flex-1 px-4 py-3 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {updating ? (
                        <div className="w-5 h-5 border-2 border-rose-700 border-t-transparent rounded-full animate-spin"></div>
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
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications Modal */}
      <AnimatePresence>
        {showApplicationsModal && selectedTuition && (
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowApplicationsModal(false)}>
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="relative h-24 bg-gradient-to-r from-purple-600 to-pink-600">
                <button
                  onClick={() => setShowApplicationsModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all hover:rotate-90">
                  <FaTimes size={18} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">
                    Tutor Applications
                  </h2>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <FaBook className="text-pink-200" />
                    {selectedTuition.subject} - {selectedTuition.class}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {applicationsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaUsers className="text-purple-600 text-sm animate-pulse" />
                      </div>
                    </div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUsers className="text-4xl text-purple-600" />
                    </div>
                    <p className="text-gray-900 font-medium text-lg">
                      No Applications Yet
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      No tutors have applied for this tuition
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          {/* Tutor Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                {app.tutorEmail?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {app.tutorEmail?.split("@")[0]}
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaEnvelope className="text-gray-400" />
                                  {app.tutorEmail}
                                </p>
                              </div>
                            </div>

                            {/* Application Details */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Qualification
                                </p>
                                <p className="font-medium text-gray-900 text-sm">
                                  {app.qualification || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Experience
                                </p>
                                <p className="font-medium text-gray-900 text-sm">
                                  {app.experience || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Expected Fee
                                </p>
                                <p className="font-medium text-emerald-600 text-sm">
                                  {formatCurrency(app.proposedFee)}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500">
                                  Applied On
                                </p>
                                <p className="font-medium text-gray-900 text-sm">
                                  {formatDate(app.appliedAt)}
                                </p>
                              </div>
                            </div>

                            {app.message && (
                              <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                                <p className="text-sm text-gray-700 italic">
                                  "{app.message}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Status & Actions */}
                          <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(app.status)}`}>
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </span>

                            {app.status === "pending" && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleRejectTutor(app._id)}
                                  disabled={updating}
                                  className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-xs flex items-center gap-1">
                                  <FaTimes size={10} />
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
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all text-xs flex items-center gap-1">
                                  <FaCheck size={10} />
                                  Approve
                                </button>
                              </div>
                            )}

                            {app.status === "approved" && (
                              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                <FaCheckCircle className="text-emerald-600" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TuitionManagement;
