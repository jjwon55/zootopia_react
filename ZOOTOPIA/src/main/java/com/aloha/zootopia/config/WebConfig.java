package com.aloha.zootopia.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 빈 등록 설정 클래스 지정
public class WebConfig implements WebMvcConfigurer {

  @Value("${file.upload.path}")
  private String uploadPath;

  // @Bean // 빈 등록
  // public PasswordEncoder passwordEncoder() {
  //   return new BCryptPasswordEncoder();
  //   // return NoOpPasswordEncoder.getInstance();
  //   // BCryptPasswordEncoder : BCrypt 해시 알고리즘을 사용하여 비밀번호 암호화
  //   // NoOpPasswordEncoder : 암호화 없이 비밀번호를 저장
  //   // ...
  // }

  @Bean
  public FilterRegistrationBean<MultipartFilter> multipartFilter() {
    FilterRegistrationBean<MultipartFilter> registration = new FilterRegistrationBean<>();
    MultipartFilter multipartFilter = new MultipartFilter();
    registration.setFilter(multipartFilter);
    registration.setOrder(Ordered.HIGHEST_PRECEDENCE); // Ensure this runs before Spring Security
    return registration;
  }

  @Bean
  public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
    return (tomcat) -> tomcat.addConnectorCustomizers((connector) -> {
      connector.setMaxPostSize(100 * 1024 * 1024); // 100 MB
      connector.setMaxSavePostSize(100 * 1024 * 1024); // 100 MB
      // maxRequestParts는 Tomcat Connector 레벨에서 직접 설정하는 API가 없습니다.
      // 이는 MultipartConfigElement를 통해 서블릿 컨텍스트 레벨에서 설정됩니다.
      // 따라서, multipartConfigElement() 빈에서 설정된 값이 적용되어야 합니다.
    });
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/upload/**")
        // .addResourceLocations("file:///C:/upload/");
        .addResourceLocations("file:///C:/upload/");
  }

@Override
public void addCorsMappings(CorsRegistry registry) {
  registry.addMapping("/**")
      .allowedOrigins(
          "http://localhost:5173",
          "http://192.168.30.3:5173"   // 👈 내부 IP도 추가
      )
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
      .allowedHeaders("*")
      .exposedHeaders("Authorization", "Content-Disposition") // 필요시
      .allowCredentials(true);
}


}
