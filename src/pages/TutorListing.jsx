import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaChalkboardTeacher,
  FaSearch,
  FaFilter,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaBook,
  FaCheckCircle,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaUserGraduate,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";

const TutorListing = () => {
  const axios = useAxiosSecure();
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    minExperience: "",
    maxExperience: "",
    rating: "",
  });

  // Subjects for filter
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
    "Statistics",
    "General Science",
  ];

  useEffect(() => {
    fetchTutors();
  }, []);

  // Fetch all users with tutor role
  const fetchTutors = async () => {
    try {
      setLoading(true);
      // Get all users and filter by role
      const response = await axios.get("/users");
      console.log("All users:", response.data);

      // Filter users with role 'tutor'
      const tutorList = response.data.filter((user) => user.role === "tutor");
      console.log("Tutors found:", tutorList);

      setTutors(tutorList);
      setFilteredTutors(tutorList);

      toast.success(`${tutorList.length} tutors found`);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...tutors];

    // Search by name, email, or subject
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tutor) =>
          tutor.name?.toLowerCase().includes(term) ||
          tutor.email?.toLowerCase().includes(term) ||
          tutor.subject?.toLowerCase().includes(term) ||
          tutor.location?.toLowerCase().includes(term),
      );
    }

    // Apply filters
    if (filters.subject && filters.subject !== "All Subjects") {
      filtered = filtered.filter(
        (tutor) =>
          tutor.subject === filters.subject ||
          tutor.subjects?.includes(filters.subject),
      );
    }

    if (filters.location) {
      filtered = filtered.filter(
        (tutor) =>
          tutor.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase()) ||
          tutor.districtName
            ?.toLowerCase()
            .includes(filters.location.toLowerCase()),
      );
    }

    if (filters.minExperience) {
      filtered = filtered.filter(
        (tutor) =>
          parseInt(tutor.experience) >= parseInt(filters.minExperience),
      );
    }

    if (filters.maxExperience) {
      filtered = filtered.filter(
        (tutor) =>
          parseInt(tutor.experience) <= parseInt(filters.maxExperience),
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (tutor) => tutor.rating >= parseFloat(filters.rating),
      );
    }

    setFilteredTutors(filtered);
    setCurrentPage(1);
  }, [tutors, searchTerm, filters]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      subject: "",
      location: "",
      minExperience: "",
      maxExperience: "",
      rating: "",
    });
  };

  // Generate star rating
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-lg" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400 text-lg" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-lg" />);
      }
    }
    return stars;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTutors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-xl text-gray-600">
            Browse through {filteredTutors.length} qualified tutors
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by name, subject, or location..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-lg font-medium ${
                showFilters
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                    value={filters.subject}
                    onChange={(e) =>
                      setFilters({ ...filters, subject: e.target.value })
                    }>
                    <option value="">All Subjects</option>
                    {subjects
                      .filter((s) => s !== "All Subjects")
                      .map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dhaka"
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>

                {/* Min Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Experience
                  </label>
                  <input
                    type="number"
                    placeholder="Years"
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                    value={filters.minExperience}
                    onChange={(e) =>
                      setFilters({ ...filters, minExperience: e.target.value })
                    }
                  />
                </div>

                {/* Max Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Experience
                  </label>
                  <input
                    type="number"
                    placeholder="Years"
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                    value={filters.maxExperience}
                    onChange={(e) =>
                      setFilters({ ...filters, maxExperience: e.target.value })
                    }
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({ ...filters, rating: e.target.value })
                    }>
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2 text-base font-medium">
                  <FaTimes />
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 text-lg">
          Showing {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, filteredTutors.length)} of{" "}
          {filteredTutors.length} tutors
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaChalkboardTeacher className="text-indigo-600 text-2xl animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
            <FaChalkboardTeacher className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Tutors Found
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm || filters.subject || filters.location
                ? "No tutors match your search criteria. Try adjusting your filters."
                : "No tutors have registered yet."}
            </p>
            {(searchTerm || filters.subject || filters.location) && (
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
              {currentItems.map((tutor, index) => (
                <motion.div
                  key={tutor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Tutor Card Header with Gradient */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                      {/* Profile Image */}
                      <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                        {tutor.photoURL ? (
                          <img
                            src={tutor.photoURL}
                            alt={tutor.name}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          tutor.name?.charAt(0) || tutor.email?.charAt(0)
                        )}
                      </div>

                      {/* Basic Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">
                          {tutor.name || "Tutor"}
                        </h3>
                        <p className="text-indigo-100 flex items-center gap-1 text-sm">
                          <FaEnvelope className="text-sm" />
                          {tutor.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tutor Details */}
                  <div className="p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {renderStars(tutor.rating || 4.5)}
                      </div>
                      <span className="text-gray-600 text-sm">
                        ({tutor.reviews || 0} reviews)
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-3 mb-6">
                      {tutor.subject && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaBook className="text-indigo-500 text-lg" />
                          <span className="font-medium">Specialty:</span>
                          <span className="text-gray-900">{tutor.subject}</span>
                        </div>
                      )}

                      {tutor.experience && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaBriefcase className="text-indigo-500 text-lg" />
                          <span className="font-medium">Experience:</span>
                          <span className="text-gray-900">
                            {tutor.experience} years
                          </span>
                        </div>
                      )}

                      {tutor.qualification && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaGraduationCap className="text-indigo-500 text-lg" />
                          <span className="font-medium">Qualification:</span>
                          <span className="text-gray-900">
                            {tutor.qualification}
                          </span>
                        </div>
                      )}

                      {(tutor.location || tutor.districtName) && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <MdLocationOn className="text-indigo-500 text-lg" />
                          <span className="font-medium">Location:</span>
                          <span className="text-gray-900">
                            {tutor.location ||
                              `${tutor.districtName}, ${tutor.upazilaName}`}
                          </span>
                        </div>
                      )}

                      {tutor.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaPhone className="text-indigo-500 text-lg" />
                          <span className="font-medium">Phone:</span>
                          <span className="text-gray-900">{tutor.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <Link to={`/tutor/${tutor._id}`}>
                      <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                        View Full Profile
                      </button>
                    </Link>

                    {/* Status Badge */}
                    <div className="mt-3 flex justify-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          tutor.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                        {tutor.status === "active" && (
                          <FaCheckCircle className="text-xs" />
                        )}
                        {tutor.status === "active"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
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
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}>
                  <FaArrowLeft /> Previous
                </button>

                <span className="text-gray-700 text-lg font-medium">
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
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
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

export default TutorListing;
