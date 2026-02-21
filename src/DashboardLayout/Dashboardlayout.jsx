import React from "react";
import { Outlet } from "react-router-dom";
import Aside from "../components/navbar/Aside"; // path ঠিকভাবে adjust করো

const Dashboardlayout = () => {
  return (
    <div className="flex">
      <Aside />  {/* এখানে Sidebar নয়, এখন Aside */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboardlayout;
