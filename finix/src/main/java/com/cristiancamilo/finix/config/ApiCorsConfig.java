package com.cristiancamilo.finix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS para el proyecto Spring Boot basado en Servlet (no WebFlux).
 * Este proyecto está sirviendo las rutas /api/* en el puerto 8080.
 */
@Configuration
public class ApiCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica la configuración a todas las rutas (ej: /api/productos)
                // 💡 MUY IMPORTANTE: El origen de tu frontend Angular 💡
                .allowedOrigins("http://localhost:4200")

                // Métodos permitidos para peticiones Preflight y reales
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")

                // Headers permitidos, incluyendo 'Authorization' y 'Content-Type'
                // Esto es esencial para que el token JWT (Bearer) se envíe correctamente.
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With")

                // Habilita el soporte para credenciales
                .allowCredentials(true)

                // Headers que el cliente puede leer
                .exposedHeaders("Location");
    }
}
