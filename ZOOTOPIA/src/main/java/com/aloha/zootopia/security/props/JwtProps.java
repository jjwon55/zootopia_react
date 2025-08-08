package com.aloha.zootopia.security.props;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;


// 해당 클래스는 Spring Boot의 `@ConfigurationProperties` 
// 어노테이션을 사용하여, application.properties(속성 설정 파일) 로부터
// JWT 관련 프로퍼티를 관리하는 프로퍼티 클래스입니다.
@Data
@Component
@ConfigurationProperties("com.aloha.zootopia")      
public class JwtProps {

  // com.aloha.login.secretKey로 지정된 프로퍼티 값을 주입받는 필드
  // ✅ com.aloha.login.secret-key ➡ secretKey : {인코딩된 시크릿 키}
  private String secretKey;
  
}
