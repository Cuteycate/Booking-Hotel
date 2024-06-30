import { parseISO } from 'date-fns';
import React, { useState, useEffect } from 'react';
import DateSlider from '../common/DateSlider';
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
    const [filteredBookings, setFilteredBookings] = useState([]);

    const filterBookings = (startDate, endDate) => {
        if (startDate && endDate) {
            const filtered = bookingInfo.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkInDate);
                const bookingEndDate = parseISO(booking.checkOutDate);
                return (
                    bookingStartDate >= startDate &&
                    bookingEndDate <= endDate &&
                    bookingEndDate > startDate
                );
            });
            setFilteredBookings(filtered);
        } else {
            setFilteredBookings(bookingInfo);
        }
    };

    useEffect(() => {
        setFilteredBookings(bookingInfo);
    }, [bookingInfo]);

    return (
        <section className="p-4">
            <DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
            {filteredBookings.length === 0 ? (
                <p>Không có Bookings nào trong khoảng ngày này</p>
            ) : (
                <table className="table table-bordered table-hover shadow text">
                    <thead className="text-center">
                        <tr>
                            <th>Mã Đơn</th>
                            <th>ID Phòng</th>
                            <th>Loại Phòng</th>
                            <th>Ngày Check In</th>
                            <th>Ngày Check Out</th>
                            <th>Tên Khách</th>
                            <th>Email</th>
                            <th>Số khách</th>
                            <th>Giá Tiền</th>
                            <th>Mã Code</th>
                            <th colSpan={1}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.room.id}</td>
                                <td>{booking.room.roomType}</td>
                                <td>{booking.checkInDate}</td>
                                <td>{booking.checkOutDate}</td>
                                <td>{booking.guestName}</td>
                                <td>{booking.guestEmail}</td>
                                <td>{booking.totalNumOfGuests}</td>
                                <td>{booking.totalAmount}</td>
                                <td>{booking.bookingConfirmationCode}</td>
                                <td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Link to={`/admin/view-booking/${booking.id}`} className="btn btn-primary btn-sm">
                                        <FaEye />                    
                                    </Link>
                                    <button
                                        className="btn btn-danger btn-sm ml-5"
                                        onClick={() => handleBookingCancellation(booking.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                       <TiCancel />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default BookingsTable;
