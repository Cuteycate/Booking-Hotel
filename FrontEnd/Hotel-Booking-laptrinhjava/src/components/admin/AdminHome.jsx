import React, { useState, useEffect } from 'react';
import {
  BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill
} from 'react-icons/bs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import '../admin/admin.css';
import { getAllRooms, getAllBookings } from '../utils/ApiFunctions';

function AdminHome() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const roomsData = await getAllRooms();
        const bookingsData = await getAllBookings();
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate counts
  const totalRooms = rooms.length;
  const bookedRooms = bookings.filter(booking => booking.status === 'booked').length;
  const notBookedRooms = totalRooms - bookedRooms;


  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>Thống Kê</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>Tổng Số Phòng</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{totalRooms}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Phòng Đă Đặt</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>{bookedRooms}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Phòng Trống</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{notBookedRooms}</h1>
        </div>
      </div>
    </main>
  );
}

export default AdminHome;
