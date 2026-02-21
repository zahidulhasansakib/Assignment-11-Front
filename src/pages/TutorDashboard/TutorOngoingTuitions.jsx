// src/pages/TutorDashboard/TutorOngoingTuitions.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import {
  FaBook,
  FaCheckCircle,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaStar,
} from "react-icons/fa";

const TutorOngoingTuitions = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FaCheckCircle className="text-green-600" />
          Ongoing Tuitions
        </h1>
        <p className="text-gray-600 mt-2">
          Tuitions that have been approved by students
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        </div>
      ) : tuitions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Ongoing Tuitions
          </h3>
          <p className="text-gray-500">
            You don't have any approved tuitions yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tuitions.map((tuition) => (
            <motion.div
              key={tuition._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {tuition.subject}
                    </h3>
                    <p className="text-gray-600">{tuition.class}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Ongoing
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="font-semibold">{tuition.studentName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Monthly Fee</p>
                    <p className="font-semibold text-green-600">
                      ৳{tuition.budget}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold">{tuition.location}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Schedule</p>
                    <p className="font-semibold">
                      {tuition.daysPerWeek} days/week
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Time Slot</p>
                      <p className="font-medium">
                        {tuition.timeSlot || "To be decided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Started From</p>
                      <p className="font-medium">
                        {new Date(
                          tuition.approvedAt || tuition.updatedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorOngoingTuitions;
