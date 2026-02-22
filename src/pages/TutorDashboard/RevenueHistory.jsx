
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
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaFilter,
  FaClock,
  FaBan,
} from "react-icons/fa";
import { MdOutlinePayment, MdOutlineTrendingUp } from "react-icons/md";
import { RiCoinsFill, RiMedalFill } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";

const RevenueHistory = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0,
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

  const getFilteredPayments = () => {
    let filtered = [...payments];
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.tuitionSubject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.studentName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }
    return filtered;
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      failed: "bg-rose-100 text-rose-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <FaCheckCircle className="text-emerald-500 text-xs" />,
      pending: <FaClock className="text-amber-500 text-xs" />,
      failed: <FaBan className="text-rose-500 text-xs" />,
    };
    return icons[status] || null;
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredPayments = getFilteredPayments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GiMoneyStack className="text-indigo-600" />
              Revenue
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track your earnings</p>
          </div>
          <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow transition-all">
            <FaDownload className="text-gray-600" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Total",
              value: formatCurrency(stats.totalEarnings),
              icon: GiMoneyStack,
              color: "bg-indigo-500",
            },
            {
              label: "This Month",
              value: formatCurrency(stats.thisMonth),
              icon: MdOutlineTrendingUp,
              color: "bg-emerald-500",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: FaCheckCircle,
              color: "bg-blue-500",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: FaClock,
              color: "bg-amber-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <stat.icon
                    className={`text-sm ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
                <span className="text-xs text-gray-400">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg transition-colors ${
                showFilters
                  ? "bg-indigo-50 border-indigo-200"
                  : "border-gray-200 hover:bg-gray-50"
              }`}>
              <FaFilter
                className={`text-sm ${showFilters ? "text-indigo-600" : "text-gray-600"}`}
              />
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPayments.slice(0, 5).map((payment, index) => (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <FaBook className="text-indigo-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {payment.tuitionSubject}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {payment.tuitionClass}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(payment.paymentDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">
                        {formatCurrency(payment.amount)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 ${getStatusBadge(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredPayments.length > 5 && (
            <div className="p-4 border-t border-gray-100 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All ({filteredPayments.length})
              </button>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RiMedalFill className="text-yellow-300 text-xl" />
              <div>
                <p className="text-white/80 text-xs">Success Rate</p>
                <p className="text-sm font-bold">
                  {stats.totalEarnings > 0
                    ? Math.round((stats.completed / payments.length) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex items-center gap-3">
              <RiCoinsFill className="text-yellow-300 text-xl" />
              <div>
                <p className="text-white/80 text-xs">Avg. per Month</p>
                <p className="text-sm font-bold">
                  {formatCurrency(stats.totalEarnings / 12)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueHistory;
