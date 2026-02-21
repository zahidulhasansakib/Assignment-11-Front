import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaSearch,
  FaFileInvoice,
  FaWallet,
  FaArrowLeft,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const Payments = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch payments
  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/payments?studentEmail=${user?.email}`);
      console.log("Payments:", response.data);

      // Handle different response structures
      const paymentData = response.data.data || response.data || [];
      setPayments(paymentData);
      setFilteredPayments(paymentData);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  // Filter payments
  useEffect(() => {
    let filtered = [...payments];

    // Filter by search term (tuition subject or transaction ID)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.tuitionSubject?.toLowerCase().includes(term) ||
          p.transactionId?.toLowerCase().includes(term) ||
          p.paymentMethod?.toLowerCase().includes(term),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(
            (p) => new Date(p.paymentDate) >= filterDate,
          );
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(
            (p) => new Date(p.paymentDate) >= filterDate,
          );
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(
            (p) => new Date(p.paymentDate) >= filterDate,
          );
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(
            (p) => new Date(p.paymentDate) >= filterDate,
          );
          break;
      }
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [payments, searchTerm, statusFilter, dateFilter]);

  // Calculate stats
  const stats = {
    total: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
    thisMonth: payments
      .filter((p) => {
        const now = new Date();
        const paymentDate = new Date(p.paymentDate);
        return (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800 border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      failed: "bg-red-100 text-red-800 border-red-300",
      refunded: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      completed: <FaCheckCircle className="text-green-500" />,
      pending: <FaClock className="text-yellow-500" />,
      failed: <FaTimesCircle className="text-red-500" />,
      refunded: <FaMoneyBillWave className="text-purple-500" />,
    };
    return icons[status] || null;
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const icons = {
      bkash: "📱",
      nagad: "📲",
      rocket: "🚀",
      card: "💳",
      bank: "🏦",
      cash: "💰",
    };
    return icons[method?.toLowerCase()] || "💳";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Download invoice
  const downloadInvoice = (payment) => {
    // Create invoice content
    const invoiceContent = `
      TUITION PAYMENT INVOICE
      =======================
      
      Invoice #: INV-${payment.transactionId}
      Date: ${formatDate(payment.paymentDate)}
      
      Student Information:
      -------------------
      Name: ${user?.displayName || "N/A"}
      Email: ${user?.email}
      
      Payment Details:
      ---------------
      Amount: ${formatCurrency(payment.amount)}
      Transaction ID: ${payment.transactionId}
      Payment Method: ${payment.paymentMethod || "N/A"}
      Status: ${payment.status}
      
      Tuition Details:
      ----------------
      Subject: ${payment.tuitionSubject || "N/A"}
      Class: ${payment.tuitionClass || "N/A"}
      Month: ${payment.month || "N/A"}
      
      Thank you for your payment!
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${payment.transactionId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Invoice downloaded successfully!");
  };

  // Print invoice
  const printInvoice = (payment) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Invoice - ${payment.transactionId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .invoice { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { font-size: 24px; font-weight: bold; color: #333; }
            .info { margin-bottom: 30px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; }
            .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div class="title">TUITION PAYMENT INVOICE</div>
              <p>Invoice #: INV-${payment.transactionId}</p>
              <p>Date: ${formatDate(payment.paymentDate)}</p>
            </div>
            
            <div class="grid">
              <div class="section">
                <div class="section-title">Student Information</div>
                <p><strong>Name:</strong> ${user?.displayName || "N/A"}</p>
                <p><strong>Email:</strong> ${user?.email}</p>
              </div>
              
              <div class="section">
                <div class="section-title">Payment Information</div>
                <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                <p><strong>Method:</strong> ${payment.paymentMethod || "N/A"}</p>
                <p><strong>Status:</strong> ${payment.status}</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Payment Details</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Month</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tuition Fee</td>
                    <td>${payment.tuitionSubject || "N/A"}</td>
                    <td>${payment.tuitionClass || "N/A"}</td>
                    <td>${payment.month || "N/A"}</td>
                    <td>${formatCurrency(payment.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="total">
              Total: ${formatCurrency(payment.amount)}
            </div>
            
            <p style="text-align: center; margin-top: 50px; color: #666;">
              Thank you for your payment!
            </p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <MdPayment className="text-green-600" />
              Payment History
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all your tuition payments
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Payments</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaMoneyBillWave className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  ৳{stats.totalAmount.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaWallet className="text-green-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  ৳{stats.thisMonth.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaCalendarAlt className="text-purple-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.completed}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaCheckCircle className="text-yellow-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject, transaction ID..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Date Filter */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Payments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FaMoneyBillWave className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Payments Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "No payments match your filters"
                : "You haven't made any payments yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
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
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((payment, index) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.paymentDate).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">
                          {payment.transactionId?.slice(0, 12)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.tuitionSubject || "Tuition Fee"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.tuitionClass || "N/A"} •{" "}
                          {payment.month || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                          </span>
                          <span className="text-sm capitalize">
                            {payment.paymentMethod || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-600">
                          ৳{payment.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusBadge(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status?.charAt(0).toUpperCase() +
                            payment.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowInvoice(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details">
                            <FaEye />
                          </button>
                          <button
                            onClick={() => downloadInvoice(payment)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Invoice">
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => printInvoice(payment)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Print Invoice">
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentItems.map((payment) => (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                      <p className="font-semibold mt-1">
                        {payment.tuitionSubject || "Tuition Fee"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusBadge(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="text-sm font-mono">
                        {payment.transactionId?.slice(0, 8)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Method</p>
                      <p className="text-sm capitalize">
                        {payment.paymentMethod || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm">{payment.tuitionClass || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Month</p>
                      <p className="text-sm">{payment.month || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold text-green-600">
                      ৳{payment.amount?.toLocaleString()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowInvoice(true);
                        }}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                        <FaEye />
                      </button>
                      <button
                        onClick={() => downloadInvoice(payment)}
                        className="p-2 text-green-600 bg-green-50 rounded-lg">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  <FaArrowLeft />
                </button>

                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Invoice Modal */}
      {showInvoice && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Invoice Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  PAYMENT INVOICE
                </h2>
                <p className="text-gray-500">
                  Invoice #: INV-{selectedPayment.transactionId}
                </p>
                <p className="text-gray-500">
                  Date: {formatDate(selectedPayment.paymentDate)}
                </p>
              </div>

              {/* Company Info */}
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Student Dashboard</h3>
                    <p className="text-gray-600">
                      education@studentdashboard.com
                    </p>
                    <p className="text-gray-600">+880 1XXXXXXXXX</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        selectedPayment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedPayment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                      {selectedPayment.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold mb-2">Bill To:</h4>
                  <p className="text-gray-700">
                    {user?.displayName || "Student"}
                  </p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Info:</h4>
                  <p className="text-gray-600">
                    Transaction ID: {selectedPayment.transactionId}
                  </p>
                  <p className="text-gray-600">
                    Method: {selectedPayment.paymentMethod || "N/A"}
                  </p>
                </div>
              </div>

              {/* Invoice Items */}
              <table className="w-full mb-8">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Class</th>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Tuition Fee</td>
                    <td className="px-4 py-3">
                      {selectedPayment.tuitionSubject || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {selectedPayment.tuitionClass || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {selectedPayment.month || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ৳{selectedPayment.amount?.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Subtotal:</span>
                    <span>৳{selectedPayment.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-b font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ৳{selectedPayment.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm border-t pt-8">
                <p>Thank you for your payment!</p>
                <p className="mt-2">
                  For any queries, contact support@studentdashboard.com
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowInvoice(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Close
                </button>
                <button
                  onClick={() => downloadInvoice(selectedPayment)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={() => printInvoice(selectedPayment)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <FaPrint />
                  Print
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Payments;
