package com.shopnest.backend.controller;

import com.shopnest.backend.model.Product;
import com.shopnest.backend.model.Order;
import com.shopnest.backend.model.User;
import com.shopnest.backend.repository.ProductRepository;
import com.shopnest.backend.repository.OrderRepository;
import com.shopnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Product Management ---

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody @NonNull Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable @NonNull String id,
            @RequestBody @NonNull Product productDetails) {
        return productRepository.findById(id)
                .map((@NonNull Product product) -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setCategory(productDetails.getCategory());
                    product.setSubCategory(productDetails.getSubCategory());
                    product.setGender(productDetails.getGender());
                    product.setSizes(productDetails.getSizes());
                    product.setImageUrl(productDetails.getImageUrl());
                    product.setImages(productDetails.getImages());
                    product.setStock(productDetails.getStock());
                    return ResponseEntity.ok(productRepository.save(product));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable @NonNull String id) {
        return productRepository.findById(id)
                .map((@NonNull Product product) -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- Order Management ---

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable @NonNull String id,
            @RequestBody @NonNull String status) {
        return orderRepository.findById(id)
                .map((@NonNull Order order) -> {
                    order.setStatus(status.replace("\"", "")); // Removing quotes if sent as plain string
                    return ResponseEntity.ok(orderRepository.save(order));
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- User Management ---

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long newOrders = orderRepository.countByStatus("PENDING");

        List<Order> orders = orderRepository.findAll();
        double totalSales = orders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("newOrders", newOrders);
        stats.put("totalSales", totalSales);

        // Add recent activity (latest 5 orders)
        List<Order> recentOrders = orders.stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .limit(5)
                .collect(Collectors.toList());
        stats.put("recentActivity", recentOrders);

        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/stats/sales")
    public ResponseEntity<?> resetSales() {
        List<Order> ordersToReset = orderRepository.findAll().stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .collect(Collectors.toList());
        if (ordersToReset != null && !ordersToReset.isEmpty()) {
            orderRepository.deleteAll(ordersToReset);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/stats/orders")
    public ResponseEntity<?> resetOrders() {
        List<Order> ordersToReset = orderRepository.findAll().stream()
                .filter(o -> "PENDING".equals(o.getStatus()))
                .collect(Collectors.toList());
        if (ordersToReset != null && !ordersToReset.isEmpty()) {
            orderRepository.deleteAll(ordersToReset);
        }
        return ResponseEntity.ok().build();
    }
}
