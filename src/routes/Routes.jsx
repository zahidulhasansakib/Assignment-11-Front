// src/routes/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import ErrorPage from "../pages/ErrorPage";

// ================= Public Pages =================
import TuitionsListing from "../pages/TuitionsListing";
import TutorListing from "../pages/TutorListing";
import TutorProfile from "../pages/TutorProfile";

// ================= Student Dashboard pages =================
import StudentDashboard from "../pages/dashboard/mainDashboard/StudentDashboard/StudentDashboard";
import MyTuitions from "../pages/dashboard/mainDashboard/StudentDashboard/MyTuitions";
import PostTuition from "../pages/dashboard/mainDashboard/StudentDashboard/PostTuition";
import AppliedTutors from "../pages/dashboard/mainDashboard/StudentDashboard/AppliedTutors";
import Payments from "../pages/dashboard/mainDashboard/StudentDashboard/Payments";
import ProfileSettings from "../pages/dashboard/mainDashboard/StudentDashboard/ProfileSettings";

// ================= Tutor Dashboard pages =================
import TutorDashboard from "../pages/TutorDashboard/TutorDashboard";
import MyApplications from "../pages/TutorDashboard/MyApplications";
import TutorOngoingTuitions from "../pages/TutorDashboard/TutorOngoingTuitions";
import RevenueHistory from "../pages/TutorDashboard/RevenueHistory";

// ================= Admin Dashboard pages =================
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import UserManagement from "../pages/AdminDashboard/UserManagement";
import TuitionManagement from "../pages/AdminDashboard/TuitionManagement";
import ReportsAnalytics from "../pages/AdminDashboard/ReportsAnalytics";

// ================= Payment Pages =================
import PaymentHistory from "../pages/PaymentHistory";
import PaymentSuccess from "../pages/PaymentSuccess";


// ================= Other pages =================
import AddRequest from "../pages/dashboard/mainDashboard/AddRequest/AddRequest";

// ================= PrivateRoute =================
import PrivateRoute from "./PrivateRoute";
import TuitionDetails from "../pages/TuitionDetails";
import PaymentCancel from "../pages/PaymentCancel ";

const router = createBrowserRouter([
  // ================= PUBLIC ROUTES =================
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "sign-up", element: <Signup /> },
      { path: "contact", element: <Contact /> },

      // Tuition Listing & Details
      { path: "tuitions", element: <TuitionsListing /> },
      { path: "tuition/:id", element: <TuitionDetails /> },

      // Tutor Listing & Profile
      { path: "tutors", element: <TutorListing /> },
      { path: "tutor/:id", element: <TutorProfile /> },

      // Payment Pages
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancel /> },
      { path: "payment-history", element: <PaymentHistory /> },

      // Error page
      { path: "error", element: <ErrorPage /> },
    ],
  },

  // ================= STUDENT DASHBOARD =================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["student", "admin"]}>
        {" "}
        // 👈 student এবং admin allowed
        <StudentDashboard />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MyTuitions /> },
      { path: "my-tuitions", element: <MyTuitions /> },
      { path: "post-tuition", element: <PostTuition /> },
      { path: "applied-tutors", element: <AppliedTutors /> },
      { path: "payments", element: <Payments /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "profile-settings", element: <ProfileSettings /> },
      { path: "add-request", element: <AddRequest /> },
    ],
  },

  // ================= TUTOR DASHBOARD =================
  {
    path: "/tutor",
    element: (
      <PrivateRoute allowedRoles={["tutor", "admin"]}>
        {" "}
        // 👈 tutor এবং admin allowed
        <TutorDashboard />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MyApplications /> },
      { path: "my-applications", element: <MyApplications /> },
      { path: "ongoing-tuitions", element: <TutorOngoingTuitions /> },
      { path: "revenue", element: <RevenueHistory /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "profile-settings", element: <ProfileSettings /> },
    ],
  },

  // ================= ADMIN DASHBOARD =================
  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        {" "}
        // 👈 শুধু admin allowed
        <AdminDashboard />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <UserManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "tuitions", element: <TuitionManagement /> },
      { path: "reports", element: <ReportsAnalytics /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "profile-settings", element: <ProfileSettings /> },
    ],
  },

  // ================= PROTECTED ROUTES =================
  {
    path: "/tuition/:id/apply",
    element: (
      <PrivateRoute allowedRoles={["tutor", "admin"]}>
        {" "}
        // 👈 শুধু tutor এবং admin apply করতে পারে
        <TuitionDetails />
      </PrivateRoute>
    ),
  },

  // ================= 404 ROUTE =================
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
