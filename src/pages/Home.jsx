
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
} from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    minBudget: "",
    maxBudget: "",
  });

  useEffect(() => {
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/all-tuitions");
      console.log("Fetched tuitions:", response.data);
      setTuitions(response.data || []);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
      toast.error("Failed to load tuitions");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-20 px-4 text-white">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Tuition Management System
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Find verified tutors, manage tuition, and track payments easily.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDashboard}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 font-semibold text-white shadow-lg flex items-center gap-2">
            Go to Dashboard
            <FaArrowRight />
          </motion.button>

          {!user && (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white/20 backdrop-blur-sm font-semibold text-white hover:bg-white/30 transition-all">
                  Login
                </motion.button>
              </Link>
              <Link to="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white/20 backdrop-blur-sm font-semibold text-white hover:bg-white/30 transition-all">
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject or location..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
              <FaFilter />
              Clear Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <input
              type="text"
              placeholder="Subject"
              className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
              value={filters.subject}
              onChange={(e) =>
                setFilters({ ...filters, subject: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Min Budget"
              className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
              value={filters.minBudget}
              onChange={(e) =>
                setFilters({ ...filters, minBudget: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Budget"
              className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
              value={filters.maxBudget}
              onChange={(e) =>
                setFilters({ ...filters, maxBudget: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Latest Tuitions Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          {filteredTuitions.length > 0
            ? "Available Tuitions"
            : "No Tuitions Found"}
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTuitions.map((tuition, index) => (
              <motion.div
                key={tuition._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {tuition.subject}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <FaGraduationCap className="text-blue-500" />
                        {tuition.class}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Available
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{tuition.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMoneyBillWave className="text-green-600" />
                      <span className="font-semibold">
                        ৳{tuition.budget}/month
                      </span>
                    </div>

                    {tuition.daysPerWeek && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-purple-500" />
                        <span>{tuition.daysPerWeek} days/week</span>
                      </div>
                    )}

                    {tuition.timeSlot && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-orange-500" />
                        <span>{tuition.timeSlot}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button - This is what you need */}
                  <Link to={`/tuition/${tuition._id}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <FaEye />
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Top Tutors Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Top Tutors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {item === 1 ? "JD" : item === 2 ? "JS" : "RB"}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {item === 1
                  ? "John Doe"
                  : item === 2
                    ? "Jane Smith"
                    : "Robert Brown"}
              </h3>
              <p className="text-gray-200 mb-2">
                {item === 1
                  ? "Mathematics"
                  : item === 2
                    ? "English"
                    : "Physics"}
              </p>
              <p className="text-sm text-gray-300">⭐ 4.8 • 5 years exp.</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How it works Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-12 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Post Tuition</h3>
            <p className="text-gray-200">
              Students post tuition requirements online with details like
              subject, class, location and budget.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Apply & Approve</h3>
            <p className="text-gray-200">
              Qualified tutors apply and students review applications to select
              the best tutor.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment & Track</h3>
            <p className="text-gray-200">
              Secure payments are completed and tuition progress is tracked
              through the dashboard.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-300">
          <p>&copy; 2024 Tuition Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
