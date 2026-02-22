// src/pages/TutorDashboard/TutorOngoingTuitions.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBook,
  FaCheckCircle,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaStar,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaRegClock,
  FaRegCalendarCheck,
  FaRegMoneyBillAlt,
  FaRegUserCircle,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaVideo,
  FaRegCommentDots,
  FaEllipsisV,
  FaArrowRight,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaShare,
  FaRegPaperPlane,
} from "react-icons/fa";
import {
  MdOutlineLocationOn,
  MdOutlineAccessTime,
  MdOutlineDateRange,
  MdOutlineSubject,
  MdOutlineSchool,
  MdOutlineClass,
  MdOutlinePerson,
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlineVideoCall,
  MdOutlineMessage,
  MdOutlineMoreVert,
  MdOutlineSchedule,
  MdOutlineCalendarToday,
  MdOutlineAttachMoney,
  MdOutlineVerified,
  MdOutlineStar,
  MdOutlineStarBorder,
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
} from "react-icons/ri";
import {
  TbBrandWhatsapp,
  TbBrandFacebook,
  TbBrandTwitter,
} from "react-icons/tb";

const TutorOngoingTuitions = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterLocation, setFilterLocation] = useState("all");

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
    fetchOngoingTuitions();
  }, [user]);

  const fetchOngoingTuitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/tutor-ongoing-tuitions?tutorEmail=${user?.email}`,
      );
      setTuitions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching ongoing tuitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTuitions = () => {
    let filtered = [...tuitions];

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterLocation !== "all") {
      filtered = filtered.filter((t) => t.location === filterLocation);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.approvedAt || b.updatedAt) -
            new Date(a.approvedAt || a.updatedAt)
          );
        case "subject":
          return a.subject?.localeCompare(b.subject);
        case "fee-high":
          return (b.budget || 0) - (a.budget || 0);
        case "fee-low":
          return (a.budget || 0) - (b.budget || 0);
        default:
          return 0;
      }
    });

    return filtered;
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
    return new Date(dateString).toLocaleDateString();
  };

  const locations = [
    ...new Set(tuitions.map((t) => t.location).filter(Boolean)),
  ];
  const filteredTuitions = getFilteredTuitions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaChalkboardTeacher className="text-emerald-600 text-xl animate-pulse" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-emerald-600 font-medium">
            Loading your ongoing tuitions...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaChalkboardTeacher className="text-emerald-600" />
              Ongoing Tuitions
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <RiVerifiedBadgeFill className="text-emerald-500" />
              {tuitions.length} active{" "}
              {tuitions.length === 1 ? "tuition" : "tuitions"} in progress
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tuitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto">
              <option value="recent">Most Recent</option>
              <option value="subject">Subject</option>
              <option value="fee-high">Highest Fee</option>
              <option value="fee-low">Lowest Fee</option>
            </select>

            {/* Location Filter */}
            {locations.length > 0 && (
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto">
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Ongoing",
              value: tuitions.length,
              icon: FaChalkboardTeacher,
              color: "emerald",
            },
            {
              label: "Total Earnings",
              value: `৳${tuitions.reduce((sum, t) => sum + (t.budget || 0), 0).toLocaleString()}`,
              icon: FaMoneyBillWave,
              color: "blue",
            },
            {
              label: "Students",
              value: tuitions.length,
              icon: FaUserGraduate,
              color: "purple",
            },
            {
              label: "Hours/Week",
              value: tuitions
                .reduce((sum, t) => sum + (t.daysPerWeek || 0) * 1.5, 0)
                .toFixed(1),
              icon: FaClock,
              color: "amber",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
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

        {/* Main Content */}
        {filteredTuitions.length === 0 ? (
          <motion.div
            variants={scaleIn}
            className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-4xl text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Ongoing Tuitions
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterLocation !== "all"
                ? "No tuitions match your search criteria"
                : "You don't have any approved tuitions at the moment. Keep applying to new opportunities!"}
            </p>
            {(searchTerm || filterLocation !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterLocation("all");
                  setSortBy("recent");
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTuitions.map((tuition, index) => (
              <motion.div
                key={tuition._id}
                variants={fadeInUp}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden relative">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>

                {/* Header Gradient */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"></div>

                <div className="p-6">
                  {/* Title and Subject */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {tuition.subject?.charAt(0) || "T"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {tuition.subject}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <RiGraduationCapFill className="text-emerald-500" />
                        {tuition.class}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUserGraduate className="text-emerald-500 text-sm" />
                        <span className="text-xs text-gray-500">Student</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {tuition.studentName || "Student"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMoneyBillWave className="text-emerald-500 text-sm" />
                        <span className="text-xs text-gray-500">
                          Monthly Fee
                        </span>
                      </div>
                      <p className="font-semibold text-emerald-600 text-sm">
                        ৳{tuition.budget?.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-emerald-500 text-sm" />
                        <span className="text-xs text-gray-500">Location</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {tuition.location}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FaClock className="text-emerald-500 text-sm" />
                        <span className="text-xs text-gray-500">Schedule</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {tuition.daysPerWeek} days/week
                      </p>
                    </div>
                  </div>

                  {/* Time and Started Info */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <FaRegClock className="text-emerald-500" />
                          Time Slot
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {tuition.timeSlot || "Flexible"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <FaRegCalendarCheck className="text-emerald-500" />
                          Started
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {getTimeAgo(tuition.approvedAt || tuition.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                      <FaVideo className="text-white text-sm group-hover:scale-110 transition-transform" />
                      Join Class
                    </button>
                    <button className="px-4 py-2.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-xl hover:bg-emerald-200 transition-all duration-300 flex items-center gap-2">
                      <FaRegCommentDots />
                      <span>Message</span>
                    </button>
                    <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300">
                      <FaEllipsisV className="text-sm" />
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500">Session Progress</span>
                      <span className="font-medium text-emerald-600">
                        Week 3 of 12
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Stats Footer */}
        {filteredTuitions.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl">
                  <FaChalkboardTeacher className="text-2xl text-yellow-300" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total Teaching Hours</p>
                  <h4 className="text-2xl font-bold">
                    {tuitions.reduce(
                      (sum, t) => sum + (t.daysPerWeek || 0) * 1.5 * 4,
                      0,
                    )}{" "}
                    hrs/month
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl">
                  <FaMoneyBillWave className="text-2xl text-yellow-300" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Monthly Income</p>
                  <h4 className="text-2xl font-bold">
                    ৳
                    {tuitions
                      .reduce((sum, t) => sum + (t.budget || 0), 0)
                      .toLocaleString()}
                  </h4>
                </div>
              </div>

              <button className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                View Schedule
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TutorOngoingTuitions;
