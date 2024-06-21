package com.example.Hotel_Booking_laptrinhjava.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentResponse {
    private int PaymentStatus;
    private String orderInfo;
    private String totalPrice;
    private String paymentTime;
    private String transactionId;

    public PaymentResponse ( int PaymentStatus, String oder, String total, String paymentTime, String transactionId)
    {
        this.PaymentStatus = PaymentStatus;
        this.orderInfo = oder;
        this.totalPrice = total;
        this.paymentTime = paymentTime;
        this.transactionId = transactionId;
    }

}
