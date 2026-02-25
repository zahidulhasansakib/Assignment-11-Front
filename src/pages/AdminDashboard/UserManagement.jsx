
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FaUsers className="text-purple-600" />
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all users - Update roles, status, or delete accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-lg p-4">
          <p className="text-purple-600 text-sm">Admin</p>
          <p className="text-2xl font-bold text-purple-700">{stats.admin}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-lg p-4">
          <p className="text-green-600 text-sm">Tutor</p>
          <p className="text-2xl font-bold text-green-700">{stats.tutor}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-lg p-4">
          <p className="text-blue-600 text-sm">Student</p>
          <p className="text-2xl font-bold text-blue-700">{stats.student}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-lg p-4">
          <p className="text-green-600 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-lg p-4">
          <p className="text-red-600 text-sm">Blocked</p>
          <p className="text-2xl font-bold text-red-700">{stats.blocked}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <select
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="tutor">Tutor</option>
            <option value="student">Student</option>
            <option value="donor">Donor</option>
          </select>

          <select
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            user.name?.charAt(0) || user.email?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FaPhone className="text-gray-400" size={12} />
                          {user.phone}
                        </div>
                      )}
                      {user.districtName && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <FaMapMarkerAlt className="text-gray-400" size={12} />
                          {user.districtName}, {user.upazilaName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 w-fit ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role?.charAt(0).toUpperCase() +
                          user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <FaUsers className="text-gray-400 text-6xl mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedUser.email || ""}
                      disabled
                      className="w-full p-3 bg-gray-100 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                      <option value="donor">Donor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {updating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        Update
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FaTrash className="text-red-600 text-2xl" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">
                  Delete User?
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Are you sure you want to delete{" "}
                  {selectedUser.name || selectedUser.email}? This action cannot
                  be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {updating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
