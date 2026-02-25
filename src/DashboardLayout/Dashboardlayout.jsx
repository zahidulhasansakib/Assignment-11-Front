import React from "react";
import { Outlet } from "react-router-dom";
import Aside from "../components/navbar/Aside"; 

const Dashboardlayout = () => {
  return (
    <div className="flex">
      <Aside />  
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboardlayout;
