import { parseISO } from 'date-fns';
import React, { useState, useEffect } from 'react';
import DateSlider from '../common/DateSlider';

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
    const [filteredBookings, setFilteredBookings] = useState([]);

    const filterBookings = (startDate, endDate) => {
        let filtered = bookingInfo;
        if (startDate && endDate) {
            filtered = bookingInfo.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkInDate);
                const bookingEndDate = parseISO(booking.checkOutDate);
                return (
                    bookingStartDate >= startDate &&
                    bookingEndDate <= endDate &&
                    bookingEndDate > startDate
                );
            });
        }
        setFilteredBookings(filtered);
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
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>ID</th>
                            <th>Phòng_ID</th>
                            <th>Loại_Phòng</th>
                            <th>Ngày_Check_In</th>
                            <th>Ngày_Check_Out</th>
                            <th>Họ_Tên_Khách⠀⠀</th>
                            <th>Email_Khách</th>
                            <th>Người_Lớn</th>
                            <th>Trẻ_Em</th>
                            <th>Tổng_Khách</th>
                            <th>Mã Code</th>
                            <th colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredBookings.map((booking, index) => (
                            <tr key={booking.id}>
                                <td>{index + 1}</td>
                                <td>{booking.id}</td>
                                <td>{booking.room.id}</td>
                                <td>{booking.room.roomType}</td>
                                <td>{booking.checkInDate}</td>
                                <td>{booking.checkOutDate}</td>
                                <td>{booking.guestName}</td>
                                <td>{booking.guestEmail}</td>
                                <td>{booking.numOfAdults}</td>
                                <td>{booking.numOfChildren}</td>
                                <td>{booking.totalNumOfGuests}</td>
                                <td>{booking.bookingConfirmationCode}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleBookingCancellation(booking.id)}
                                    >
                                        Hủy Book
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
