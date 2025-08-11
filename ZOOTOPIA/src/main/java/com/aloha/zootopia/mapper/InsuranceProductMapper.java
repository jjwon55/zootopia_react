package com.aloha.zootopia.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.zootopia.domain.InsuranceProduct;

@Mapper
public interface InsuranceProductMapper {

    void insertProduct(InsuranceProduct product);
    InsuranceProduct selectProductById(@Param("productId") int productId);
    void updateProduct(InsuranceProduct product);
    void deleteProduct(@Param("productId") int productId);

    // (선택) 기본 페이징 전체목록
    List<InsuranceProduct> selectProductsPaged(@Param("offset") int offset, @Param("size") int size);
    int countAllProducts();

    // ✅ 필터 + 페이징 (species/company는 null 또는 빈문자면 무시)
    List<InsuranceProduct> selectFilteredProducts(
            @Param("species") String species,
            @Param("company") String company,
            @Param("offset") int offset,
            @Param("limit") int limit);

    int countFilteredProducts(
            @Param("species") String species,
            @Param("company") String company);
}