package com.shopnest.backend.config;

import com.shopnest.backend.model.Product;
import com.shopnest.backend.model.User;
import com.shopnest.backend.repository.ProductRepository;
import com.shopnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedProducts();
    }

    @SuppressWarnings("null")
    private void seedAdmin() {
        // Seed an admin if no admin exists
        if (userRepository.findByEmail("admin@shopnest.com").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .fullName("ShopNest Administrator")
                    .email("admin@shopnest.com")
                    .password("admin1234") // In production, this should be encoded
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin account created: admin@shopnest.com / admin1234");
        }
    }

    @SuppressWarnings("null")
    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> initialProducts = Arrays.asList(
                    // Men
                    new Product(null, "Classic Oxford Shirt", "Timeless white oxford shirt for a sharp look.", 59.99,
                            "Men", "Shirts", "Men", Arrays.asList("S", "M", "L", "XL"),
                            "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1000&auto=format&fit=crop",
                            null, 50),
                    new Product(null, "Slim Fit Chinos", "Comfortable and stylish chinos for any occasion.", 49.99,
                            "Men", "Pants", "Men", Arrays.asList("30", "32", "34", "36"),
                            "https://images.unsplash.com/photo-1473963456453-15764f69766d?q=80&w=1000&auto=format&fit=crop",
                            null, 40),
                    new Product(null, "Heavyweight Hoodie", "Premium cotton hoodie for maximum warmth.", 79.99, "Men",
                            "Hoodies", "Men", Arrays.asList("M", "L", "XL"),
                            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
                            null, 30),

                    // Women
                    new Product(null, "Floral Maxi Dress", "Elegant flowy dress perfect for spring gardens.", 89.99,
                            "Women", "Dresses", "Women", Arrays.asList("XS", "S", "M", "L"),
                            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
                            null, 25),
                    new Product(null, "Silk Blouse", "Luxurious silk blouse for the modern professional.", 120.00,
                            "Women", "Tops", "Women", Arrays.asList("S", "M", "L"),
                            "https://images.unsplash.com/photo-1551163949-c8180ffc728e?q=80&w=1000&auto=format&fit=crop",
                            null, 15),
                    new Product(null, "High-Waisted Jeans", "Classic denim that complements every silhouette.", 75.00,
                            "Women", "Bottoms", "Women", Arrays.asList("24", "26", "28", "30"),
                            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
                            null, 35),

                    // Accessories
                    new Product(null, "Gold Minimalist Ring", "14k gold plated ring for everyday elegance.", 45.00,
                            "Accessories", "Jewelry", "Unisex", Arrays.asList("One Size"),
                            "https://images.unsplash.com/photo-1605100804763-247f67b3f41e?q=80&w=1000&auto=format&fit=crop",
                            null, 100),
                    new Product(null, "Leather Tote Bag", "Spacious hand-crafted leather bag.", 150.00, "Accessories",
                            "Bags", "Women", Arrays.asList("One Size"),
                            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
                            null, 20),
                    new Product(null, "Classic Chronograph Watch", "Sleek stainless steel timepiece.", 199.99,
                            "Accessories", "Watches", "Men", Arrays.asList("One Size"),
                            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop",
                            null, 15),

                    // Footwear
                    new Product(null, "Urban Sneakers", "Minimalist white leather sneakers.", 110.00, "Footwear",
                            "Sneakers", "Unisex", Arrays.asList("7", "8", "9", "10", "11"),
                            "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
                            null, 60),
                    new Product(null, "Chelsea Boots", "Genuine suede desert boots.", 140.00, "Footwear", "Boots",
                            "Men", Arrays.asList("8", "9", "10", "11"),
                            "https://images.unsplash.com/photo-1638247025967-b4e38f757b40?q=80&w=1000&auto=format&fit=crop",
                            null, 25),
                    new Product(null, "Stiletto Heels", "Timeless black pumps for formal occasions.", 125.00,
                            "Footwear", "Heels", "Women", Arrays.asList("6", "7", "8", "9"),
                            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
                            null, 20));

            productRepository.saveAll(initialProducts);
            System.out.println("Sample products seeded successfully for Men, Women, Accessories, and Footwear.");
        }
    }
}
