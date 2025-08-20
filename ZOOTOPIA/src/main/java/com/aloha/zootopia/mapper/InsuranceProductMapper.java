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

  List<InsuranceProduct> selectProductsPaged(@Param("offset") int offset, @Param("limit") int limit);
  int countAllProducts();

  // ✅ 순서 통일: species, company, sponsored, offset, limit
  List<InsuranceProduct> selectFilteredProducts(
      @Param("species") String species,
      @Param("company") String company,
      @Param("sponsored") Integer sponsored,
      @Param("offset") int offset,
      @Param("limit") int limit
  );

  int countFilteredProducts(
      @Param("species") String species,
      @Param("company") String company,
      @Param("sponsored") Integer sponsored
  );
}