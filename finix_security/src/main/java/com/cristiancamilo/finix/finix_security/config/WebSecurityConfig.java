package com.cristiancamilo.finix.finix_security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity // Habilita la seguridad web reactiva
public class WebSecurityConfig {

    /**
     * Define el bean para el encriptador de contraseñas.
     * DEBE ser el mismo que usaste en tu proyecto MVC principal.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura la cadena de filtros de seguridad reactiva.
     */
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // Deshabilita CSRF (Cross-Site Request Forgery) para API REST
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Define las reglas de autorización
                .authorizeExchange(exchanges -> exchanges
                        // El endpoint de login es el único que debe ser público.
                        // Lo usará Angular para obtener el JWT.
                        .pathMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        // Los demás endpoints requieren autenticación (por ahora, luego
                        // los protegeremos con el filtro JWT)
                        .anyExchange().authenticated()
                )
                // Habilita el formulario de login básico (aunque lo reemplazaremos con JWT)
                // y el httpBasic para autenticación básica.
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)

                // Construye y devuelve el filtro reactivo
                .build();
    }
}