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
    
    public List<Cart> getCarts() {
        return cartRepository.findAll();
    }

    @Transactional
    public Cart createCart(Long userId) {
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        if(existingCart.isPresent()){
            return existingCart.get();
        }
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart addProductToCart(Long cartId, Long productId, int quantity) {
        Optional<Cart> cartOptional = cartRepository.findById(cartId);
        Optional<Product> productOptional = productRepository.findById(productId);

        if (productOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        Product product = productOptional.get();
        if(product.getStock() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock");
        }

        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
            if (existingItem.isPresent()) {
                int newQuantity = existingItem.get().getQuantity() + quantity;
                if(product.getStock() < newQuantity) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for additional quantity");
                }
                existingItem.get().setQuantity(newQuantity);
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
                cartItem.setCart(cart);
                cart.getItems().add(cartItem);
            }
            return cartRepository.save(cart);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found");
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
        
        double total = 0.0;
        // Actualiza el stock y calcula el total
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for product: " + product.getName());
            }
            total += product.getPrice() * item.getQuantity();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }
        
        // Crea la orden asociada al carrito
        Order order = new Order();
        order.setCart(cart);
        order.setOrderDate(LocalDateTime.now());
        order.setTotal(total);
        Order savedOrder = orderRepository.save(order);
        
        // Borra el carrito para evitar duplicados en la referencia de la orden
        cartRepository.delete(cart);
        
        return savedOrder;
    }

}
