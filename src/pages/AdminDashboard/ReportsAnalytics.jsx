
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaMoneyBillWave,
  FaDownload,
  FaCalendarAlt,
  FaBook,
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <FaChartBar className="text-green-600" />
          Reports & Analytics
        </h1>
        <p className="text-gray-700 text-lg mt-2 font-medium">
          View platform earnings, transaction history, and financial reports
        </p>
      </div>

      {/* Stats Cards - Fixed Visibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaWallet className="text-blue-600 text-xl" />
            </div>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Total Earnings
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-2">
            ৳{stats.totalEarnings.toLocaleString()}
          </h3>
          <p className="text-base font-medium text-gray-600">
            Lifetime revenue
          </p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              From {stats.totalTransactions} transactions
            </p>
          </div>
        </motion.div>

        {/* This Month Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-2">
            ৳{stats.thisMonth.toLocaleString()}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {stats.growth > 0 ? (
              <FaArrowUp className="text-green-500 text-lg" />
            ) : (
              <FaArrowDown className="text-red-500 text-lg" />
            )}
            <span
              className={`text-base font-bold ${
                stats.growth > 0 ? "text-green-700" : "text-red-700"
              }`}>
              {Math.abs(stats.growth).toFixed(1)}% from last month
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Last month: ৳{stats.lastMonth.toLocaleString()}
          </p>
        </motion.div>

        {/* Transactions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaBook className="text-purple-600 text-xl" />
            </div>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Transactions
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-2">
            {stats.totalTransactions}
          </h3>
          <p className="text-base font-medium text-gray-600">Total payments</p>
          <p className="text-sm text-gray-500 mt-3">
            Avg: ৳{stats.averagePerTransaction.toFixed(0)} per transaction
          </p>
        </motion.div>

        {/* Average Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="text-yellow-600 text-xl" />
            </div>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Average
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-2">
            ৳{stats.averagePerTransaction.toFixed(0)}
          </h3>
          <p className="text-base font-medium text-gray-600">Per transaction</p>
          <p className="text-sm text-gray-500 mt-3">
            Based on {stats.totalTransactions} payments
          </p>
        </motion.div>
      </div>

      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={downloadReport}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-base">
          <FaDownload className="text-lg" />
          Download Report (CSV)
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h2>
          <p className="text-gray-600 text-base mt-1">
            All payment transactions on the platform
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <FaMoneyBillWave className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Transactions Found
            </h3>
            <p className="text-gray-600 text-base">
              No payment transactions have been recorded yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Tuition
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payments.map((payment, index) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        {payment.transactionId?.substring(0, 12)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {payment.studentName || "Student"}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {payment.studentEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {payment.tutorEmail?.split("@")[0] || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {payment.tuitionSubject || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-green-700 text-lg">
                        ৳{payment.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          payment.status === "completed"
                            ? "bg-green-200 text-green-800 border border-green-300"
                            : "bg-yellow-200 text-yellow-800 border border-yellow-300"
                        }`}>
                        {payment.status?.toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {payments.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Revenue
              </p>
              <p className="text-3xl font-extrabold text-green-700">
                ৳{stats.totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Transactions
              </p>
              <p className="text-3xl font-extrabold text-blue-700">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Average Transaction
              </p>
              <p className="text-3xl font-extrabold text-purple-700">
                ৳{stats.averagePerTransaction.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
