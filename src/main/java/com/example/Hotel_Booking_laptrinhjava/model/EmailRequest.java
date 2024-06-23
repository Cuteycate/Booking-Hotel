package com.example.Hotel_Booking_laptrinhjava.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {
    private String confirmationCode;
    private String guestEmail;
    private BookedRoom bookingData;
    private String emailType;
}
