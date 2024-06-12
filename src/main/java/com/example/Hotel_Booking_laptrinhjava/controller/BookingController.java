package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.exception.InvalidBookingRequestException;
import com.example.Hotel_Booking_laptrinhjava.exception.ResourceNotFoundException;
import com.example.Hotel_Booking_laptrinhjava.model.BookedRoom;
import com.example.Hotel_Booking_laptrinhjava.model.Room;
import com.example.Hotel_Booking_laptrinhjava.response.BookingResponse;
import com.example.Hotel_Booking_laptrinhjava.response.RoomResponse;
import com.example.Hotel_Booking_laptrinhjava.service.IBookingService;
import com.example.Hotel_Booking_laptrinhjava.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final IBookingService bookingService;
    private final IRoomService roomService;
    @GetMapping("all-bookings")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings()
    {
        List<BookedRoom> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for(BookedRoom booking : bookings)
        {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }


    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        try{
            BookedRoom booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId, @RequestBody BookedRoom bookingRequest)
    {
        // Retrieve the room by its ID
        Optional<Room> optionalRoom = roomService.getRoomById(roomId);

        // Check if the room exists
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            BigDecimal roomPrice = room.getRoomPrice();

            // Calculate the total amount using the room price
            bookingRequest.calculateTotalAmount(roomPrice);

            // Proceed with saving the booking
            try {
                String confirmationCode = bookingService.saveBooking(roomId, bookingRequest);
                return ResponseEntity.ok("Booking successful! Confirmation code: " + confirmationCode);
            } catch (InvalidBookingRequestException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else {
            // Handle the case where the room with the given ID is not found
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(@PathVariable Long bookingId)
    {
        bookingService.cancelBooking(bookingId);
    }
    private BookingResponse getBookingResponse(BookedRoom booking) {
        Room theRoom = roomService.getRoomById(booking.getRoom().getId()).get();
        RoomResponse room = new RoomResponse(
                theRoom.getId(),
                theRoom.getRoomType(),
                theRoom.getRoomPrice());
        return new BookingResponse(
                booking.getBookingId(), booking.getCheckInDate(),
                booking.getCheckOutDate(),booking.getGuestFullName(),
                booking.getGuestEmail(), booking.getNumOfAdults(),
                booking.getNumofChildren(), booking.getTotalNumOfGuest(),
                booking.getBookingConfirmationCode(), room);
    }
    @PostMapping("/check-room-availability/{roomId}")
    public ResponseEntity<Boolean> checkRoomAvailability(@PathVariable Long roomId, @RequestBody BookedRoom bookingRequest) {
        boolean isRoomAvailable = bookingService.isRoomAvailable(roomId, bookingRequest);
        if (isRoomAvailable) {
            return ResponseEntity.ok(true); // Room is available
        } else {
            return ResponseEntity.ok(false); // Room is not available
        }
    }
    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedRoom> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }


}
