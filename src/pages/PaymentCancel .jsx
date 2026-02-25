
import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">Your payment was cancelled.</p>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
