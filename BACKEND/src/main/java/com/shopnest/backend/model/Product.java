package com.shopnest.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String subCategory;
    private String gender; // New field for Men/Women
    private java.util.List<String> sizes;
    private String imageUrl;
    private java.util.List<String> images; // Multiple images list
    private Integer stock;
}
