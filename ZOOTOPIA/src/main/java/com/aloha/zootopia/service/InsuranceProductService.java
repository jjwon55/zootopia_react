package com.aloha.zootopia.service;

import java.util.List;
import java.util.Map;

import com.aloha.zootopia.domain.InsuranceProduct;

public interface InsuranceProductService {
    
    void registerProduct(InsuranceProduct product);      // 등록
    List<InsuranceProduct> listProducts();               // 목록
    InsuranceProduct getProduct(int productId);          // 상세
    InsuranceProduct getProductById(int productId);
    void updateProduct(InsuranceProduct product);        // 수정
    void deleteProduct(int productId);                   // 삭제

    List<InsuranceProduct> getProductsPaged(int offset, int size);
    int getTotalCount();

    List<InsuranceProduct> getFilteredProducts(Map<String, Object> filters, int offset, int limit);
    int countFilteredProducts(Map<String, Object> filters);
}
