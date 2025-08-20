package com.aloha.zootopia.service;

import java.util.List;

import com.aloha.zootopia.domain.InsuranceProduct;

public interface InsuranceProductService {

    void registerProduct(InsuranceProduct product);
    List<InsuranceProduct> listProducts();
    InsuranceProduct getProduct(int productId);
    InsuranceProduct getProductById(int productId);
    void updateProduct(InsuranceProduct product);
    void deleteProduct(int productId);

    // 페이징 (offset/limit로 명확화)
    List<InsuranceProduct> getProductsPaged(int offset, int limit);
    int getTotalCount();

    // 필터 + 페이징
    List<InsuranceProduct> getFilteredProducts(String species, String company, Integer sponsored, int offset, int limit);
    int countFilteredProducts(String species, String company, Integer sponsored);

    
}
