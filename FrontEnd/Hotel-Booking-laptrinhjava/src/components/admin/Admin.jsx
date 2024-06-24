import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminHeader from "../layout/AdminHeader";
import AdminSidebar from "../layout/AdminSideBar";
import AdminHome from "./AdminHome";
import ExistingRoom from "../room/ExistingRoom";
import '../admin/admin.css';
import EditRoom from "../room/EditRoom";
import AddRoom from "../room/AddRoom";
import Bookings from "../room/Bookings";
import BlogCategoriesListing from "../BlogCategory/BlogCategoriesListing";
import BlogListing from "../Blog/BlogListing";
import AddBlog from "../Blog/AddBlog";
import UpdateBlog from "../Blog/UpdateBlog";
import UserListing from "../user/UserListing";
import BookingsTable from "../bookings/BookingsTable";




const Admin = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <AdminHeader OpenSidebar={OpenSidebar} />
      <AdminSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<AdminHome />} />

          {/*Room Route*/}
          <Route path="/rooms" element={<ExistingRoom />} />
          <Route path="/edit-room/:roomId" element={<EditRoom />} />
          <Route path="/add-room" element={<AddRoom />} />
          {/*Booking Route*/}
          <Route path="/existing-bookings" element={<Bookings />} />



          {/*Blog Route*/}
          <Route path="/Blogs" element={<BlogListing />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/Update-Blog/:id" element={<UpdateBlog />} />
          {/*Blog categories Route*/}

          <Route path="/categories-Blog" element={<BlogCategoriesListing />} />

          {/*Users Route*/}
          <Route path="/users" element={<UserListing />} />
          {/* Add other routes here */}
          {/*Bookings Route*/}
          <Route path="/bookings" element={<Bookings />} />
          <Route path="*" element={<AdminHome />} /> {/* Default to AdminHome if no match */}
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
