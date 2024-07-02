import React, { useState, useEffect } from 'react';
import {
  BsFillTrophyFill , BsPeopleFill, BsCashCoin 
} from 'react-icons/bs';
import '../admin/admin.css';
import { getAllBookings } from '../utils/ApiFunctions';

function AdminHome() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bookingsData = await getAllBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  const bookingsThisMonth = bookings.filter(booking => {
    const checkInDate = new Date(booking.checkInDate);
    return checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear;
  });

  const guestsVisited = bookingsThisMonth.reduce((total,booking)=> total + booking.totalNumOfGuests,0);

  const monthlyRevenue = bookingsThisMonth.reduce((total, booking) => total + booking.totalAmount, 0);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h1>Thống Kê Của {monthNames[currentMonth]} Năm {currentYear}</h1>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h2>Số lần Đặt Phòng</h2>
            <BsFillTrophyFill  className='card_icon' />
          </div>
          <h1>{bookingsThisMonth.length}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h2>Tổng Số Khách</h2>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{guestsVisited}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h2>Tổng Thu Nhập</h2>
            <BsCashCoin  className='card_icon' />
          </div>
          <h1>{monthlyRevenue.toLocaleString()} VNĐ</h1>
        </div>
      </div>
    </main>
  );
}

export default AdminHome;
