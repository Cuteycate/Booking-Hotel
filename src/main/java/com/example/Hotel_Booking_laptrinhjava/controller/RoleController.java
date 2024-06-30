package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.exception.RoleAlreadyExistException;
import com.example.Hotel_Booking_laptrinhjava.model.Role;
import com.example.Hotel_Booking_laptrinhjava.model.User;
import com.example.Hotel_Booking_laptrinhjava.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.FOUND;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {
    private final IRoleService roleService;

    @GetMapping("/all-roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getRoles();
        return ResponseEntity.ok().body(roles);
    }

    @PostMapping("/create-new-role")
    public ResponseEntity<String> createRole(@RequestBody Role theRole) {
        try {
            roleService.createRole(theRole);
            return ResponseEntity.ok("New role created successfully!");
        } catch (RoleAlreadyExistException re) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(re.getMessage());

        }
    }

    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable("roleId") Long roleId) {
        roleService.deleteRole(roleId);
    }

    @PostMapping("/remove-all-users-from-role/{roleId}")
    public Role removeAllUsersFromRole(@PathVariable("roleId") Long roleId) {
        return roleService.removeAllUsersFromRole(roleId);
    }

    @PostMapping("/remove-user-from-role")
    public User removeUserFromRole(
            @RequestParam("userId") Long userId,
            @RequestParam("roleId") Long roleId) {
        return roleService.removeUserFromRole(userId, roleId);
    }

    @PostMapping("/assign-user-to-role")
    public User assignUserToRole(
            @RequestParam("userId") Long userId,
            @RequestParam("roleId") Long roleId) {
        return roleService.assignRoleToUser(userId, roleId);
    }
}
