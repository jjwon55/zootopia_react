package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

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
        if (p == null) return;
        p.setOutboundApplyUrl(buildApplyUrl(p)); // ← DB 컬럼 아님(응답용)
    }

    private String buildApplyUrl(InsuranceProduct p) {
        String base = StringUtils.hasText(p.getApplyUrl()) ? p.getApplyUrl() : p.getHomepageUrl();
        if (!StringUtils.hasText(base)) return null;

        UriComponentsBuilder b = UriComponentsBuilder.fromUriString(base);
        if (StringUtils.hasText(p.getPartnerCode())) b.queryParam("ref", p.getPartnerCode());
        if (StringUtils.hasText(p.getUtmSource()))  b.queryParam("utm_source", p.getUtmSource());
        if (StringUtils.hasText(p.getUtmMedium()))  b.queryParam("utm_medium", p.getUtmMedium());
        if (StringUtils.hasText(p.getUtmCampaign()))b.queryParam("utm_campaign", p.getUtmCampaign());
        return b.build(true).toUriString();
    }
}