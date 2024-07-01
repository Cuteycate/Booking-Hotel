import React, { useState } from "react"
import moment from "moment"
import {EmailSender, cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"

const FindBooking = () => {
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [emailSender, setemailSender] = useState("");
	const [isLoading, setIsLoading] = useState(false)
	const [bookingInfo, setBookingInfo] = useState({
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	})

	const emptyBookingInfo = {
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	}
	const [isDeleted, setIsDeleted] = useState(false)

	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value)
	}

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		try {
			const data = await getBookingByConfirmationCode(confirmationCode)
			setBookingInfo(data)
			setError(null)
		} catch (error) {
			setBookingInfo(emptyBookingInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}

		setTimeout(() => setIsLoading(false), 2000)
	}

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingInfo.id)
			setIsDeleted(true)
			setSuccessMessage("Bookings đã được hủy!")
			setBookingInfo(emptyBookingInfo)
			setConfirmationCode("")
			setError(null)
			const email = await EmailSender(bookingInfo.bookingConfirmationCode, bookingInfo.guestEmail, bookingInfo, "cancellation");
      		console.log("Current booking state:", bookingData); 
			setemailSender(email);
		} catch (error) {
			setError(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setIsDeleted(false)
		}, 2000)
	}

	return (
		<>
			<div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
				<h2 className="text-center mb-4">Find My Booking</h2>
				<form onSubmit={handleFormSubmit} className="col-md-6">
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="text"
							id="confirmationCode"
							name="confirmationCode"
							value={confirmationCode}
							onChange={handleInputChange}
							placeholder="Hãy nhập code bookings"
						/>

						<button type="submit" className="btn btn-hotel input-group-text">
							Tìm Bookings
						</button>
					</div>
				</form>

				{isLoading ? (
					<div>Đang tìm Bookings...</div>
				) : error ? (
					<div className="text-danger">Error: {error}</div>
				) : bookingInfo.bookingConfirmationCode ? (
					<div className="col-md-6 mt-4 mb-5">
						<h3>Nội Dung Bookings</h3>
						<p className="text-success">Confirmation Code: {bookingInfo.bookingConfirmationCode}</p>
						<p>Số Phòng: {bookingInfo.room.id}</p>
						<p>Loại Phòng: {bookingInfo.room.roomType}</p>
						<p>
							Ngày Check-in:{" "}
							{moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>
							Ngày Check-out:{" "}
							{moment(bookingInfo.checkOutDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>Họ Tên: {bookingInfo.guestName}</p>
						<p>Địa chỉ Email: {bookingInfo.guestEmail}</p>
						<p>Người Lớn: {bookingInfo.numOfAdults}</p>
						<p>Trẻ Em: {bookingInfo.numOfChildren}</p>
						<p>Tổng số khách: {bookingInfo.totalNumOfGuests}</p>
						<p>Giá Tiền: {bookingInfo.totalAmount} VNĐ</p>
						{!isDeleted && (
							<button
								onClick={() => handleBookingCancellation(bookingInfo.id)}
								className="btn btn-danger">
								Hoãn Bookings
							</button>
						)}
					</div>
				) : (
					<div>Tìm Kiếm Bookings</div>
				)}

				{isDeleted && <div className="alert alert-success mt-3 fade show">{successMessage}</div>}
			</div>
		</>
	)
}

export default FindBooking