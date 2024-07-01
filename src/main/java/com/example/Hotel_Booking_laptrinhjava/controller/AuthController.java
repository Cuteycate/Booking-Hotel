package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.model.User;
import com.example.Hotel_Booking_laptrinhjava.request.LoginRequest;
import com.example.Hotel_Booking_laptrinhjava.response.JwtResponse;
import com.example.Hotel_Booking_laptrinhjava.security.jwt.JwtUtils;
import com.example.Hotel_Booking_laptrinhjava.security.user.HotelUserDetails;
import com.example.Hotel_Booking_laptrinhjava.service.FacebookService;
import com.example.Hotel_Booking_laptrinhjava.service.GoogleService;
import com.example.Hotel_Booking_laptrinhjava.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IUserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final GoogleService googleService;
    private final FacebookService facebookService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully and verification email sent");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user: " + e.getMessage());
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        if (userService.verifyEmail(token)) {
            return ResponseEntity.ok("Email verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
        }
    }
    @GetMapping("/change-email")
    public ResponseEntity<String> verifyNewEmail(@RequestParam("token") String token, @RequestParam("newEmail") String newEmail) {
        if (userService.verifyNewEmail(token, newEmail)) {
            return ResponseEntity.ok("New email verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
        }
    }



    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtTokenForUser(authentication);
        HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority).toList();

        User user = userService.getUser(request.getEmail());
        boolean isVerified = user.isVerified();
        return ResponseEntity.ok(new JwtResponse(
                userDetails.getId(),
                userDetails.getEmail(),
                jwt,
                roles,
                isVerified));
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody Map<String, String> request) {
        String googleToken = request.get("token");
        User googleUser = googleService.verifyAndGetUser(googleToken);

        if (googleUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
        }

        User existingUser = userService.getUser(googleUser.getEmail());
        if (existingUser == null) {
            userService.registerUser(googleUser); // Register the user if they don't exist
        }

        // Build HotelUserDetails
        HotelUserDetails userDetails = HotelUserDetails.buildUserDetails(googleUser);

        // Create authentication token
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        // Generate JWT token
        String jwt = jwtUtils.generateJwtTokenForUser(authenticationToken);

        // Return JWT response
        return ResponseEntity.ok(new JwtResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                jwt,
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList(),
                googleUser.isVerified())); // Include verification status
    }

    @PostMapping("/facebook")
    public ResponseEntity<?> authenticateFacebookUser(@RequestBody Map<String, String> request) {
        String facebookToken = request.get("token");
        User facebookUser = facebookService.verifyAndGetUser(facebookToken);

        if (facebookUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Facebook token");
        }

        User existingUser = userService.getUser(facebookUser.getEmail());
        if (existingUser == null) {
            userService.registerUser(facebookUser); // Register the user if they don't exist
        }

        // Build HotelUserDetails
        HotelUserDetails userDetails = HotelUserDetails.buildUserDetails(facebookUser);

        // Create authentication token
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        // Generate JWT token
        String jwt = jwtUtils.generateJwtTokenForUser(authenticationToken);

        // Return JWT response
        return ResponseEntity.ok(new JwtResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                jwt,
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList(),
                facebookUser.isVerified())); // Include verification status
    }
}
