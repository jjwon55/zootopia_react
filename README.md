# zootopia_react
AI3_정규프로젝트 2조

### 반려 동물 커뮤니티 - ZOOTOPIA

![슬라이드 미리보기](./docs/slides/00.png)
<details>
  <summary>📑 발표 자료 펼쳐보기</summary>
  <img src="./docs/slides/01.png" width="900" />
  <img src="./docs/slides/02.png" width="900" />
  <img src="./docs/slides/03.png" width="900" />
  <img src="./docs/slides/04.png" width="900" />
  <img src="./docs/slides/05.png" width="900" />
  <img src="./docs/slides/06.png" width="900" />
  <img src="./docs/slides/07.png" width="900" />
  <img src="./docs/slides/08.png" width="900" />
  <img src="./docs/slides/09.png" width="900" />
  <img src="./docs/slides/10.png" width="900" />
  <img src="./docs/slides/11.png" width="900" />
  <img src="./docs/slides/12.png" width="900" />
  <img src="./docs/slides/13.png" width="900" />
  <img src="./docs/slides/14.png" width="900" />
  <img src="./docs/slides/15.png" width="900" />
  <img src="./docs/slides/16.png" width="900" />
  <img src="./docs/slides/17.png" width="900" />
  <img src="./docs/slides/18.png" width="900" />
  <img src="./docs/slides/19.png" width="900" />
</details>


# 🐾 Zootopia React
> 반려동물 커뮤니티 웹 애플리케이션

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 프로젝트 개요

**프로젝트명**: zootopia_react  
**개발 기간**: 2025.08.06 ~ 2025.08.27  
**수행 방식**: 팀 프로젝트  
**담당 범위**: 주요 동물병원 정보페이지 UI 및 기능 구현, 동물 장례 정보 페이지 UI, 사용자 간 1:1 쪽지, 소셜 로그인【프론트엔드/백엔드 연동】

### 기술 스택
React, Spring Boot, JWT, Tailwind CSS 등

## 🎯 주요 기능

### 🏥 동물병원 관리
- 네이버 외애 카카오 구글 추가
- 주요 병원 동물 페이지의 미술 및 보완
- 사용자 간 1:1 쪽지

## 📁 프로젝트 목표

1차 정규 프로젝트의 백엔드를 REST 방식으로 변경, 프론트엔드를 React로 변경 후 추가 기능 구현

## 🔧 설치 및 실행

### Prerequisites
```
Node.js 16.x 이상
Java 11 이상
MySQL 8.0
```

### 프론트엔드 실행
```
git clone https://github.com/your-username/zootopia_react.git
cd zootopia_react
npm install
npm start
```

### 백엔드 실행
```
cd backend
./mvnw spring-boot:run
```

## 📸 스크린샷

| 메인 페이지 | 동물병원 검색 | 사용자 쪽지 |
|------------|-------------|------------|
| ![메인](이미지링크) | ![검색](이미지링크) | ![쪽지](이미지링크) |

## 🛠️ 기술적 도전과 해결

### OAuth2 소셜 로그인 구현
- **문제**: 여러 OAuth 제공자 통합 관리의 복잡성
- **해결**: Spring Security OAuth2를 활용한 통합 인증 시스템 구축

### React와 Spring Boot 연동
- **문제**: CORS 및 인증 토큰 관리
- **해결**: JWT 기반 인증과 Axios 인터셉터 활용

## 🏗️ 아키텍처

```
Frontend (React + Tailwind CSS)
    ↕ HTTP/REST API
Backend (Spring Boot + Spring Security)
    ↕ JPA/Hibernate  
Database (MySQL)
```

## 👥 팀 구성

| 이름 | 역할 | 담당 기능 |
|------|------|----------|
| 사용자명 | Full-Stack | 동물병원 관리, 소셜 로그인, 쪽지 시스템 |

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 연락처

- 이메일: your-email@example.com  
- GitHub: [@your-username](https://github.com/your-username)
```
