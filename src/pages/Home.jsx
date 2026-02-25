
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { motion } from "framer-motion";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import {
  FaBook,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUserGraduate,
  FaGraduationCap,
  FaClock,
  FaFilter,
  FaSearch,
  FaArrowRight,
  FaEye,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaRocket,
  FaHandsHelping,
  FaShieldAlt,
} from "react-icons/fa";
import { MdVerified, MdLocationOn, MdSchool } from "react-icons/md";

const Home = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [tuitions, setTuitions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    minBudget: "",
    maxBudget: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch tuitions
      const tuitionsResponse = await axios.get("/all-tuitions");
      console.log("Fetched tuitions:", tuitionsResponse.data);
      setTuitions(tuitionsResponse.data || []);

      // Fetch tutors (users with role 'tutor')
      const usersResponse = await axios.get("/users");
      const tutorList = (usersResponse.data || []).filter(
        (user) => user.role === "tutor",
      );
      // Add random ratings for demo
      const tutorsWithRatings = tutorList.map((tutor) => ({
        ...tutor,
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 50,
        students: Math.floor(Math.random() * 100) + 20,
        subjects: tutor.subject || "Mathematics",
      }));
      setTutors(tutorsWithRatings.slice(0, 6)); // Show top 6 tutors
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    if (!user) {
      navigate("/login");
    } else {
      checkUserRole();
    }
  };

  const checkUserRole = async () => {
    try {
      const response = await axios.get(`/users/role/${user.email}`);
      if (response.data.role === "tutor") {
        navigate("/tutor");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking role:", error);
      navigate("/dashboard");
    }
  };

  const filteredTuitions = tuitions.filter((tuition) => {
    if (
      searchTerm &&
      !tuition.subject?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !tuition.location?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filters.subject && tuition.subject !== filters.subject) return false;
    if (
      filters.location &&
      !tuition.location?.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.minBudget && tuition.budget < parseInt(filters.minBudget))
      return false;
    if (filters.maxBudget && tuition.budget > parseInt(filters.maxBudget))
      return false;

    return true;
  });

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(numRating)) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === Math.ceil(numRating) && !Number.isInteger(numRating)) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-600/10 to-orange-700/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section - Modern Redesign */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
              Find Your Perfect
            </span>
            <br />
            <span className="text-white">Tutor Today</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Connect with verified tutors, manage tuitions, and track progress -
            all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDashboard}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 font-bold text-white shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 text-lg">
              Get Started
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {!user && (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm font-semibold text-white hover:bg-white/20 transition-all border border-white/20 text-lg">
                    Login
                  </motion.button>
                </Link>
                <Link to="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-transparent border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-all text-lg">
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <MdVerified className="text-orange-500 text-lg" />
              <span>5000+ Verified Tutors</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-500 text-lg" />
              <span>10000+ Success Stories</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Section - Modern Redesign */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by subject or location..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() =>
                setFilters({
                  subject: "",
                  location: "",
                  minBudget: "",
                  maxBudget: "",
                })
              }
              className="px-6 py-4 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 border border-gray-600">
              <FaFilter />
              Clear Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <input
              type="text"
              placeholder="Subject"
              className="px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filters.subject}
              onChange={(e) =>
                setFilters({ ...filters, subject: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Min Budget"
              className="px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filters.minBudget}
              onChange={(e) =>
                setFilters({ ...filters, minBudget: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Budget"
              className="px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filters.maxBudget}
              onChange={(e) =>
                setFilters({ ...filters, maxBudget: e.target.value })
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Latest Tuitions Section - Modern Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Latest Tuition Opportunities
          </h2>
          <p className="text-xl text-gray-400">
            Find your perfect teaching or learning opportunity
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBook className="text-orange-500 text-2xl animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredTuitions.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-3xl">
            <FaBook className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              No Tuitions Found
            </h3>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTuitions.slice(0, 6).map((tuition, index) => (
              <motion.div
                key={tuition._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-orange-500/30">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {tuition.subject}
                      </h3>
                      <p className="text-gray-400 flex items-center gap-1">
                        <FaGraduationCap className="text-orange-500" />
                        {tuition.class}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
                      Available
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span>{tuition.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <FaMoneyBillWave className="text-orange-500" />
                      <span className="font-semibold text-orange-400">
                        ৳{tuition.budget}/month
                      </span>
                    </div>

                    {tuition.daysPerWeek && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaClock className="text-orange-500" />
                        <span>{tuition.daysPerWeek} days/week</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/tuition/${tuition._id}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-orange-500/30">
                      <FaEye />
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredTuitions.length > 6 && (
          <div className="text-center mt-8">
            <Link
              to="/tuitions"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold">
              View All Tuitions <FaArrowRight />
            </Link>
          </div>
        )}
      </motion.div>

      {/* Top Tutors Section - Modern with Ratings */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Top Rated Tutors
          </h2>
          <p className="text-xl text-gray-400">
            Learn from the best educators in Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-orange-500/30">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {tutor.name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {tutor.name || "Tutor Name"}
                    </h3>
                    <p className="text-orange-400 text-sm">{tutor.subjects}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">{renderStars(tutor.rating)}</div>
                  <span className="text-white font-semibold">
                    {tutor.rating}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({tutor.reviews} reviews)
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Experience</p>
                    <p className="text-sm font-semibold text-white">
                      {tutor.experience || "5+"} years
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Students</p>
                    <p className="text-sm font-semibold text-white">
                      {tutor.students}+
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-300 mb-4 text-sm">
                  <MdLocationOn className="text-orange-500" />
                  <span>{tutor.location || tutor.districtName || "Dhaka"}</span>
                </div>

                <Link to={`/tutor/${tutor._id}`}>
                  <button className="w-full py-3 bg-transparent border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                    View Profile
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/tutors"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold">
            View All Tutors <FaArrowRight />
          </Link>
        </div>
      </motion.div>

      {/* How It Works Section - Modern Redesign */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-400">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700 group hover:border-orange-500/30 transition-all">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              1
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
              <FaBook />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Post Tuition</h3>
            <p className="text-gray-400">
              Students post their tuition requirements with details like
              subject, class, location, and budget.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700 group hover:border-orange-500/30 transition-all">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              2
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
              <FaChalkboardTeacher />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Apply & Approve
            </h3>
            <p className="text-gray-400">
              Qualified tutors apply, and students review profiles to select the
              best match.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700 group hover:border-orange-500/30 transition-all">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              3
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
              <FaMoneyBillWave />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Payment & Track
            </h3>
            <p className="text-gray-400">
              Secure payments are completed and tuition progress is tracked
              through the dashboard.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Why Choose Us Section - New Addition */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-400">
            We're committed to your educational success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Verified Tutors
            </h3>
            <p className="text-gray-400">
              All tutors undergo thorough background verification for your
              safety.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              <FaRocket />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fast Matching</h3>
            <p className="text-gray-400">
              Find the perfect tutor within hours, not days.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              <FaHandsHelping />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-400">
              Safe and transparent payment system for peace of mind.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-12 text-center border border-gray-700 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students and tutors already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Sign Up as Student
            </Link>
            <Link
              to="/sign-up?role=tutor"
              className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300">
              Become a Tutor
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2024 Tuition Platform. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Empowering education across Bangladesh
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
