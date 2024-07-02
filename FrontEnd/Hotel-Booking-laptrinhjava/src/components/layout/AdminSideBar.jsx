import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillPersonLinesFill ,
  BsFillGearFill ,BsBackspaceFill ,BsArrowLeftCircleFill  ,BsListCheck ,BsBook 
} from 'react-icons/bs';
import { BiSolidLogOut } from "react-icons/bi";
import { FaRegLightbulb } from "react-icons/fa";
import { MdAdminPanelSettings,MdHotel  } from "react-icons/md";
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
    navigate("/", { state: { message: "Bạn đã đăng xuất!" } });
  };

  return (
    <aside id="sidebar" className={`${openSidebarToggle ? "sidebar-responsive" : ""} ${isDarkMode ? "dark-mode" : ""}`}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <MdAdminPanelSettings className='icon_header' /> Quản Lý Khách Sạn
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}><BsArrowLeftCircleFill  /></span>
      </div>

      <ul className='sidebar-list'>
        <Link to="/admin" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <BsGrid1X2Fill className='icon' />
              <span className='icon-name'>Thống kê</span>
            </div>
          </li>
        </Link>
        <Link to="/admin/rooms" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <MdHotel  className='icon' />
              <span className='icon-name'>Phòng</span>
            </div>
          </li>
        </Link>
        <Link to="/admin/categories-Blog" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <BsFillGrid3X3GapFill className='icon' />
              <span className='icon-name'>Thể Loại Bài Viết</span>
            </div>
          </li>
        </Link>
        <Link to="/admin/Blogs" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <BsBook  className='icon' />
              <span className='icon-name'>Bài Viết</span>
            </div>
          </li>
        </Link>
        <Link to="/admin/users" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <BsFillPersonLinesFill  className='icon' />
              <span className='icon-name'>Người Dùng</span>
            </div>
          </li>
        </Link>
        <Link to="/admin/bookings" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <BsListCheck  className='icon' />
              <span className='icon-name'>Danh Sách Bookings</span>
            </div>
          </li>
        </Link>
        <li className='sidebar-list-item' onClick={toggleTheme}>
          <div className="sidebar-link-content">
            <FaRegLightbulb className='icon' />
            <span className='icon-name'>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
        </li>
        <Link to="/" onClick={OpenSidebar} className='sidebar-link'>
          <li className='sidebar-list-item'>
            <div className="sidebar-link-content">
              <BsBackspaceFill className='icon' />
              <span className='icon-name'>Quay Lại Khách Sạn</span>
            </div>
          </li>
        </Link>
        <li className='sidebar-list-item' onClick={handleLogoutClick}>
          <button className='dropdown-item'>
            <div className="sidebar-link-content">
              <BiSolidLogOut className='icon' />
              <span className='icon-name'>Logout</span>
            </div>
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
