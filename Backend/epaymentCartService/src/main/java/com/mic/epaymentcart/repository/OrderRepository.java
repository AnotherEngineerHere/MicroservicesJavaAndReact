package com.mic.epaymentcart.repository;

import com.mic.epaymentcart.entity.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	 List<Order> findByCart_UserId(Long userId);
}
