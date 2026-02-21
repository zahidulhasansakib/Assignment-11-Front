// src/routes/DashboardRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import StudentDashboard from "../pages/dashboard/StudentDashboard";
import MyTuitions from "../pages/dashboard/MyTuitions";
import PostTuition from "../pages/dashboard/PostTuition";
import AppliedTutors from "../pages/dashboard/AppliedTutors";
import Payments from "../pages/dashboard/Payments";
import ProfileSettings from "../pages/dashboard/ProfileSettings";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />}>
        <Route index element={<MyTuitions />} />
        <Route path="my-tuitions" element={<MyTuitions />} />
        <Route path="post-tuition" element={<PostTuition />} />
        <Route path="applied-tutors" element={<AppliedTutors />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
