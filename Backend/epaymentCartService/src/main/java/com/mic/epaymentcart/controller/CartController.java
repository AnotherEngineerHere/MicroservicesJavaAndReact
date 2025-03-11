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

    @GetMapping("/{cartId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId){
        List<CartItem> items = cartService.getCartItems(cartId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/")
    public ResponseEntity<List<Cart>> getAllCarts(){
        List<Cart> carts = cartService.getCarts();
        return ResponseEntity.ok(carts);
    }


    @PostMapping("/create/{userId}")
    public ResponseEntity<Cart> createCart(@PathVariable Long userId){
        Cart cart = cartService.createCart(userId);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getOrCreateCart(@PathVariable Long userId) {
        Cart cart = cartService.createCart(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{cartId}/add/{productId}")
    public ResponseEntity<Cart> addProductToCart(@PathVariable Long cartId,
                                                 @PathVariable Long productId,
                                                 @RequestParam int quantity){
        Cart cart = cartService.addProductToCart(cartId, productId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{cartId}/remove/{productId}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable Long cartId,
                                                      @PathVariable Long productId){
        cartService.removeProductFromCart(cartId, productId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/removeCart/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId){
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{cartId}/checkout")
    public ResponseEntity<Order> checkoutCart(@PathVariable Long cartId){
        Order order = cartService.checkout(cartId);
        return ResponseEntity.ok(order);
    }
}
