package com.shopnest.backend.controller;

import com.shopnest.backend.model.Product;
import com.shopnest.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable @NonNull String category) {
        return productRepository.findByCategory(category);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable @NonNull String id) {
        return productRepository.findById(id).orElse(null);
    }
}
