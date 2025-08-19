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

  // ✅ (limit, offset)로 이름 통일
  List<InsuranceProduct> selectProductsPaged(@Param("offset") int offset, @Param("limit") int limit);

  int countAllProducts();

  // ✅ 필터 + 페이징도 동일
  List<InsuranceProduct> selectFilteredProducts(
      @Param("species") String species,
      @Param("company") String company,
      @Param("offset") int offset,
      @Param("limit") int limit
  );

  int countFilteredProducts(
      @Param("species") String species,
      @Param("company") String company);
}