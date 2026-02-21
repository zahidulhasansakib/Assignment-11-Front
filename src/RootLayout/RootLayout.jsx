import React from "react";
import { Outlet } from "react-router-dom"; // ✅ correct
import Navbar from "../Components/Navbar/Navbar";

const RootLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet />
    </div>
  );
};

export default RootLayout;
