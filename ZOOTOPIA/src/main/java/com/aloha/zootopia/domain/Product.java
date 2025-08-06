package com.aloha.zootopia.domain;

import java.util.Date;

public class Product {
    private int no;                // 상품번호
    private String name;           // 상품명
    private String category;       // 카테고리 (개, 고양이, 새, 물고기 등)
    private String description;    // 상품 설명
    private int price;            // 가격
    private String imageUrl;      // 이미지 URL
    private String status;        // 상태 (판매중, 품절 등)
    private Date regDate;         // 등록일
    private Date updDate;         // 수정일
    private int views;            // 조회수
    private int likes;            // 좋아요 수
    private int dislikes;         // 싫어요 수
    private int stock;            // 재고
    private double rating;        // 평균 평점
    private int reviewCount;      // 리뷰 개수

    // 생성자
    public Product() {}

    public Product(String name, String category, String description, int price, String imageUrl) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.status = "판매중";
        this.regDate = new Date();
        this.updDate = new Date();
        this.views = 0;
        this.likes = 0;
        this.stock = 0;
    }

    // Getter & Setter
    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }

    public Date getUpdDate() {
        return updDate;
    }

    public void setUpdDate(Date updDate) {
        this.updDate = updDate;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    @Override
    public String toString() {
        return "Product{" +
                "no=" + no +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", imageUrl='" + imageUrl + '\'' +
                ", status='" + status + '\'' +
                ", regDate=" + regDate +
                ", updDate=" + updDate +
                ", views=" + views +
                ", likes=" + likes +
                ", dislikes=" + dislikes +
                ", stock=" + stock +
                ", rating=" + rating +
                ", reviewCount=" + reviewCount +
                '}';
    }
}
