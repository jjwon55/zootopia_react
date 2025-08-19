package com.aloha.zootopia.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.util.Map;

public class CustomAuthFailureHandler implements AuthenticationFailureHandler {
    private final ObjectMapper om = new ObjectMapper();

    private static Throwable rootCause(Throwable e) {
        Throwable cause = e;
        while (cause.getCause() != null && cause.getCause() != cause) {
            cause = cause.getCause();
        }
        return cause;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse res, AuthenticationException ex)
            throws IOException {

        // 원인 예외까지 추적
        Throwable root = rootCause(ex);
        boolean suspended =
                (ex instanceof DisabledException) ||
                (root instanceof DisabledException) ||
                (ex instanceof InternalAuthenticationServiceException && ex.getCause() instanceof DisabledException);

        int status = suspended ? HttpServletResponse.SC_FORBIDDEN : HttpServletResponse.SC_UNAUTHORIZED;
        String msg  = suspended ? "정지된 계정입니다." : "아이디 또는 비밀번호가 일치하지 않습니다.";

        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        om.writeValue(res.getWriter(), Map.of("error", msg));
    }
}
