package com.cristiancamilo.finix.finix_security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebFluxSecurity // Habilita la seguridad web reactiva
public class WebSecurityConfig {

    /**
     * Define el bean para el encriptador de contraseñas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Define y configura el filtro CORS para permitir peticiones desde el frontend de Angular.
     * Este filtro debe ser definido como un Bean para que Spring WebFlux lo utilice.
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        // 1. Crear la configuración CORS específica
        CorsConfiguration corsConfig = new CorsConfiguration();

        // 💡 MUY IMPORTANTE: Especificar el origen de tu frontend Angular (puerto 4200) 💡
        // En producción, reemplaza localhost:4200 por tu dominio real (ej: https://app.finix.com)
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        corsConfig.setAllowedOrigins(Arrays.asList("http://192.168.1.110:4200"));
        // Métodos permitidos para peticiones Preflight y reales
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permitidos, incluyendo 'Authorization' y 'Content-Type'
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

        // Exponer headers si el cliente necesita acceder a ellos (ej: Location)
        corsConfig.setExposedHeaders(Collections.singletonList("Location"));

        // Habilita el soporte para credenciales (cookies), aunque en JWT no es crítico.
        corsConfig.setAllowCredentials(true);

        // 2. Crear la fuente de configuración y aplicarla a todas las rutas (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        // 3. Devolver el filtro WebFlux
        return new CorsWebFilter(source);
    }

    /**
     * Configura la cadena de filtros de seguridad reactiva.
     */
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // Deshabilita CSRF (Cross-Site Request Forgery) para API REST
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // NOTA: Con el CorsWebFilter definido arriba, WebFlux lo recoge automáticamente.
                // No es necesario añadir una configuración extra de CORS aquí, pero si quisieras:
                // .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Define las reglas de autorización
                .authorizeExchange(exchanges -> exchanges
                        // El endpoint de login es el único que debe ser público.
                        .pathMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        // Permitir todas las peticiones OPTIONS (requeridas por CORS preflight)
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()

                        // Los demás endpoints requieren autenticación (JWT)
                        .anyExchange().authenticated()
                )
                // Deshabilita formulario de login y autenticación básica.
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)

                // Construye y devuelve el filtro reactivo
                .build();
    }

    // Si quisieras definir la fuente de configuración dentro de ServerHttpSecurity:
    // private CorsConfigurationSource corsConfigurationSource() {
    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     CorsConfiguration config = new CorsConfiguration();
    //     config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    //     config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    //     config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
    //     config.setAllowCredentials(true);
    //     source.registerCorsConfiguration("/**", config);
    //     return source;
    // }
}
