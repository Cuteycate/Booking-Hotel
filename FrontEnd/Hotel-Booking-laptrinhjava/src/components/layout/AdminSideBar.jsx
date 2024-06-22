import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsFillGearFill
} from 'react-icons/bs';
import { FaRegLightbulb } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import '../admin/admin.css';

import { AuthContext } from '../auth/AuthProvider';

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/", { state: { message: "You have been logged out!" } });
  };

  return (
    <aside id="sidebar" className={`${openSidebarToggle ? "sidebar-responsive" : ""} ${isDarkMode ? "dark-mode" : ""}`}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <MdAdminPanelSettings className='icon_header' /> Quản Lý Khách Sạn
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/admin" onClick={OpenSidebar}>
            <BsGrid1X2Fill className='icon' /> Thống kê
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/rooms" onClick={OpenSidebar}>
            <BsFillArchiveFill className='icon' /> Phòng
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/categories-Blog" onClick={OpenSidebar}>
            <BsFillGrid3X3GapFill className='icon' /> Thể Loại Bài Viết
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/Blogs" onClick={OpenSidebar}>
            <BsPeopleFill className='icon' /> Bài Viết
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/users" onClick={OpenSidebar}>
            <BsFillGearFill className='icon' /> Người Dùng
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <a onClick={toggleTheme}>
            <FaRegLightbulb className='icon' /> 
            {isDarkMode ? " Light Mode" : " Dark Mode"}
          </a>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/" onClick={OpenSidebar}>
            <BsFillGearFill className='icon' /> Quay Lại Khách Sạn
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <button className='dropdown-item' onClick={handleLogoutClick}>
            <BsFillGearFill className='icon' /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
