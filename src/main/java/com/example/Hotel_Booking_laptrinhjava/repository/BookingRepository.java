package com.example.Hotel_Booking_laptrinhjava.repository;

import com.example.Hotel_Booking_laptrinhjava.model.BookedRoom;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<BookedRoom, Long> {

    List<BookedRoom> findByRoomId(Long roomId);

    Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> findByGuestEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE BookedRoom br SET br.guestEmail = :newEmail WHERE br.guestEmail = :oldEmail")
    void updateBookingsEmail(@Param("oldEmail") String oldEmail, @Param("newEmail") String newEmail);

}