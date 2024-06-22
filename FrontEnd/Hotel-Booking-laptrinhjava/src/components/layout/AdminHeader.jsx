import React from 'react'
import {
  BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify
} from 'react-icons/bs'
import '../admin/admin.css';
function AdminHeader({ OpenSidebar }) {
  return (
    <header className='header-admin'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
    </header>
  )
}

export default AdminHeader
