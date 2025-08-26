package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
        List<InsuranceProduct> list = productMapper.selectProductsPaged(0, 100);
        list.forEach(this::injectOutboundUrl);
        return list;
    }

    @Override
    public InsuranceProduct getProduct(int productId) {
        InsuranceProduct p = productMapper.selectProductById(productId);
        injectOutboundUrl(p);
        return p;
    }

    @Override
    public InsuranceProduct getProductById(int productId) {
        InsuranceProduct p = productMapper.selectProductById(productId);
        injectOutboundUrl(p);
        return p;
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
        List<InsuranceProduct> list = productMapper.selectProductsPaged(offset, limit);
        list.forEach(this::injectOutboundUrl);
        return list;
    }

    @Override
    public int getTotalCount() {
        return productMapper.countAllProducts();
    }

    @Override
    public List<InsuranceProduct> getFilteredProducts(String species, String company, Integer sponsored, int offset, int limit) {
        List<InsuranceProduct> list = productMapper.selectFilteredProducts(species, company, sponsored, offset, limit);
        list.forEach(this::injectOutboundUrl);   // ✅ 목록에도 주입
        return list;
    }
    
    @Override
    public int countFilteredProducts(String species, String company, Integer sponsored) {
        return productMapper.countFilteredProducts(species, company, sponsored);
    }

    // ──────────────────────────
    // 내부 헬퍼들
    // ──────────────────────────
    private void injectOutboundUrl(InsuranceProduct p) {
        if (p == null) {
            return;
        }
        // applyUrl이 있으면 그것을, 없으면 homepageUrl을 최종 이동 링크로 사용합니다.
        String base = StringUtils.hasText(p.getApplyUrl()) ? p.getApplyUrl() : p.getHomepageUrl();
        p.setOutboundApplyUrl(base);
    }
}
