// src/pages/Dashboard/MainDashboard/AddRequest/AddRequest.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";

import { toast } from "react-toastify";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AddRequest = () => {
  const { user } = useContext(AuthContext);
 
  const axiosSecure=useAxiosSecure();

  const [recipientName, setRecipientName] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [hospital, setHospital] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const [loading, setLoading] = useState(false);

  // Load districts & upazilas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const districtsRes = await fetch("/district.json");
        const districtsData = await districtsRes.json();
        setDistricts(districtsData.districts);

        const upazilasRes = await fetch("/upzila.json");
        const upazilasData = await upazilasRes.json();
        setUpazilas(upazilasData.upazilas);
      } catch (err) {
        console.error("Error loading district/upazila:", err);
      }
    };
    fetchData();
  }, []);

  // Filter upazilas when district changes
  useEffect(() => {
    if (district) {
      setFilteredUpazilas(upazilas.filter((u) => u.district_id === district));
      setUpazila(""); // reset upazila
    }
  }, [district, upazilas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !recipientName ||
      !district ||
      !upazila ||
      !hospital ||
      !address ||
      !bloodGroup ||
      !donationDate ||
      !donationTime ||
      !requestMessage
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const payload = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      recipientName,
      districtName: districts.find((d) => d.id === district)?.name || "",
      upazilaName: upazila,
      hospital,
      address,
      bloodGroup,
      donationDate,
      donationTime,
      requestMessage,
    };

    try {
      await axiosSecure.post("/donationRequests", payload);
      toast.success("Donation request created successfully!");
      // reset form
      setRecipientName("");
      setDistrict("");
      setUpazila("");
      setHospital("");
      setAddress("");
      setBloodGroup("");
      setDonationDate("");
      setDonationTime("");
      setRequestMessage("");
    } catch (err) {
      console.error("Failed to create donation request:", err);
      toast.error("Failed to create donation request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-gray-900 to-black p-4">
      <div className="w-full max-w-2xl bg-gray-900/90 rounded-3xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Donation Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Requester Info */}
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
          />

          {/* Recipient Name */}
          <input
            type="text"
            placeholder="Recipient Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required
          />

          {/* District */}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required>
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Upazila */}
          <select
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required>
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Hospital */}
          <input
            type="text"
            placeholder="Hospital Name"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required
          />

          {/* Blood Group */}
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required>
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>

          {/* Donation Date & Time */}
          <input
            type="date"
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required
          />
          <input
            type="time"
            value={donationTime}
            onChange={(e) => setDonationTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required
          />

          {/* Request Message */}
          <textarea
            placeholder="Request Message"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRequest;
