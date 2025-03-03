package com.mic.epaymentcart.service;

import com.mic.epaymentcart.entity.Cart;
import com.mic.epaymentcart.entity.CartItem;
import com.mic.epaymentcart.entity.Order;
import com.mic.epaymentcart.entity.Product;
import com.mic.epaymentcart.repository.CartRepository;
import com.mic.epaymentcart.repository.OrderRepository;
import com.mic.epaymentcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public CartService(CartRepository cartRepository, ProductRepository productRepository, OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public List<CartItem> getCartItems(Long cartId) {
        Optional<Cart> cart = cartRepository.findById(cartId);
        return cart.map(Cart::getItems).orElse(null);
    }
    
    @Transactional
    public Cart createCart() {
        Cart cart = new Cart();
        cart.setItems(new ArrayList()); // Aseguramos que la lista no sea nula
        return cartRepository.save(cart);
    }


    @Transactional
    public Cart addProductToCart(Long cartId, Long productId, int quantity) {
        Optional<Cart> cartOptional = cartRepository.findById(cartId);
        Optional<Product> productOptional = productRepository.findById(productId);

        if (productOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            // Si el producto ya está en el carrito, incrementamos la cantidad
            Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
            if (existingItem.isPresent()) {
                existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setProduct(productOptional.get());
                cartItem.setQuantity(quantity);
                cartItem.setCart(cart);
                cart.getItems().add(cartItem);
            }
            return cartRepository.save(cart);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found");
        }
    }

    @Transactional
    public void removeProductFromCart(Long cartId, Long productId) {
        Optional<Cart> cartOptional = cartRepository.findById(cartId);
        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
            cartRepository.save(cart);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found");
        }
    }
    
    @Transactional
    public Order checkoutCart(Long cartId) {
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (optionalCart.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found");
        }
        Cart cart = optionalCart.get();
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }
        // Crear la orden
        Order order = new Order();
        order.setCart(cart);
        order.setOrderDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        // Vaciar el carrito después de completar la compra
        cart.getItems().clear();
        cartRepository.save(cart);
        return savedOrder;
    }
}
