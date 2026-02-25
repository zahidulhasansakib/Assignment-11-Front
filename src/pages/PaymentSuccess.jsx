
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const sessionId = searchParams.get("session_id");
  const applicationId = searchParams.get("applicationId");

  useEffect(() => {
    const processPayment = async () => {
      try {
        console.log("📝 Processing payment success...");
        console.log("Session ID:", sessionId);
        console.log("Application ID:", applicationId);

        if (!sessionId || !applicationId) {
          setError("Missing payment information");
          setLoading(false);
          setTimeout(
            () => navigate("/dashboard/applied-tutors?payment=error"),
            3000,
          );
          return;
        }

        // Call backend to verify payment
        const response = await axios.post("/tuition-payment-success", {
          session_id: sessionId,
          applicationId,
        });

        console.log("✅ Payment verification response:", response.data);

        if (response.data.success) {
          setPaymentInfo(response.data.payment);
          toast.success("Payment successful! Tutor approved.");

          // Redirect to applied tutors after 2 seconds
          setTimeout(() => {
            navigate("/dashboard/applied-tutors?payment=success");
          }, 2000);
        } else {
          throw new Error(
            response.data.message || "Payment verification failed",
          );
        }
      } catch (error) {
        console.error("❌ Error processing payment:", error);

        // Retry logic (max 3 retries)
        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount + 1}/3`);
          setRetryCount((prev) => prev + 1);
          setTimeout(() => processPayment(), 2000);
        } else {
          setError(
            error.response?.data?.message || "Failed to process payment",
          );
          toast.error("Payment verification failed. Please contact support.");

          setTimeout(() => {
            navigate("/dashboard/applied-tutors?payment=error");
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [sessionId, applicationId, retryCount]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <FaSpinner className="text-5xl text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-yellow-600 mt-2">
              Retry attempt {retryCount}/3
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting back to applications...
          </p>
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>

        {paymentInfo && (
          <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">Amount:</span>
              <span className="text-xl font-bold text-green-600">
                ৳{paymentInfo.amount}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">
                Transaction ID:
              </span>
              <span className="text-sm font-mono text-gray-600">
                {paymentInfo.transactionId?.slice(0, 16)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-sm text-gray-600">
                {new Date(paymentInfo.paymentDate).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 mb-4">
          Redirecting to your applications...
        </p>
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
