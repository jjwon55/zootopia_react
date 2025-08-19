package com.aloha.zootopia.domain;

public class OrderItem {
    private Long id;
    private Long orderId; // FK to orders.id
    private String orderCode; // redundancy for quick lookup
    private Long productId;
    private String productName;
    private int unitPrice;
    private int quantity;
    private int lineTotal; // unitPrice * quantity

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getUnitPrice() { return unitPrice; }
    public void setUnitPrice(int unitPrice) { this.unitPrice = unitPrice; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public int getLineTotal() { return lineTotal; }
    public void setLineTotal(int lineTotal) { this.lineTotal = lineTotal; }
}
