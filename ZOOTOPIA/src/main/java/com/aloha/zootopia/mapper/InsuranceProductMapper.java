package com.aloha.zootopia.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.zootopia.domain.InsuranceProduct;

@Mapper
public interface InsuranceProductMapper {
    
    void insertProduct(InsuranceProduct product);
    List<InsuranceProduct> selectAllProducts();
    InsuranceProduct selectProductById(int productId);
    void updateProduct(InsuranceProduct product);
    void deleteProduct(int productId);

    List<InsuranceProduct> selectProductsPaged(int offset, int size);
    int countAllProducts();

    List<InsuranceProduct> selectFilteredProducts(Map<String, Object> filters);
    int countFilteredProducts(Map<String, Object> filters);
}