import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaEdit,
  FaTrash,
  FaUserCog,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBan,
  FaCheck,
  FaTimes,
  FaEye,
  FaUserCircle,
  FaIdCard,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const UserManagement = () => {
  const axios = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users");
      console.log("Users:", response.data);
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term),
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Handle Edit User
  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setShowEditModal(true);
  };

  // Handle Update User
  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      const response = await axios.put(`/users/${selectedUser.email}`, {
        name: selectedUser.name,
        role: selectedUser.role,
        status: selectedUser.status,
        phone: selectedUser.phone,
      });

      if (response.data.success) {
        toast.success("User updated successfully!");
        fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete User
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      const response = await axios.delete(`/users/${selectedUser.email}`);

      if (response.data.success) {
        toast.success("User deleted successfully!");
        fetchUsers();
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setUpdating(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";

    try {
      const response = await axios.put(`/users/${user.email}`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(
          `User ${newStatus === "active" ? "activated" : "blocked"} successfully!`,
        );
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-800 border-purple-300",
      tutor: "bg-green-100 text-green-800 border-green-300",
      student: "bg-blue-100 text-blue-800 border-blue-300",
      donor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };
    return styles[role] || "bg-gray-100 text-gray-800";
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      blocked: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Get role icon
  const getRoleIcon = (role) => {
    const icons = {
      admin: <FaUserTie className="text-purple-600" />,
      tutor: <FaChalkboardTeacher className="text-green-600" />,
      student: <FaUserGraduate className="text-blue-600" />,
      donor: <FaUsers className="text-yellow-600" />,
    };
    return icons[role] || <FaUsers />;
  };

  // Stats
  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    tutor: users.filter((u) => u.role === "tutor").length,
    student: users.filter((u) => u.role === "student").length,
    active: users.filter((u) => u.status === "active").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-2 sm:p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-purple-600 text-lg sm:text-xl md:text-2xl lg:text-3xl" />
              <span>User Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage all users - Update roles, status, or delete accounts
            </p>
          </div>

          {/* View Toggle - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "card"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Card View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-gray-500 truncate">Total</p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">
            {stats.total}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-purple-600 truncate">
            Admin
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-purple-700">
            {stats.admin}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-green-600 truncate">
            Tutor
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-green-700">
            {stats.tutor}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-blue-600 truncate">
            Student
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-700">
            {stats.student}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-green-600 truncate">
            Active
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-green-700">
            {stats.active}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-red-600 truncate">
            Blocked
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-red-700">
            {stats.blocked}
          </p>
        </div>
      </div>

      {/* Filters - Responsive with fixed text visibility */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 placeholder:text-gray-500 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              className="flex-1 sm:flex-none px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all" className="text-gray-900 bg-white">
                All Roles
              </option>
              <option value="admin" className="text-gray-900 bg-white">
                Admin
              </option>
              <option value="tutor" className="text-gray-900 bg-white">
                Tutor
              </option>
              <option value="student" className="text-gray-900 bg-white">
                Student
              </option>
            </select>

            <select
              className="flex-1 sm:flex-none px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all" className="text-gray-900 bg-white">
                All Status
              </option>
              <option value="active" className="text-gray-900 bg-white">
                Active
              </option>
              <option value="blocked" className="text-gray-900 bg-white">
                Blocked
              </option>
              <option value="inactive" className="text-gray-900 bg-white">
                Inactive
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Display */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Mobile Card View (always on mobile) */}
          <div className="block md:hidden space-y-2">
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header - Always Visible */}
                <div
                  className="p-3 flex items-start justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedUser(expandedUser === user._id ? null : user._id)
                  }>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() ||
                        user.email?.charAt(0)?.toUpperCase() ||
                        "U"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || "N/A"}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(user.status)}`}>
                          {user.status || "active"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${getRoleBadge(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="hidden xs:inline text-gray-900">
                        {user.role}
                      </span>
                    </span>
                    {expandedUser === user._id ? (
                      <FaChevronUp className="text-gray-500 text-xs" />
                    ) : (
                      <FaChevronDown className="text-gray-500 text-xs" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedUser === user._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 bg-gray-50">
                      <div className="p-3 space-y-2">
                        {/* Contact Info */}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-xs">
                            <FaPhone className="text-gray-500 text-xs" />
                            <span className="text-gray-700">{user.phone}</span>
                          </div>
                        )}

                        {/* Location */}
                        {user.districtName && (
                          <div className="flex items-center gap-2 text-xs">
                            <FaMapMarkerAlt className="text-gray-500 text-xs" />
                            <span className="text-gray-700">
                              {user.districtName}, {user.upazilaName}
                            </span>
                          </div>
                        )}

                        {/* Join Date */}
                        {user.createdAt && (
                          <div className="flex items-center gap-2 text-xs">
                            <FaCalendarAlt className="text-gray-500 text-xs" />
                            <span className="text-gray-700">
                              Joined:{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-1 pt-2 mt-1 border-t border-gray-200">
                          <button
                            onClick={() => handleEdit(user)}
                            className="py-2 text-blue-600 hover:bg-blue-50 rounded text-xs flex items-center justify-center gap-1 font-medium">
                            <FaEdit className="text-xs" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`py-2 rounded text-xs flex items-center justify-center gap-1 font-medium ${
                              user.status === "active"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}>
                            {user.status === "active" ? (
                              <>
                                <FaBan className="text-xs" />
                                <span>Block</span>
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="text-xs" />
                                <span>Unblock</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="py-2 text-red-600 hover:bg-red-50 rounded text-xs flex items-center justify-center gap-1 font-medium">
                            <FaTrash className="text-xs" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase() ||
                              user.email?.charAt(0)?.toUpperCase() ||
                              "U"
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {user.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-700">
                            <FaPhone className="text-gray-500" size={10} />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getRoleBadge(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="text-gray-900">{user.role}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit">
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`p-1.5 rounded ${user.status === "active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                            {user.status === "active" ? (
                              <FaBan size={14} />
                            ) : (
                              <FaCheckCircle size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
          <FaUsers className="text-gray-300 text-3xl sm:text-4xl mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-700">No users found</p>
        </div>
      )}

      {/* Edit Modal - Responsive with fixed text visibility */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Edit User
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={selectedUser.name || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-2.5 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 placeholder:text-gray-500 bg-white"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedUser.email || ""}
                      disabled
                      className="w-full p-2.5 sm:p-3 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={selectedUser.phone || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-2.5 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 placeholder:text-gray-500 bg-white"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={selectedUser.role || "student"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full p-2.5 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-900">
                      <option
                        value="student"
                        className="text-gray-900 bg-white">
                        Student
                      </option>
                      <option value="tutor" className="text-gray-900 bg-white">
                        Tutor
                      </option>
                      <option value="admin" className="text-gray-900 bg-white">
                        Admin
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedUser.status || "active"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          status: e.target.value,
                        })
                      }
                      className="w-full p-2.5 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-900">
                      <option value="active" className="text-gray-900 bg-white">
                        Active
                      </option>
                      <option
                        value="blocked"
                        className="text-gray-900 bg-white">
                        Blocked
                      </option>
                      <option
                        value="inactive"
                        className="text-gray-900 bg-white">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 font-medium">
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium">
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">Updating...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck className="text-xs" />
                        <span>Update</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal - Responsive */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <FaTrash className="text-red-600 text-lg sm:text-2xl" />
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-1 sm:mb-2">
                  Delete User?
                </h2>
                <p className="text-xs sm:text-sm text-center text-gray-700 mb-4 sm:mb-6">
                  Are you sure you want to delete{" "}
                  {selectedUser.name || selectedUser.email}?
                </p>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 font-medium">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={updating}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium">
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">Deleting...</span>
                      </>
                    ) : (
                      <>
                        <FaTrash className="text-xs" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styles  */}
      <style jsx>{`
        @media (max-width: 640px) {
          input,
          select,
          button {
            font-size: 16px !important;
            color: #111827 !important; /* text-gray-900 */
          }
          input::placeholder,
          select::placeholder {
            color: #6b7280 !important; /* text-gray-500 */
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
