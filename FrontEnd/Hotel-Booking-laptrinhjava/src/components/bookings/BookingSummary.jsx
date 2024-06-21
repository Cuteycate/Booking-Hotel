import React, { useState, useEffect } from "react"
import moment from "moment"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"
import { Payment } from "../utils/ApiFunctions"

const BookingSummary = ({roomId, booking, payment, isFormValid, onConfirm }) => {
	const checkInDate = moment(booking.checkInDate)
	const checkOutDate = moment(booking.checkOutDate)
	const numberOfDays = checkOutDate.diff(checkInDate, "days")
	const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const navigate = useNavigate()

	const handleConfirmBooking = async () => {
		try {
			setIsProcessingPayment(true)
			const orderInfo = `Booking for ${booking.guestFullName} from ${checkInDate.format("MMM Do YYYY")} to ${checkOutDate.format("MMM Do YYYY")}`
			const encodedGuestFullName = encodeURIComponent(booking.guestFullName);
			const returnUrl = `${window.location.origin}/booking-success?roomId=${roomId}&guestFullName=${encodedGuestFullName}&guestEmail=${booking.guestEmail}&checkInDate=${booking.checkInDate}&checkOutDate=${booking.checkOutDate}&numOfAdults=${booking.numOfAdults}&numOfChildren=${booking.numOfChildren}`; // URl Return 
			const vnpayUrl = await Payment(payment, orderInfo, returnUrl)
			setIsBookingConfirmed(true)		
			if (vnpayUrl) {
				window.location.href = vnpayUrl // chuyen huong den trang thanh toan cua VNPay
			}

		} catch (error) {	
			console.error("Payment error:", error)
			setIsProcessingPayment(false)
			navigate("/booking-success", { state: { error: error.message } })
		}
	}

	useEffect(() => {
		//if (isBookingConfirmed) {
		//	navigate("/booking-success")
		//}
	}, [isBookingConfirmed, navigate])

	return (
		<div className="row">
			<div className="col-md-6"></div>
			<div className="card card-body mt-5">
				<h4 className="card-title hotel-color">Tóm tắt đặt chỗ</h4>
				<p>
					Tên: <strong>{booking.guestFullName}</strong>
				</p>
				<p>
					Email: <strong>{booking.guestEmail}</strong>
				</p>
				<p>
					Ngày Check-In: <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
				</p>
				<p>
					Ngày Check-Out: <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
				</p>
				<p>
					Số ngày đặt: <strong>{numberOfDays}</strong>
				</p>

				<div>
					<h5 className="hotel-color">Số lượng khách</h5>
					<strong>
						Người Lớn{booking.numOfAdults > 1 ? "s" : ""} : {booking.numOfAdults}
					</strong>
					<strong>
						<p>Trẻ Em : {booking.numOfChildren}</p>
					</strong>
				</div>

				{payment > 0 ? (
					<>
						<p>
							Tổng Số Tiền: <strong>{payment} VND</strong>
						</p>

						{isFormValid && !isBookingConfirmed ? (
							<Button variant="success" onClick={handleConfirmBooking}>
								{isProcessingPayment ? (
									<>
										<span
											className="spinner-border spinner-border-sm mr-2"
											role="status"
											aria-hidden="true"></span>
										Đã xác nhận đặt chỗ, chuyển hướng đến thanh toán...
									</>
								) : (
									"Xác nhận đặt chỗ và tiến hành thanh toán"
								)}
							</Button>
						) : isBookingConfirmed ? (
							<div className="d-flex justify-content-center align-items-center">
								<div className="spinner-border text-primary" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						) : null}
					</>
				) : (
					<p className="text-danger">Ngày bắt đầu phải nhỏ hơn ngày kết thúc</p>
				)}
			</div>
		</div>
	)
}

export default BookingSummary
