package com.aloha.zootopia.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.aloha.zootopia.domain.Product;

@Mapper
public interface ProductMapper {
    
    // 상품 목록 조회 (페이징)
    List<Product> selectByPage(@Param("offset") int offset, @Param("size") int size);
    
    // 카테고리별 상품 목록 조회 (페이징)
    List<Product> selectByCategoryAndPage(@Param("category") String category, 
                                         @Param("offset") int offset, 
                                         @Param("size") int size);
    
    // 전체 상품 개수
    int selectTotal();
    
    // 카테고리별 상품 개수
    int selectTotalByCategory(@Param("category") String category);
    
    // 상품 상세 조회
    Product selectByNo(@Param("no") int no);
    
    // 상품 등록
    int insert(Product product);
    
    // 상품 수정
    int update(Product product);
    
    // 상품 삭제
    int delete(@Param("no") int no);
    
    // 조회수 증가
    int updateViews(@Param("no") int no);
    
    // 좋아요 수 증가
    int updateLikes(@Param("no") int no);
    
    // 싫어요 수 증가
    int updateDislikes(@Param("no") int no);
    
    // 검색 (상품명)
    List<Product> selectByNameAndPage(@Param("name") String name, 
                                     @Param("offset") int offset, 
                                     @Param("size") int size);
    
    // 검색 결과 개수
    int selectTotalByName(@Param("name") String name);
}
