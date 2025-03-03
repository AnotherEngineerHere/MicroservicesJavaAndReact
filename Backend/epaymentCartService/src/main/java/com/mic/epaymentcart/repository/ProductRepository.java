package com.mic.epaymentcart.repository;

import com.mic.epaymentcart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}