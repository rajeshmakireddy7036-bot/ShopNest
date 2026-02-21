package com.shopnest.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String role; // ROLE_USER, ROLE_ADMIN
    private java.util.List<CartItem> cart;
    private java.util.List<Product> wishlist;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItem {
        private Product product;
        private Integer quantity;
        private String selectedSize;
    }
}
