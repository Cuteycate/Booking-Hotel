package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.exception.UserAlreadyExistsException;
import com.example.Hotel_Booking_laptrinhjava.model.Role;
import com.example.Hotel_Booking_laptrinhjava.model.User;
import com.example.Hotel_Booking_laptrinhjava.model.VerificationToken;
import com.example.Hotel_Booking_laptrinhjava.repository.BookingRepository;
import com.example.Hotel_Booking_laptrinhjava.repository.RoleRepository;
import com.example.Hotel_Booking_laptrinhjava.repository.UserRepository;
import com.example.Hotel_Booking_laptrinhjava.repository.VerificationTokenRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final BookingRepository bookingRepository;
    private final VerificationTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    @Autowired
    private final RoleService roleService;
    @Value("${app.url}")
    private String appUrl;
    @Override
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email đã từng lập tài khoản");
        }

        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        Role userRole = roleRepository.findByName("ROLE_USER").get();
        user.setRoles(Collections.singletonList(userRole));
        User savedUser = userRepository.save(user);

        if (user.getGoogleId() == null) {
            sendVerificationEmail(savedUser);
        }

        return savedUser;
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }
    @Transactional
    @Override
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        tokenRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
    }

    @Override
    public User getUser(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


    @Override
    public User getUserById(Long userId) {
        // Implement logic to fetch user by ID from database or repository
        // Example (assuming UserRepository or similar):
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }

    @Transactional
    @Override
    public User updateUser(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        // Update first name and last name
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());

        if (!user.getEmail().equals(userDetails.getEmail())) {
            sendChangeEmail(user, userDetails.getEmail());
            userRepository.save(user);
            return user;
        }
        String oldEmail = user.getEmail();
        user.setEmail(userDetails.getEmail());
        User updatedUser = userRepository.save(user);
        bookingRepository.updateBookingsEmail(oldEmail, userDetails.getEmail());
        return updatedUser;
    }
    //Gửi email xác thực đăng ký
    @Override
    public void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);

        String verificationUrl = appUrl + "/auth/verify-email?token=" + token;

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(user.getEmail());
            helper.setSubject("Xác thực Email");
            String htmlContent = "<html><body style='font-size: 16px;'>" +
                    "<div style='text-align: center;'>" +
                    "<img src='cid:penaconyLogo' style='max-width: 100%; height: auto;'/>" +
                    "<hr style='border: 0.5px solid #ccc; width: 80%; margin-top: 10px; margin-bottom: 10px;'/>" +
                    "</div>" +
                    "<p style='text-align: center;'>Xin chào mừng đến với Penacony ! Để đăng nhập và sử dụng các dịch vụ đặt phòng của chúng tôi xin hãy nhấp đường link phía dưới. Xin trân trọng cảm ơn và chào mừng đến với Penacony !</p>" +
                    "<p style='text-align: center;'><a href='" + verificationUrl + "'>" + verificationUrl + "</a></p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);

            ClassPathResource imageResource = new ClassPathResource("static/images/PenaconyHotelLogo.png");
            helper.addInline("penaconyLogo", imageResource);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //Xác thực Email khi mới đăng nhâ
    @Override
    public boolean verifyEmail(String token) {
        Optional<VerificationToken> verificationTokenOptional = tokenRepository.findByToken(token);
        if (!verificationTokenOptional.isPresent()) {
            return false;
        }
        VerificationToken verificationToken = verificationTokenOptional.get();
        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);
        tokenRepository.delete(verificationToken);
        return true;
    }
    //Xác Thực Email mới
    public boolean verifyNewEmail(String token, String newEmail) {
        Optional<VerificationToken> verificationTokenOptional = tokenRepository.findByToken(token);
        if (!verificationTokenOptional.isPresent()) {
            return false;
        }
        VerificationToken verificationToken = verificationTokenOptional.get();
        User user = verificationToken.getUser();
        String oldEmail = user.getEmail();
        user.setEmail(newEmail);
        userRepository.save(user);
        tokenRepository.delete(verificationToken);
        bookingRepository.updateBookingsEmail(oldEmail, newEmail);
        return true;
    }
    //Gửi email đổi Email
    public void sendChangeEmail(User user, String newEmail) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);
        String changeEmailUrl = appUrl + "/auth/change-email?token=" + token + "&newEmail=" + newEmail;
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(user.getEmail()); // send to current email
            helper.setSubject("Xác nhận đổi Email");

            String htmlContent = "<html><body style='font-size: 16px;'>" +
                    "<div style='text-align: center;'>" +
                    "<img src='cid:penaconyLogo' style='max-width: 100%; height: auto;'/>" +
                    "<hr style='border: 0.5px solid #ccc; width: 80%; margin-top: 10px; margin-bottom: 10px;'/>" +
                    "</div>" +
                    "<p style='text-align: center;'>Xin chào mừng đến Penacony Hotel, Hãy Click link dưới đây để xác nhận đổi Email, Nếu bạn không làm việc này xin đừng nhấn vào link, xin trân trọng cảm ơn:</p>" +
                    "<p style='text-align: center;'><a href='" + changeEmailUrl + "'>" + changeEmailUrl + "</a></p>" +
                    "</body></html>";
            helper.setText(htmlContent, true);

            ClassPathResource imageResource = new ClassPathResource("static/images/PenaconyHotelLogo.png");
            helper.addInline("penaconyLogo", imageResource);

            mailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
