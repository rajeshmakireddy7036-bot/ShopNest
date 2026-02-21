package com.shopnest.backend.controller;

import com.shopnest.backend.model.User;
import com.shopnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.shopnest.backend.config.JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @NonNull User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        }

        // --- PASSWORD HASHING ---
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save new user to the database
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @NonNull User loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        // --- PASSWORD VERIFICATION ---
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            String jwt = jwtUtils.generateJwtToken(user.get().getEmail());

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", jwt);
            response.put("user", user.get());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Error: Invalid email or password!");
        }
    }
}
