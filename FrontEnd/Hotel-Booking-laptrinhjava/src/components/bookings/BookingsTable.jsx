import { parseISO } from 'date-fns';
import React, { useState, useEffect } from 'react';
import DateSlider from '../common/DateSlider';
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";

const ITEMS_PER_PAGE = 5;

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filterBookings = (startDate, endDate, term) => {
        let filtered = bookingInfo;

        if (startDate && endDate) {
            filtered = filtered.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkInDate);
                const bookingEndDate = parseISO(booking.checkOutDate);
                return (
                    bookingStartDate >= startDate &&
                    bookingEndDate <= endDate &&
                    bookingEndDate > startDate
                );
            });
        }

        if (term) {
            filtered = filtered.filter((booking) =>
                booking.bookingConfirmationCode &&
                booking.bookingConfirmationCode.toString().toLowerCase().includes(term.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
        setCurrentPage(1); // Reset to first page whenever filters change
    };

    useEffect(() => {
        setFilteredBookings(bookingInfo);
    }, [bookingInfo]);

    useEffect(() => {
        filterBookings(null, null, searchTerm);
    }, [searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

    return (
        <section className="p-4">
            <DateSlider onDateChange={(start, end) => filterBookings(start, end, searchTerm)} />
            <br />
            <input
                type="text"
                placeholder="Tìm Kiếm Bằng Mã Code Xác Nhận"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
            />
            {currentBookings.length === 0 ? (
                <p>Không có Bookings nào trong khoảng ngày này</p>
            ) : (
                <>
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
                                <th>Mã Code Xác Nhận</th>
                                <th colSpan={1}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentBookings.map((booking) => (
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
                    <nav>
                        <ul className="pagination justify-content-center">
                            {[...Array(totalPages).keys()].map((number) => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                    <button onClick={() => handlePageChange(number + 1)} className="page-link">
                                        {number + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}
        </section>
    );
};

export default BookingsTable;
