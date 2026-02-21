// src/pages/dashboard/AdminDashboard/ReportsAnalytics.jsx
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaMoneyBillWave,
  FaDownload,
  FaCalendarAlt,
  FaUsers,
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ReportsAnalytics = () => {
  const axios = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
    thisMonth: 0,
    lastMonth: 0,
    growth: 0,
    averagePerTransaction: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/all-payments");
      console.log("Payments:", response.data);

      const paymentsData = response.data.data || response.data || [];
      setPayments(paymentsData);

      calculateStats(paymentsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsData) => {
    const totalEarnings = paymentsData.reduce(
      (sum, p) => sum + (p.amount || 0),
      0,
    );
    const totalTransactions = paymentsData.length;
    const avgPerTransaction =
      totalTransactions > 0 ? totalEarnings / totalTransactions : 0;

    // This month vs last month
    const now = new Date();
    const thisMonth = paymentsData
      .filter((p) => {
        const date = new Date(p.paymentDate);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const lastMonth = paymentsData
      .filter((p) => {
        const date = new Date(p.paymentDate);
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(now.getMonth() - 1);
        return (
          date.getMonth() === lastMonthDate.getMonth() &&
          date.getFullYear() === lastMonthDate.getFullYear()
        );
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const growth =
      lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    setStats({
      totalEarnings,
      totalTransactions,
      thisMonth,
      lastMonth,
      growth,
      averagePerTransaction: avgPerTransaction,
    });
  };

  // Download report as CSV
  const downloadReport = () => {
    const headers = [
      "Date",
      "Transaction ID",
      "Student",
      "Tutor",
      "Tuition",
      "Amount",
      "Status",
    ];
    const csvData = payments.map((p) => [
      new Date(p.paymentDate).toLocaleDateString(),
      p.transactionId,
      p.studentEmail,
      p.tutorEmail || "N/A",
      p.tuitionSubject || "N/A",
      p.amount,
      p.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FaChartBar className="text-green-600" />
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          View platform earnings, transaction history, and financial reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaWallet className="text-blue-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Total Earnings</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            ৳{stats.totalEarnings.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500 mt-2">Lifetime revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            ৳{stats.thisMonth.toLocaleString()}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {stats.growth > 0 ? (
              <FaArrowUp className="text-green-500" />
            ) : (
              <FaArrowDown className="text-red-500" />
            )}
            <span
              className={`text-sm ${stats.growth > 0 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(stats.growth).toFixed(1)}% from last month
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaBook className="text-purple-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Transactions</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            {stats.totalTransactions}
          </h3>
          <p className="text-sm text-gray-500 mt-2">Total payments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="text-yellow-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Average</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            ৳{stats.averagePerTransaction.toFixed(0)}
          </h3>
          <p className="text-sm text-gray-500 mt-2">Per transaction</p>
        </motion.div>
      </div>

      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={downloadReport}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
          <FaDownload />
          Download Report (CSV)
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
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
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tutor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tuition
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
                      <span className="font-mono text-sm">
                        {payment.transactionId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {payment.studentName || payment.studentEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.studentEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{payment.tutorEmail || "N/A"}</td>
                    <td className="px-6 py-4">
                      {payment.tuitionSubject || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        ৳{payment.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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

        {payments.length === 0 && !loading && (
          <div className="text-center py-16">
            <FaMoneyBillWave className="text-gray-400 text-6xl mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;
