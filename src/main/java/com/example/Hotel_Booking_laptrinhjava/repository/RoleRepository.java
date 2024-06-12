package com.example.Hotel_Booking_laptrinhjava.repository;


import com.example.Hotel_Booking_laptrinhjava.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(String role);

    boolean existsByName(String roleName);
}
