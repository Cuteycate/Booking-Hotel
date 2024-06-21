import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import { bookRoom } from "../utils/ApiFunctions";

const BookingSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const vnp_Amount = searchParams.get("vnp_Amount") || "";
  const vnp_BankCode = searchParams.get("vnp_BankCode") || "";
  const vnp_PayDate = searchParams.get("vnp_PayDate") || "";
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo") || "";
  const amountInDong = vnp_Amount ? parseInt(vnp_Amount) / 100 : 0;

  const isBookingProcessed = useRef(false);

  useEffect(() => {
    const processBooking = async () => {
      if (vnp_Amount && vnp_BankCode && vnp_PayDate && vnp_TransactionNo && !isBookingProcessed.current) {
        const transactionStatus = searchParams.get("vnp_TransactionStatus");
        setTransactionStatus(transactionStatus);

        const bookingData = {
          guestFullName: decodeURLParams(searchParams.get("guestFullName")),
          guestEmail: searchParams.get("guestEmail"),
          checkInDate: searchParams.get("checkInDate"),
          checkOutDate: searchParams.get("checkOutDate"),
          numOfAdults: searchParams.get("numOfAdults"),
          numofChildren: searchParams.get("numOfChildren"),
          paymentInfo: {
            amount: amountInDong,
            bankCode: vnp_BankCode,
            payDate: vnp_PayDate,
            transactionNo: vnp_TransactionNo
          }
        };

        const roomId = searchParams.get("roomId");
        if (transactionStatus === "00" && !isProcessingPayment ) {
          handleFormSubmit(roomId, bookingData);
          setIsProcessingPayment(true);
          isBookingProcessed.current = true; 
        }
      }
    };

    processBooking();
  }, [vnp_Amount, vnp_BankCode, vnp_PayDate, vnp_TransactionNo, searchParams]);

  const handleFormSubmit = async (roomId, bookingData) => {
    try {    
      const response = await bookRoom(roomId, bookingData);
      console.log("Current booking state:", bookingData);
      setConfirmationCode(response);
    } catch (error) {
      console.error("Failed to save booking:", error);
    }
  };

  const decodeURLParams = (param) => {
    return decodeURIComponent(param.replace(/\+/g, ' '));
  };

  return (
    <div className="container">
      <Header title="Booking Success" />
      <div className="mt-5">
        {transactionStatus === "00" ? (
          <div>
            <h3 className="text-success">Booking Success!</h3>
            <p className="text-success">Amount: {amountInDong} VND </p>
            <p className="text-success">Bank Code: {vnp_BankCode}</p>
            <p className="text-success">Pay Date: {vnp_PayDate}</p>            
            <p className="text-success">Transaction No: {vnp_TransactionNo}</p>
            <p className="text-success">Confirmation Code: {confirmationCode}</p>
          </div>
        ) : transactionStatus === "01" ? (
          <p className="text-danger">There was an error with your booking.</p>
        ) : (
          <p className="text-warning">ERROR BOOKING ROOM</p>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
