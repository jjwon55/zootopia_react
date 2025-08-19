package com.aloha.zootopia.domain;

public class Order {
    private Long id;
    private String orderCode; // 가맹점 주문번호
    private Long userId;
    private Long productId;
    private String productName;
    private int price;
    private String status; // "배송중" 또는 "배달 완료"
    private String payTid; // 결제 TID
    private String image;

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPayTid() { return payTid; }
    public void setPayTid(String payTid) { this.payTid = payTid; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
