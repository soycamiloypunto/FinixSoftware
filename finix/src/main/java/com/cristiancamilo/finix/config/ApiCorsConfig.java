package com.cristiancamilo.finix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS para el proyecto Spring Boot basado en Servlet (no WebFlux).
 * Este archivo se mantiene, pero la implementación de addCorsMappings se comenta
 * o se deja vacía para evitar conflictos con el filtro CORS de Spring Security
 * definido en SecurityConfig.java.
 */
@Configuration
public class ApiCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Se comenta o se deja vacío para evitar que esta configuración
        // de WebMvcConfigurer interfiera con la de Spring Security.
        /*
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With")
                .allowCredentials(true)
                .exposedHeaders("Location");
        */
    }
}