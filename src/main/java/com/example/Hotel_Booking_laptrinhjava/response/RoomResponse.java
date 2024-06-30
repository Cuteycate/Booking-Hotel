package com.example.Hotel_Booking_laptrinhjava.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomType;
    private BigDecimal roomPrice;
    private BigDecimal discountPrice; // New field
    private Boolean isBooked;
    private String photo;
    private String summary;
    private List<BookingResponse> bookings;

    public RoomResponse(Long id, String roomType, BigDecimal roomPrice, String summary) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
        this.summary = summary;
    }

    public RoomResponse(Long id, String roomType, BigDecimal roomPrice, BigDecimal discountPrice, String summary) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
        this.discountPrice = discountPrice;
        this.summary = summary;
    }

    // Existing constructor
    public RoomResponse(Long id, String roomType, BigDecimal roomPrice, BigDecimal discountPrice, boolean isBooked,
                        byte[] photoBytes, String summary) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
        this.discountPrice = discountPrice;
        this.isBooked = isBooked;
        this.summary = summary;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
    }
}
