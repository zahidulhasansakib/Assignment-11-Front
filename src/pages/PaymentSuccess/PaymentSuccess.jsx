// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const sessionId = searchParams.get("session_id");
  const applicationId = searchParams.get("applicationId");

  useEffect(() => {
    const processPayment = async () => {
      try {
        console.log("📝 Processing payment success:", {
          sessionId,
          applicationId,
        });

        if (!sessionId || !applicationId) {
          toast.error("Invalid payment information");
          navigate("/dashboard/applied-tutors");
          return;
        }

        // Backend এ payment success জানান
        const response = await axios.post("/tuition-payment-success", {
          session_id: sessionId,
          applicationId,
        });

        console.log("✅ Payment processed:", response.data);

        if (response.data.success) {
          setPaymentInfo(response.data.payment);
          toast.success("Payment successful! Tutor approved.");
        } else {
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("❌ Error processing payment:", error);
        toast.error(
          error.response?.data?.message || "Failed to process payment",
        );
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [sessionId, applicationId]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="text-5xl text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Processing your payment...</h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>

        {paymentInfo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-gray-600">Transaction ID:</p>
            <p className="font-mono text-sm mb-2">
              {paymentInfo.transactionId}
            </p>
            <p className="text-sm text-gray-600">Amount:</p>
            <p className="text-xl font-bold text-green-600">
              ৳{paymentInfo.amount}
            </p>
            <p className="text-sm text-gray-600 mt-2">Date:</p>
            <p>{new Date(paymentInfo.paymentDate).toLocaleString()}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link
            to="/dashboard/payments"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Payments
          </Link>
          <Link
            to="/dashboard/applied-tutors"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Back to Tutors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
