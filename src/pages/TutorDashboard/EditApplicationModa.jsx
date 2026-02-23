
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaSave } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const EditApplicationModal = ({ isOpen, onClose, application, onSuccess }) => {
  const axios = useAxiosSecure();
  const [formData, setFormData] = useState({
    qualification: "",
    experience: "",
    proposedFee: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        qualification: application.qualification || "",
        experience: application.experience || "",
        proposedFee: application.proposedFee || "",
        message: application.message || "",
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.put(
        `/tutor-applications/${application._id}`,
        formData,
      );

      if (response.data.success) {
        onSuccess({ ...application, ...formData });
        toast.success("Application updated successfully!");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Application</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Qualifications *
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., B.Sc in Mathematics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Experience *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3 years"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Expected Salary (৳) *
            </label>
            <input
              type="number"
              name="proposedFee"
              value={formData.proposedFee}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="5000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message to Student
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tell the student why you're the best candidate..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditApplicationModal;
