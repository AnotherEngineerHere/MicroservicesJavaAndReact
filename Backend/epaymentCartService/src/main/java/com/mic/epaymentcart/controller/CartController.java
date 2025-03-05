package com.mic.epaymentcart.controller;

import com.mic.epaymentcart.entity.Cart;
import com.mic.epaymentcart.entity.CartItem;
import com.mic.epaymentcart.entity.Order;
import com.mic.epaymentcart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Obtener items de un carrito específico
    @GetMapping("/{cartId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId){
        List<CartItem> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }

    // Obtener todos los carritos (si fuera necesario)
    @GetMapping("/")
    public ResponseEntity<List<Cart>> getAllCarts(){
        List<Cart> carts = cartService.getCarts();
        return ResponseEntity.ok(carts);
    }

    // Crear un carrito para un usuario (si no existe)
    @PostMapping("/create/{userId}")
    public ResponseEntity<Cart> createCart(@PathVariable Long userId){
        Cart cart = cartService.createCart(userId);
        return ResponseEntity.ok(cart);
    }

    // Agregar producto al carrito, validando stock
    @PostMapping("/{cartId}/add/{productId}")
    public ResponseEntity<Cart> addProductToCart(@PathVariable Long cartId,
                                                 @PathVariable Long productId,
                                                 @RequestParam int quantity){
        Cart cart = cartService.addProductToCart(cartId, productId, quantity);
        return ResponseEntity.ok(cart);
    }

    // Remover producto del carrito
    @DeleteMapping("/{cartId}/remove/{productId}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable Long cartId,
                                                      @PathVariable Long productId){
        cartService.removeProductFromCart(cartId, productId);
        return ResponseEntity.noContent().build();
    }

    // Realizar checkout del carrito, generando una orden y actualizando stock
    @PostMapping("/{cartId}/checkout")
    public ResponseEntity<Order> checkoutCart(@PathVariable Long cartId){
        Order order = cartService.checkoutCart(cartId);
        return ResponseEntity.ok(order);
    }
}
