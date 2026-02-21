// src/pages/TutorDashboard/RevenueHistory.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaDownload,
  FaCalendarAlt,
  FaBook,
  FaCheckCircle,
  FaWallet,
} from "react-icons/fa";

const RevenueHistory = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchRevenue();
  }, [user]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/tutor-revenue?tutorEmail=${user?.email}`,
      );
      const data = response.data.data || [];
      setPayments(data);

      // Calculate stats
      const total = data.reduce((sum, p) => sum + (p.amount || 0), 0);
      const thisMonthTotal = data
        .filter((p) => {
          const date = new Date(p.paymentDate);
          const now = new Date();
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalEarnings: total,
        thisMonth: thisMonthTotal,
        completed: data.filter((p) => p.status === "completed").length,
        pending: data.filter((p) => p.status === "pending").length,
      });
    } catch (error) {
      console.error("Error fetching revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FaMoneyBillWave className="text-purple-600" />
          Revenue History
        </h1>
        <p className="text-gray-600 mt-2">
          Track your earnings and payment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <h3 className="text-3xl font-bold text-gray-800">
                ৳{stats.totalEarnings}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaWallet className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">This Month</p>
              <h3 className="text-3xl font-bold text-gray-800">
                ৳{stats.thisMonth}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.completed}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaCheckCircle className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.pending}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaMoneyBillWave className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <FaMoneyBillWave className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-gray-500">
              Your earnings will appear here once you start teaching
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tuition
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {payment.tuitionSubject}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.tuitionClass}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.studentName || payment.studentEmail}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        ৳{payment.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {payment.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueHistory;
