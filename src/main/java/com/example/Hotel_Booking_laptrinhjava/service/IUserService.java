package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.model.User;
import jakarta.transaction.Transactional;

import java.util.List;

public interface IUserService {
    User registerUser (User user);
    List<User> getUsers();

    void deleteUser(String email);

    User getUser(String email);


    User getUserById(Long userId);

    @Transactional
    User updateUser(Long userId, User userDetails);
}
