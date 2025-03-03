package com.mic.epaymentcart.controller;

import com.mic.epaymentcart.entity.Cart;
import com.mic.epaymentcart.entity.CartItem;
import com.mic.epaymentcart.entity.Order;
import com.mic.epaymentcart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Devuelve los items de un carrito específico
    @GetMapping("/{cartId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartService.getCartItems(cartId));
    }

    // Devuelve todos los carritos
    @GetMapping("/")
    public ResponseEntity<List<Cart>> getAllCarts() {
        List<Cart> carts = cartService.getCarts();
        return new ResponseEntity<>(carts, HttpStatus.OK);
    }

    // Crea un carrito nuevo
    @PostMapping("/")
    public ResponseEntity<Cart> createCart() {
        return ResponseEntity.ok(cartService.createCart());
    }

    // Agrega un producto a un carrito dado
    @PostMapping("/{cartId}/add/{productId}")
    public ResponseEntity<Cart> addProductToCart(@PathVariable Long cartId,
                                                 @PathVariable Long productId,
                                                 @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.addProductToCart(cartId, productId, quantity));
    }

    // Elimina un producto de un carrito dado
    @DeleteMapping("/{cartId}/remove/{productId}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable Long cartId,
                                                      @PathVariable Long productId) {
        cartService.removeProductFromCart(cartId, productId);
        return ResponseEntity.noContent().build();
    }
    
    // Endpoint para realizar el checkout del carrito y crear una orden
    @PostMapping("/{cartId}/checkout")
    public ResponseEntity<Order> checkoutCart(@PathVariable Long cartId) {
        Order order = cartService.checkoutCart(cartId);
        return ResponseEntity.ok(order);
    }
}
