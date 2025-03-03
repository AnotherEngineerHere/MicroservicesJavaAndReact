package com.mic.epaymentcart.repository;

import com.mic.epaymentcart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}