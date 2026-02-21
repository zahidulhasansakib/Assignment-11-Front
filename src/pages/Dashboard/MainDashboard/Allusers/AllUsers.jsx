// src/pages/Admin/AllUsers.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to fetch users. Are you an admin?");
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  // ================= CHANGE STATUS =================
  const handleStatusChange = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";

    try {
      const res = await axiosSecure.put("/api/update-user-status", {
        email: user.email,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) =>
            u.email === user.email ? { ...u, status: newStatus } : u
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Current Status</th>
              <th>Update Status</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  {/* User info */}
                  <td className="flex items-center gap-3">
                    <img
                      src={u.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                      alt={u.name}
                      className="w-12 h-12 rounded-full border"
                    />
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </td>

                  {/* Role */}
                  <td>
                    <span className="badge badge-info">{u.role}</span>
                  </td>

                  {/* Current Status */}
                  <td>
                    <span
                      className={`badge ${
                        u.status === "active" ? "badge-success" : "badge-error"
                      }`}>
                      {u.status}
                    </span>
                  </td>

                  {/* Update Status */}
                  <td>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleStatusChange(u)}
                        className="btn btn-sm btn-warning">
                        {u.status === "active" ? "Block" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
