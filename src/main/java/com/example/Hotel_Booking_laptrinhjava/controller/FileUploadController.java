package com.example.Hotel_Booking_laptrinhjava.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("upload") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload.");
            }

            // Save the file locally
            byte[] bytes = file.getBytes();
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.write(path, bytes);

            // Return URL of the uploaded file
            String fileDownloadUri = "http://localhost:9192/uploads/" + file.getOriginalFilename();
            return ResponseEntity.ok(fileDownloadUri);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not upload the file.");
        }
    }
}
