
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaChalkboardTeacher,
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
  FaHeart,
  FaShare,
  FaUserGraduate,
  FaCertificate,
  FaLanguage,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const TutorProfile = () => {
  const { id } = useParams();
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    console.log("🔍 Tutor ID from URL:", id);
    if (id && id !== ":id") {
      fetchTutorDetails();
    } else {
      setError("Invalid tutor ID");
      setLoading(false);
    }
  }, [id]);

  const fetchTutorDetails = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching tutor with ID:", id);

      // First, get all users and find by _id
      const response = await axios.get("/users");
      console.log("📡 All users response:", response.data);

      // Find the user with matching _id
      const allUsers = response.data || [];
      const foundTutor = allUsers.find((user) => user._id === id);

      console.log("✅ Found tutor:", foundTutor);

      if (foundTutor) {
        setTutor(foundTutor);
      } else {
        setError("Tutor not found");
        toast.error("Tutor not found");
      }
    } catch (error) {
      console.error("❌ Error fetching tutor:", error);
      setError("Failed to load tutor profile");
      toast.error("Failed to load tutor profile");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xl" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400 text-xl" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xl" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaChalkboardTeacher className="text-indigo-600 text-2xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-indigo-600 text-lg font-medium">
            Loading tutor profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-4xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tutor Not Found
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {error || "The tutor you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/tutors")}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all">
              Browse All Tutors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-gray-700 text-base">
            <FaArrowLeft className="text-indigo-600 text-lg" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
              <FaHeart
                className={`text-xl ${isSaved ? "text-red-500" : "text-gray-400"}`}
              />
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 text-white mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl font-bold border-4 border-white/30 shadow-xl">
              {tutor.photoURL ? (
                <img
                  src={tutor.photoURL}
                  alt={tutor.name}
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                tutor.name?.charAt(0) || tutor.email?.charAt(0)
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {tutor.name || "Tutor"}
              </h1>
              <p className="text-xl text-indigo-100 flex items-center justify-center md:justify-start gap-2 mb-4">
                <FaEnvelope />
                {tutor.email}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex gap-1">
                  {renderStars(tutor.rating || 4.8)}
                </div>
                <span className="text-indigo-100 text-lg">
                  ({tutor.reviews || 128} reviews)
                </span>
              </div>

              {/* Status */}
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium ${
                  tutor.status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                {tutor.status === "active" && <FaCheckCircle />}
                {tutor.status === "active"
                  ? "Available for Tuition"
                  : "Currently Unavailable"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Quick Info
              </h3>

              <div className="space-y-4">
                {tutor.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <FaPhone className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {tutor.phone}
                      </p>
                    </div>
                  </div>
                )}

                {(tutor.location || tutor.districtName) && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <MdLocationOn className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {tutor.location ||
                          `${tutor.districtName || ""} ${tutor.upazilaName || ""}`}
                      </p>
                    </div>
                  </div>
                )}

                {tutor.experience && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <FaBriefcase className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {tutor.experience} years
                      </p>
                    </div>
                  </div>
                )}

                {tutor.hourlyRate && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <FaDollarSign className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hourly Rate</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        ৳{tutor.hourlyRate}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <Link
                to={`/contact?tutor=${tutor._id}`}
                className="block w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-center">
                Contact Tutor
              </Link>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">About</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {tutor.bio ||
                  `${tutor.name || "This tutor"} is an experienced educator dedicated to helping students achieve their academic goals. With a passion for teaching and a commitment to student success, they provide personalized attention and effective learning strategies.`}
              </p>
            </div>

            {/* Qualifications */}
            {tutor.qualification && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCertificate className="text-indigo-600" />
                  Qualifications
                </h3>
                <p className="text-gray-700 text-lg">{tutor.qualification}</p>
              </div>
            )}

            {/* Subjects */}
            {tutor.subject && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBook className="text-indigo-600" />
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-lg font-medium">
                    {tutor.subject}
                  </span>
                </div>
              </div>
            )}

            {/* Availability (if available) */}
            {tutor.availability && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClock className="text-indigo-600" />
                  Availability
                </h3>
                <p className="text-gray-700 text-lg">{tutor.availability}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
