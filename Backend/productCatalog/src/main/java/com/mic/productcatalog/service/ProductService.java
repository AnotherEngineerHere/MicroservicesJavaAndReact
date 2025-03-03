package com.mic.productcatalog.service;

import com.mic.productcatalog.entity.Product;
import com.mic.productcatalog.repository.ProductRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    
    @Transactional
    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setPrice(product.getPrice());
        
        try {
            return productRepository.save(existingProduct);
        } catch (OptimisticLockingFailureException e) {
            throw new RuntimeException("Error al actualizar el producto debido a un conflicto de concurrencia", e);
        }
    }


    @Transactional
    public Product saveProduct(Product product) {
        try {
            return productRepository.save(product);
        } catch (OptimisticLockingFailureException e) {
            throw new RuntimeException("Error al guardar el producto debido a un conflicto de concurrencia", e);
        }
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}