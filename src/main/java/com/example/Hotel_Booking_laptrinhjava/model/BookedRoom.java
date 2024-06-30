package com.example.Hotel_Booking_laptrinhjava.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.logging.log4j.util.Lazy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookedRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    @Column(name = "check_In")
    private LocalDate checkInDate;
    @Column(name = "check_Out")
    private LocalDate checkOutDate;
    @Column(name = "Guest_Fullname")
    private String guestFullName;
    @Column(name = "Guest_Email")
    private String guestEmail;
    @Column(name = "adults")
    private int NumOfAdults;
    @Column(name = "children")
    private int NumofChildren;
    @Column(name = "total_guest")
    private int totalNumOfGuest;
    @Column(name = "confirmation_Code")
    private String bookingConfirmationCode;
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;


    public void calculateTotalNumberOfGuest()
    {
        this.totalNumOfGuest = this.NumOfAdults + this.NumofChildren;
    }

    public void setNumOfAdults(int numOfAdults) {
        NumOfAdults = numOfAdults;
        calculateTotalNumberOfGuest();
   }

    public void setNumofChildren(int numofChildren) {
        NumofChildren = numofChildren;
        calculateTotalNumberOfGuest();
    }

    public void setBookingConfirmationCode(String bookingConfirmationCode) {
        this.bookingConfirmationCode = bookingConfirmationCode;
    }

    public void calculateTotalAmount(BigDecimal roomPrice) {
        LocalDate startDate = this.checkInDate;
        LocalDate endDate = this.checkOutDate;
        long numDays = ChronoUnit.DAYS.between(startDate, endDate);
        BigDecimal totalAmount = roomPrice.multiply(BigDecimal.valueOf(numDays));
        this.totalAmount = totalAmount;
    }
    public void calculateTotalAmount() {
        LocalDate startDate = this.checkInDate;
        LocalDate endDate = this.checkOutDate;
        long numDays = ChronoUnit.DAYS.between(startDate, endDate);
        BigDecimal price = (room.getDiscountPrice() != null) ? room.getDiscountPrice() : room.getRoomPrice();
        this.totalAmount = price.multiply(BigDecimal.valueOf(numDays));
    }
}
