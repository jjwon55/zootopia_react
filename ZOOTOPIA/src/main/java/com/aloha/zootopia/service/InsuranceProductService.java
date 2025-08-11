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

    List<InsuranceProduct> getProductsPaged(int offset, int size);
    int getTotalCount();

    // ✅ 타입 파라미터로 변경
    List<InsuranceProduct> getFilteredProducts(String species, String company, int offset, int limit);
    int countFilteredProducts(String species, String company);
}