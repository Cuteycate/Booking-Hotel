import React, { useState, useEffect } from 'react';
import { getBookingById } from '../utils/ApiFunctions'; // Assume you have this function to fetch booking details
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingDetail = () => {
    const [booking, setBooking] = useState({
        id: "",
        room: { id: "", roomType: "" },
        checkInDate: "",
        checkOutDate: "",
        guestName: "",
        guestEmail: "",
        NumofChildren: "",
        NumOfAdults: "",
        totalNumOfGuests: "",
        bookingConfirmationCode: "",
    });
    const { bookingId } = useParams();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const bookingData = await getBookingById(bookingId);
                setBooking(bookingData);
            } catch (error) {
                console.error(error);
                toast.error("Có lỗi khi tải dữ liệu phòng");
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (!booking.id) {
        return <p>Loading booking details...</p>;
    }

    return (
        <>
            <section className="container mt-5 mb-5">
                <ToastContainer />
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="mt-5 mb-2">Chi tiết booking</h2>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <strong>ID Phòng:</strong> {booking.room.id}
                            </li>
                            <li className="list-group-item">
                                <strong>Loại Phòng:</strong> {booking.room.roomType}
                            </li>
                            <li className="list-group-item">
                                <strong>Ngày Check In:</strong> {booking.checkInDate}
                            </li>
                            <li className="list-group-item">
                                <strong>Ngày Check Out:</strong> {booking.checkOutDate}
                            </li>
                            <li className="list-group-item">
                                <strong>Tên Khách:</strong> {booking.guestName} 
                            </li>
                            <li className="list-group-item">
                                <strong>Email:</strong> {booking.guestEmail}
                            </li>
                            <li className="list-group-item">
                                <strong>Người lớn:</strong> {booking.numOfAdults}
                            </li>
                            <li className="list-group-item">
                                <strong>Trẻ em:</strong> {booking.numOfChildren}
                            </li>
                            <li className="list-group-item">
                                <strong>Tổng Khách:</strong> {booking.totalNumOfGuests}
                            </li>
                            <li className="list-group-item">
                                <strong>Giá Phòng:</strong> {booking.totalAmount}
                            </li>
                            <li className="list-group-item">
                                <strong>Mã Code:</strong> {booking.bookingConfirmationCode}
                            </li>
                        </ul>
                        <div className="d-grid gap-2 d-md-flex mt-4">
                            <Link to={"/admin/bookings"} className="btn btn-outline-info">
                                Quay lại
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BookingDetail;
