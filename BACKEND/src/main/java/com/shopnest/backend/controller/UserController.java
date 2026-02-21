package com.shopnest.backend.controller;

import com.shopnest.backend.model.User;
import com.shopnest.backend.model.Product;
import com.shopnest.backend.model.User.CartItem;
import com.shopnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.Optional;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable @NonNull String id,
            @RequestBody @NonNull User updatedUser) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // --- PROFILE UPDATE LOGIC ---
            user.setFullName(updatedUser.getFullName());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setAddress(updatedUser.getAddress());

            // Check if username/email already exists for other users
            if (updatedUser.getUsername() != null && !updatedUser.getUsername().equals(user.getUsername())) {
                if (userRepository.existsByUsername(updatedUser.getUsername())) {
                    return ResponseEntity.badRequest().body("Error: Username is already taken!");
                }
                user.setUsername(updatedUser.getUsername());
            }

            userRepository.save(user);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable @NonNull String id,
            @RequestBody java.util.Map<String, String> passwordRequest) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");

            // --- BCrypt PASSWORD VERIFICATION ---
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Error: Current password is incorrect!");
            }

            // --- BCrypt PASSWORD ENCODING ---
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/cart")
    public ResponseEntity<?> getCart(@PathVariable @NonNull String id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user.getCart()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/cart")
    public ResponseEntity<?> syncCart(@PathVariable @NonNull String id,
            @RequestBody List<CartItem> cart) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setCart(cart);
            userRepository.save(user);
            return ResponseEntity.ok(user.getCart());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/wishlist")
    public ResponseEntity<?> getWishlist(@PathVariable @NonNull String id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user.getWishlist()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/wishlist")
    public ResponseEntity<?> syncWishlist(@PathVariable @NonNull String id,
            @RequestBody List<Product> wishlist) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setWishlist(wishlist);
            userRepository.save(user);
            return ResponseEntity.ok(user.getWishlist());
        }
        return ResponseEntity.notFound().build();
    }
}
