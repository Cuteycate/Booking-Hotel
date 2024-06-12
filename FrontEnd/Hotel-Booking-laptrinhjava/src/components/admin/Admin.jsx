import React from 'react'
import { Link } from 'react-router-dom'

const Admin = () => {
  return (
    <section className="container mt-5">
        <h2>Chào mừng đến trang Admin</h2>
        <hr/>
        <Link to={"/existing-rooms"}>
        Quản Lý Phòng
        </Link>
        <br/>
        <Link to={"/existing-bookings"}>
        Quản lý Bookings
        </Link>
    </section>
  )
}

export default Admin