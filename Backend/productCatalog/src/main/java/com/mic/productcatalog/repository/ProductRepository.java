package com.mic.productcatalog.repository;

import com.mic.productcatalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

	boolean existsByName(String name);
}