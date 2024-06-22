package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.response.PaymentResponse;
import com.example.Hotel_Booking_laptrinhjava.service.EmailService;
import com.example.Hotel_Booking_laptrinhjava.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private EmailService emailService;


    @PostMapping("/submitOrder")
    public ResponseEntity<String> submitOrder(@RequestParam("amount") int roomPrice,
                                              @RequestParam("orderInfo") String orderInfo,
                                              @RequestParam("returnUrl") String returnUrl,
                                              HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(request, roomPrice, orderInfo, returnUrl);
        return ResponseEntity.ok(vnpayUrl);
    }

    @GetMapping("/vnpay-payment")
    public ResponseEntity<PaymentResponse> getMapping(HttpServletRequest request, Model model) {

        int paymentStatus = vnPayService.orderReturn(request);
        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        PaymentResponse payment = new PaymentResponse(paymentStatus,orderInfo, totalPrice, paymentTime, transactionId);

        return ResponseEntity.ok(payment);
    }

    @PostMapping("/emailSender")
    public ResponseEntity<String> emailSender(@RequestParam("confirmationCode") String confirmationCode,
                                              @RequestParam("guestEmail") String guestEmail) {
        // Tiêu đề và nội dung email
        String subject = "Your Booking Confirmation - Thank You for Choosing Us!";
        String body = "Dear Valued Guest,\n\n" +
                "We are thrilled to confirm your booking with us! It is our pleasure to have you as our guest and we are committed to making your stay memorable.\n\n" +
                "Here are your booking details:\n" +
                "Confirmation Code: " + confirmationCode + "\n\n" +
                "Please keep this confirmation code handy for your reference.\n\n" +
                "If you have any questions or need further assistance, do not hesitate to contact us. We are here to help you and ensure you have a wonderful experience.\n\n" +
                "Thank you for choosing our hotel. We look forward to welcoming you soon!\n\n" +
                "Warm regards,\n" +
                "The Hotel Booking Team\n" +
                "Contact Us: [Penacony Hotel Team ]\n" +
                "Website: [Penacony Hotel]\n";

        // Gửi email
        emailService.sendEmail(guestEmail, subject, body);

        // Trả về phản hồi cho client
        return ResponseEntity.ok("Confirmation email sent to " + guestEmail);
    }






}
