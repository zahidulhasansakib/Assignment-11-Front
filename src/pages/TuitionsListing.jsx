// src/pages/TuitionsListing.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaBook,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaGraduationCap,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaUserGraduate,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
  FaDollarSign,
  FaTimes,
  FaCheck,
  FaSlidersH,
} from "react-icons/fa";
import { MdLocationOn, MdSubject } from "react-icons/md";

const TuitionsListing = () => {
  const axios = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [filteredTuitions, setFilteredTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showFilters, setShowFilters] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState("newest");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter states - শুধু ৩ টা
  const [filters, setFilters] = useState({
    subject: "",
    class: "",
    location: "",
  });

  // Subjects for filter dropdown
  const subjects = [
    "All Subjects",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Bangla",
    "ICT",
    "Accounting",
    "Finance",
    "Economics",
    "Business Studies",
    "General Science",
    "Computer Science",
  ];

  // Classes for filter dropdown
  const classes = [
    "All Classes",
    "Play Group",
    "Nursery",
    "KG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "College/University",
    "Admission Test",
  ];

  useEffect(() => {
    fetchAllTuitions();
  }, []);

  const fetchAllTuitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/all-tuitions");
      console.log("All tuitions:", response.data);

      const tuitionData = response.data.data || response.data || [];
      setTuitions(tuitionData);

      toast.success(`${tuitionData.length} tuitions loaded!`);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
      toast.error("Failed to load tuitions");
    } finally {
      setLoading(false);
    }
  };

  // Filter, Search and Sort functionality
  useEffect(() => {
    let filtered = [...tuitions];

    // 1. Search by subject, location, or class
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

    // 2. Apply filters - শুধু ৩ টা
    if (filters.subject && filters.subject !== "All Subjects") {
      filtered = filtered.filter((t) => t.subject === filters.subject);
    }

    if (filters.class && filters.class !== "All Classes") {
      filtered = filtered.filter((t) => t.class === filters.class);
    }

    if (filters.location) {
      filtered = filtered.filter((t) =>
        t.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    // 3. Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return sortOrder === "desc"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);

        case "oldest":
          return sortOrder === "desc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);

        case "budget-high":
          return sortOrder === "desc"
            ? b.budget - a.budget
            : a.budget - b.budget;

        case "budget-low":
          return sortOrder === "desc"
            ? a.budget - b.budget
            : b.budget - a.budget;

        default:
          return 0;
      }
    });

    setFilteredTuitions(filtered);
    setCurrentPage(1);
  }, [tuitions, searchTerm, filters, sortBy, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      subject: "",
      class: "",
      location: "",
    });
    setSortBy("newest");
    setSortOrder("desc");
  };

  // Count active filters
  const activeFilterCount =
    Object.values(filters).filter(
      (v) => v && v !== "" && v !== "All Subjects" && v !== "All Classes",
    ).length + (searchTerm ? 1 : 0);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTuitions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredTuitions.length / itemsPerPage);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Find Your Perfect Tuition
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Browse through {filteredTuitions.length} available tuition posts
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="text"
                  placeholder="🔍 Search by subject, class, location..."
                  className="w-full pl-12 pr-4 py-4 text-gray-900 text-lg font-medium border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all bg-white placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ color: "#111827" }}
                />
              </div>
            </div>

            {/* Sort and Filter Buttons */}
            <div className="flex gap-2">
              <select
                className="px-4 py-4 text-gray-900 text-lg font-medium border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ color: "#111827" }}>
                <option value="newest" className="text-gray-900">
                  📅 Newest First
                </option>
                <option value="oldest" className="text-gray-900">
                  📅 Oldest First
                </option>
                <option value="budget-high" className="text-gray-900">
                  💰 Budget: High to Low
                </option>
                <option value="budget-low" className="text-gray-900">
                  💰 Budget: Low to High
                </option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="px-4 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-300"
                title={sortOrder === "desc" ? "Descending" : "Ascending"}>
                {sortOrder === "desc" ? (
                  <FaSortAmountDown size={20} />
                ) : (
                  <FaSortAmountUp size={20} />
                )}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-lg font-medium border-2 ${
                  showFilters
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}>
                <FaSlidersH />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white text-indigo-600 rounded-full text-sm font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel - /}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="border-t border-gray-200 pt-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Subject Filter */}
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">
                        <MdSubject className="inline mr-2 text-indigo-600 text-xl" />
                        Subject
                      </label>
                      <select
                        className="w-full px-4 py-3 text-gray-900 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none bg-white"
                        value={filters.subject}
                        onChange={(e) =>
                          setFilters({ ...filters, subject: e.target.value })
                        }
                        style={{ color: "#111827" }}>
                        <option value="" className="text-gray-900">
                          All Subjects
                        </option>
                        {subjects
                          .filter((s) => s !== "All Subjects")
                          .map((subject) => (
                            <option
                              key={subject}
                              value={subject}
                              className="text-gray-900">
                              {subject}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Class Filter */}
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">
                        <FaGraduationCap className="inline mr-2 text-indigo-600 text-xl" />
                        Class/Grade
                      </label>
                      <select
                        className="w-full px-4 py-3 text-gray-900 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none bg-white"
                        value={filters.class}
                        onChange={(e) =>
                          setFilters({ ...filters, class: e.target.value })
                        }
                        style={{ color: "#111827" }}>
                        <option value="" className="text-gray-900">
                          All Classes
                        </option>
                        {classes
                          .filter((c) => c !== "All Classes")
                          .map((cls) => (
                            <option
                              key={cls}
                              value={cls}
                              className="text-gray-900">
                              {cls}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">
                        <MdLocationOn className="inline mr-2 text-indigo-600 text-xl" />
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Dhaka, Chittagong"
                        className="w-full px-4 py-3 text-gray-900 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none bg-white placeholder-gray-500"
                        value={filters.location}
                        onChange={(e) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                        style={{ color: "#111827" }}
                      />
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2 text-base font-medium border-2 border-red-200">
                      <FaTimes />
                      Clear All Filters ({activeFilterCount})
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-700 font-medium">
                Active filters:
              </span>
              {searchTerm && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-indigo-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
              {filters.subject && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
                  Subject: {filters.subject}
                  <button
                    onClick={() => setFilters({ ...filters, subject: "" })}
                    className="ml-1 hover:text-indigo-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
              {filters.class && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
                  Class: {filters.class}
                  <button
                    onClick={() => setFilters({ ...filters, class: "" })}
                    className="ml-1 hover:text-indigo-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
                  Location: {filters.location}
                  <button
                    onClick={() => setFilters({ ...filters, location: "" })}
                    className="ml-1 hover:text-indigo-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-700 text-lg font-medium">
          Showing {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, filteredTuitions.length)} of{" "}
          {filteredTuitions.length} tuitions
        </div>

        {/* Tuitions Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBook className="text-indigo-600 text-2xl animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredTuitions.length === 0 ? (
          <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
            <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Tuitions Found
            </h3>
            <p className="text-gray-700 text-lg mb-6">
              {activeFilterCount > 0
                ? "No tuitions match your search criteria. Try adjusting your filters."
                : "No tuitions have been posted yet."}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((tuition, index) => (
                <motion.div
                  key={tuition._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {tuition.subject}
                        </h3>
                        <p className="text-gray-700 flex items-center gap-1 font-medium">
                          <FaGraduationCap className="text-indigo-500" />
                          {tuition.class}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusBadge(tuition.status)}`}>
                        {getStatusIcon(tuition.status)}
                        <span className="font-semibold">
                          {tuition.status?.charAt(0).toUpperCase() +
                            tuition.status?.slice(1)}
                        </span>
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaMapMarkerAlt className="text-red-500 text-lg" />
                        <span className="font-medium">{tuition.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <FaMoneyBillWave className="text-green-600 text-lg" />
                        <span className="font-semibold text-green-600 text-lg">
                          ৳{tuition.budget}/month
                        </span>
                      </div>

                      {tuition.daysPerWeek && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaClock className="text-purple-500 text-lg" />
                          <span className="font-medium">
                            {tuition.daysPerWeek} days/week
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-500 text-base">
                        <FaCalendarAlt />
                        <span>
                          {new Date(tuition.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link to={`/tuition/${tuition._id}`}>
                      <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                        <FaEye />
                        View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 text-lg font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md border-2 border-gray-200"
                  }`}>
                  <FaArrowLeft /> Previous
                </button>

                <span className="text-gray-800 text-lg font-bold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 text-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md border-2 border-gray-200"
                  }`}>
                  Next <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TuitionsListing;
