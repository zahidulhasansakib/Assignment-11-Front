
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FaCertificate,
  FaBriefcase,
  FaDollarSign,
  FaQuoteRight,
  FaEnvelope,
  FaUser,
  FaInfoCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaEye,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLink,
  FaStar,
  FaShieldAlt,
  FaClock as FaClockRegular,
  FaChalkboardTeacher,
  FaUsers,
  FaGlobe,
  FaPhone,
  FaVideo,
  FaRegClock,
  FaRegCalendarCheck,
  FaRegBuilding,
  FaRegSmile,
  FaRegHeart,
  FaRegBookmark,
  FaBookmark,
  FaRegPaperPlane,
  FaPaperPlane,
  FaRegCommentDots,
  FaCommentDots,
  FaRegUserCircle,
  FaUserCircle,
  FaRegClock as FaRegClockOutline,
} from "react-icons/fa";
import {
  MdEmail,
  MdSubject,
  MdLocationOn,
  MdSchool,
  MdWork,
  MdVerified,
  MdSecurity,
  MdTrendingUp,
  MdOutlineTimer,
  MdOutlinePeople,
  MdOutlineLocationOn,
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdOutlineAccessTime,
  MdOutlineBookmarkBorder,
  MdBookmark,
  MdOutlineShare,
  MdOutlineFavoriteBorder,
  MdFavorite,
  MdOutlineInfo,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdOutlineHourglassEmpty,
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
  RiHeartFill,
  RiHeartLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiShareForwardFill,
  RiShareForwardLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import {
  TbMathSymbols,
  TbBrandWhatsapp,
  TbBrandFacebook,
  TbBrandTwitter,
} from "react-icons/tb";
import { HiOutlinePhotograph, HiOutlineDocumentText } from "react-icons/hi";

const TuitionDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [applicationData, setApplicationData] = useState({
    qualification: "",
    experience: "",
    proposedFee: "",
    message: "",
    availableDays: [],
    availableTime: "",
    teachingMethod: "",
    specialSkills: "",
  });

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
    fetchTuitionDetails();
    if (user?.email) {
      fetchUserRole();
    }
  }, [id, user]);

  const fetchUserRole = async () => {
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
      toast.error("Failed to load tuition details");
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this tuition opportunity for ${tuition?.subject}`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
    setShowShareMenu(false);
  };

  const isOwner = user?.email === tuition?.studentStudentEmail;

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

  const getStatusIcon = (status) => {
    const icons = {
      pending: <MdOutlineHourglassEmpty className="text-amber-500" />,
      approved: <MdOutlineCheckCircle className="text-emerald-500" />,
      rejected: <MdOutlineCancel className="text-rose-500" />,
      completed: <FaCheckCircle className="text-blue-500" />,
    };
    return icons[status] || null;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-6"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Loading Tuition Details
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch the information...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-md border border-white/50">
          <div className="w-28 h-28 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-5xl text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Tuition Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The tuition you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/tuitions")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Browse Other Tuitions
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
            <FaArrowLeft className="text-indigo-600 group-hover:-translate-x-1 transition-transform" />
            <span className="text-gray-700 font-medium">Back to Listings</span>
          </button>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSaved(!isSaved)}
              className="relative p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group">
              {isSaved ? (
                <RiBookmarkFill className="text-2xl text-indigo-600" />
              ) : (
                <RiBookmarkLine className="text-2xl text-gray-600 group-hover:text-indigo-600 transition-colors" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="relative p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group">
              {isFavorite ? (
                <RiHeartFill className="text-2xl text-rose-500" />
              ) : (
                <RiHeartLine className="text-2xl text-gray-600 group-hover:text-rose-500 transition-colors" />
              )}
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                <RiShareForwardLine className="text-2xl text-gray-600" />
              </motion.button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50">
                    {[
                      {
                        icon: TbBrandWhatsapp,
                        label: "WhatsApp",
                        color: "text-green-500",
                        action: "whatsapp",
                      },
                      {
                        icon: TbBrandFacebook,
                        label: "Facebook",
                        color: "text-blue-600",
                        action: "facebook",
                      },
                      {
                        icon: TbBrandTwitter,
                        label: "Twitter",
                        color: "text-sky-500",
                        action: "twitter",
                      },
                      {
                        icon: FaLink,
                        label: "Copy Link",
                        color: "text-gray-600",
                        action: "copy",
                      },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleShare(item.action)}
                        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-indigo-50 transition-colors group">
                        <item.icon className={`text-xl ${item.color}`} />
                        <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
              {/* Hero Gradient */}
              <div className="relative h-64 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
                {/* Animated Background */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [90, 0, 90],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
                />

                {/* Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium flex items-center gap-2">
                        <RiVerifiedBadgeFill className="text-indigo-200" />
                        Verified Tuition
                      </span>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusBadge(tuition.status)}`}>
                        {getStatusIcon(tuition.status)}
                        {tuition.status?.charAt(0).toUpperCase() +
                          tuition.status?.slice(1)}
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                      {tuition.subject}
                    </h1>
                    <p className="text-xl text-white/90 flex items-center gap-2">
                      <RiGraduationCapFill className="text-2xl" />
                      {tuition.class}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
                {[
                  {
                    icon: FaEye,
                    label: "Views",
                    value: tuition.views || 0,
                    color: "text-blue-500",
                  },
                  {
                    icon: FaUsers,
                    label: "Applications",
                    value: tuition.applications || 0,
                    color: "text-purple-500",
                  },
                  {
                    icon: FaRegClock,
                    label: "Posted",
                    value: getTimeAgo(tuition.createdAt),
                    color: "text-green-500",
                  },
                ].map((stat, index) => (
                  <div key={index} className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <stat.icon className={`text-lg ${stat.color}`} />
                      <span className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 px-8">
                <div className="flex gap-8">
                  {[
                    { id: "details", label: "Details", icon: MdOutlineInfo },
                    {
                      id: "requirements",
                      label: "Requirements",
                      icon: FaShieldAlt,
                    },
                    {
                      id: "student",
                      label: "Student Info",
                      icon: FaUserGraduate,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 font-medium text-base flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}>
                      <tab.icon className="text-lg" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-6">
                      {/* Quick Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-6 border border-indigo-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-indigo-200 rounded-xl">
                              <FaMoneyBillWave className="text-2xl text-indigo-700" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              Monthly Budget
                            </span>
                          </div>
                          <p className="text-3xl font-extrabold text-indigo-700">
                            ৳{tuition.budget}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            per month
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-200 rounded-xl">
                              <MdLocationOn className="text-2xl text-purple-700" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              Location
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-purple-700">
                            {tuition.location}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Area/District
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-200 rounded-xl">
                              <FaCalendarAlt className="text-2xl text-blue-700" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              Schedule
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-blue-700">
                            {tuition.daysPerWeek} days/week
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {tuition.timeSlot}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-emerald-200 rounded-xl">
                              <FaClock className="text-2xl text-emerald-700" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              Duration
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-emerald-700">
                            60-90 min
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            per session
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <FaInfoCircle className="text-indigo-600" />
                          About This Tuition
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {tuition.description || "No description provided."}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "requirements" && (
                    <motion.div
                      key="requirements"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-5">
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200">
                        <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                          <FaShieldAlt className="text-amber-600" />
                          Requirements
                        </h3>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <div className="p-1 bg-amber-200 rounded-lg mt-0.5">
                              <FaCheck className="text-amber-700 text-xs" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Educational Background
                              </p>
                              <p className="text-gray-600 text-sm">
                                Minimum{" "}
                                {tuition.requirements || "Bachelor's degree"}
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="p-1 bg-amber-200 rounded-lg mt-0.5">
                              <FaCheck className="text-amber-700 text-xs" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Experience
                              </p>
                              <p className="text-gray-600 text-sm">
                                {tuition.experience || "2+ years"} teaching
                                experience
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="p-1 bg-amber-200 rounded-lg mt-0.5">
                              <FaCheck className="text-amber-700 text-xs" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Communication
                              </p>
                              <p className="text-gray-600 text-sm">
                                Excellent verbal and written communication
                                skills
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "student" && (
                    <motion.div
                      key="student"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-5">
                      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-2xl p-6 border border-cyan-200">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {tuition.studentName?.charAt(0) || "S"}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {tuition.studentName}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-1 mt-1">
                              <MdEmail className="text-cyan-600" />
                              {tuition.studentEmail}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/60 rounded-xl p-4">
                            <p className="text-sm text-gray-500 mb-1">
                              Member Since
                            </p>
                            <p className="font-semibold text-gray-800">
                              {formatDate(tuition.createdAt)}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4">
                            <p className="text-sm text-gray-500 mb-1">
                              Total Posts
                            </p>
                            <p className="font-semibold text-gray-800">
                              {tuition.userPosts || 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaRegPaperPlane className="text-indigo-600" />
                Apply for This Tuition
              </h3>

              {!user ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Please login to apply for this tuition
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    Login to Apply
                  </button>
                </div>
              ) : userRole !== "tutor" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-amber-800 text-sm font-medium">
                    Only tutors can apply for tuitions.
                  </p>
                </div>
              ) : isOwner ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-800 text-sm font-medium">
                    You posted this tuition.
                  </p>
                </div>
              ) : tuition.status !== "pending" ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                  <p className="text-rose-800 text-sm font-medium">
                    This tuition is no longer accepting applications.
                  </p>
                </div>
              ) : hasApplied ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCheckCircle className="text-emerald-500 text-xl" />
                      <p className="font-semibold text-emerald-800">
                        Application Submitted
                      </p>
                    </div>
                    <p className="text-emerald-700 text-sm">
                      You've already applied for this tuition. Check your
                      dashboard for updates.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/tutor/my-applications")}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300">
                    View My Applications
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
                  <FaRegPaperPlane className="group-hover:translate-x-1 transition-transform" />
                  Apply Now
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    Free
                  </span>
                </button>
              )}

              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaRegSmile className="text-indigo-600" />
                  Application Tips
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 text-xs mt-1" />
                    <span>Highlight your relevant experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 text-xs mt-1" />
                    <span>Be specific about your teaching methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 text-xs mt-1" />
                    <span>Mention your availability clearly</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Similar Tuitions */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MdTrendingUp className="text-indigo-600" />
                Similar Tuitions
              </h3>

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <FaBook className="text-indigo-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        Mathematics
                      </h4>
                      <p className="text-xs text-gray-500">
                        Class 9-10 • Dhaka
                      </p>
                      <p className="text-sm font-bold text-indigo-600 mt-1">
                        ৳5,000/mo
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Modal - Beautiful Aesthetic Design */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowApplyModal(false)}>
            <motion.div
              variants={scaleIn}
              className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-white/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-black/20" />
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all hover:rotate-90 z-10">
                  <FaTimes size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">
                    Apply for Tuition
                  </h2>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <FaBook className="text-pink-200" />
                    {tuition?.subject} - {tuition?.class}
                  </p>
                </div>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleApply}
                className="p-8 space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
                {/* Tuition Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <MdLocationOn className="text-indigo-600" />
                        {tuition?.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <FaMoneyBillWave className="text-green-600" />৳
                        {tuition?.budget}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Schedule</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <FaClock className="text-blue-600" />
                        {tuition?.daysPerWeek} days/week
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <FaRegClockOutline className="text-purple-600" />
                        {tuition?.timeSlot}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <FaUser className="text-indigo-600" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={user?.displayName || ""}
                      readOnly
                      className="w-full p-4 bg-gray-100 border-2 border-gray-300 rounded-2xl text-gray-900 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <MdEmail className="text-indigo-600 text-lg" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full p-4 bg-gray-100 border-2 border-gray-300 rounded-2xl text-gray-900 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                    <FaCertificate className="text-indigo-600" />
                    Qualifications <span className="text-rose-500">*</span>
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
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-white"
                    placeholder="e.g., B.Sc in Mathematics, M.Sc in Physics"
                    required
                  />
                </div>

                {/* Experience & Salary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <FaBriefcase className="text-indigo-600" />
                      Experience <span className="text-rose-500">*</span>
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
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-white"
                      placeholder="e.g., 3 years"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <FaDollarSign className="text-indigo-600" />
                      Expected Salary (৳){" "}
                      <span className="text-rose-500">*</span>
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
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-bold bg-white"
                      min="1000"
                      step="100"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Minimum suggested: ৳{tuition?.budget}
                    </p>
                  </div>
                </div>

                {/* Teaching Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                    <FaChalkboardTeacher className="text-indigo-600" />
                    Teaching Method
                  </label>
                  <select
                    value={applicationData.teachingMethod}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        teachingMethod: e.target.value,
                      })
                    }
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 bg-white">
                    <option value="">Select teaching method</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both Online & Offline</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                    <FaQuoteRight className="text-indigo-600" />
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
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-white resize-none"
                    placeholder="Tell the student why you're the best candidate..."
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-gray-300 transition-all duration-300">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300">
                    {applying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TuitionDetails;
