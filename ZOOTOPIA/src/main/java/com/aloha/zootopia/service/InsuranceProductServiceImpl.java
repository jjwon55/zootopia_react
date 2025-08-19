package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.zootopia.domain.InsuranceProduct;
import com.aloha.zootopia.mapper.InsuranceProductMapper;

@Service
public class InsuranceProductServiceImpl implements InsuranceProductService {

    @Autowired
    private InsuranceProductMapper productMapper;

    @Transactional
    @Override
    public void registerProduct(InsuranceProduct product) {
        productMapper.insertProduct(product);
    }

    @Override
    public List<InsuranceProduct> listProducts() {
        return productMapper.selectProductsPaged(0, 100); // 필요시 미사용
    }

    @Override
    public InsuranceProduct getProduct(int productId) {
        return productMapper.selectProductById(productId);
    }

    @Override
    public InsuranceProduct getProductById(int productId) {
        return productMapper.selectProductById(productId);
    }

    @Transactional
    @Override
    public void updateProduct(InsuranceProduct product) {
        productMapper.updateProduct(product);
    }

    @Transactional
    @Override
    public void deleteProduct(int productId) {
        productMapper.deleteProduct(productId);
    }

    @Override
    public List<InsuranceProduct> getProductsPaged(int offset, int limit) {
        return productMapper.selectProductsPaged(offset, limit);
    }

    @Override
    public int getTotalCount() {
        return productMapper.countAllProducts();
    }

    // ✅ 필터 + 페이징 (limit/offset 이름과 맞춤)
    @Override
    public List<InsuranceProduct> getFilteredProducts(String species, String company, int offset, int limit) {
        return productMapper.selectFilteredProducts(species, company, offset, limit);
    }

    @Override
    public int countFilteredProducts(String species, String company) {
        return productMapper.countFilteredProducts(species, company);
    }
}