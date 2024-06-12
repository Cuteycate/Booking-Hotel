package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.model.BookedRoom;

import java.util.List;
import java.util.Optional;

public interface IBookingService {
    void cancelBooking(Long bookingId);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    List<BookedRoom> getAllBookings();

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    boolean isRoomAvailable(Long roomId, BookedRoom bookingRequest);

    List<BookedRoom> getBookingsByUserEmail(String email);
}
