package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.model.BookedRoom;
import com.example.Hotel_Booking_laptrinhjava.model.EmailRequest;
import com.example.Hotel_Booking_laptrinhjava.response.PaymentResponse;
import com.example.Hotel_Booking_laptrinhjava.service.EmailService;
import com.example.Hotel_Booking_laptrinhjava.service.VNPayService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private EmailService emailService;

    private final JavaMailSender mailSender;

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
    public ResponseEntity<PaymentResponse> getMapping(HttpServletRequest request) {

        int paymentStatus = vnPayService.orderReturn(request);
        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        PaymentResponse payment = new PaymentResponse(paymentStatus, orderInfo, totalPrice, paymentTime, transactionId);

        return ResponseEntity.ok(payment);
    }

    @PostMapping("/emailSender")
    public ResponseEntity<String> emailSender(@RequestBody EmailRequest emailRequest) throws MessagingException {
        String confirmationCode = emailRequest.getConfirmationCode();
        String guestEmail = emailRequest.getGuestEmail();
        BookedRoom bookingData = emailRequest.getBookingData();
        String emailType = emailRequest.getEmailType();

        String subject;
        String body;

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        if ("thankYou".equals(emailType)) {
            subject = "Your Booking Confirmation - Thank You for Choosing Us!";
            body = "<html><body style='font-size: 16px;'>" +
                    "<div style='text-align: center;'>" +
                    "<img src='cid:penaconyLogo' style='max-width: 100%; height: auto;'/>" +
                    "<hr style='border: 0.5px solid #ccc; width: 80%; margin-top: 10px; margin-bottom: 10px;'/>" +
                    "</div>" +
                    "<p>Dear Valued Guest,</p>" +
                    "<p>We are thrilled to confirm your booking with us! It is our pleasure to have you as our guest and we are committed to making your stay memorable.</p>" +
                    "<p>Here are your booking details:</p>" +
                    "<ul>" +
                    "<li>Confirmation Code: " + confirmationCode + "</li>" +
                    "<li>CheckInDate: " + bookingData.getCheckInDate() + "</li>" +
                    "<li>CheckOutDate: " + bookingData.getCheckOutDate() + "</li>" +
                    "<li>NumOfAdults: " + bookingData.getNumOfAdults() + "</li>" +
                    "<li>NumOfChildren: " + bookingData.getNumofChildren() + "</li>" +
                    "</ul>" +
                    "<p>Please keep this confirmation code handy for your reference.</p>" +
                    "<p>If you have any questions or need further assistance, do not hesitate to contact us. We are here to help you and ensure you have a wonderful experience.</p>" +
                    "<p>Thank you for choosing our hotel. We look forward to welcoming you soon!</p>" +
                    "<p>Warm regards,<br/>The Hotel Booking Team<br/>Contact Us: [Penacony Hotel Team]<br/>Website: [Penacony Hotel]</p>" +
                    "</body></html>";
        } else if ("cancellation".equals(emailType)) {
            subject = "Your Booking Cancellation - Contact Us for Refund";
            body = "<html><body style='font-size: 16px;'>" +
                    "<div style='text-align: center;'>" +
                    "<img src='cid:penaconyLogo' style='max-width: 100%; height: auto;'/>" +
                    "<hr style='border: 0.5px solid #ccc; width: 80%; margin-top: 10px; margin-bottom: 10px;'/>" +
                    "</div>" +
                    "<p>Dear Valued Guest,</p>" +
                    "<p>We regret to inform you that your booking has been cancelled. If you have any questions or need assistance with your refund, please do not hesitate to contact us.</p>" +
                    "<p>Here are your booking details:</p>" +
                    "<ul>" +
                    "<li>Confirmation Code: " + confirmationCode + "</li>" +
                    "<li>CheckInDate: " + bookingData.getCheckInDate() + "</li>" +
                    "<li>CheckOutDate: " + bookingData.getCheckOutDate() + "</li>" +
                    "<li>NumOfAdults: " + bookingData.getNumOfAdults() + "</li>" +
                    "<li>NumOfChildren: " + bookingData.getNumofChildren() + "</li>" +
                    "</ul>" +
                    "<p>We apologize for any inconvenience this may cause and appreciate your understanding.</p>" +
                    "<p>Thank you for considering our hotel. We hope to have the opportunity to serve you in the future.</p>" +
                    "<p>Warm regards,<br/>The Hotel Booking Team<br/>Contact Us: [Penacony Hotel Team]<br/>Website: [Penacony Hotel]</p>" +
                    "</body></html>";
        } else {
            return ResponseEntity.badRequest().body("Invalid email type");
        }

        helper.setTo(guestEmail);
        helper.setSubject(subject);
        helper.setText(body, true);

        // Đính kèm hình ảnh inline
        FileSystemResource imageResource = new FileSystemResource("src/main/resources/static/images/PenaconyHotelLogo.png");
        helper.addInline("penaconyLogo", imageResource);

        // Gửi email
        mailSender.send(mimeMessage);

        // Trả về phản hồi cho client
        return ResponseEntity.ok("Email sent to " + guestEmail);
    }
}
