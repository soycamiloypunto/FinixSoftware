package com.cristiancamilo.finix.config;

// Importaciones necesarias para la inyección del filtro
import com.cristiancamilo.finix.jwt.AuthTokenFilter; // <-- Importación crucial de tu filtro JWT
import org.springframework.beans.factory.annotation.Autowired; // <-- Usaremos Autowired para inyectar el filtro
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <-- Para posicionar el filtro

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 💡 PASO 1: Inyectar el filtro JWT que lee el token 💡
    // Usamos @Autowired para inyectar la instancia de tu filtro
    @Autowired
    private AuthTokenFilter authTokenFilter;

    // Los demás beans (PasswordEncoder, etc.) se mantienen...

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuración de CORS
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Configura la cadena de filtros de seguridad.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Configuración de CORS y CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Permitir la solicitud OPTIONS (CORS preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Restringir el CRUD de usuarios únicamente a ADMINISTRADORES
                        .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_ADMINISTRADOR")

                        // Restringir operaciones de Edición y Eliminación globalmente a ADMINISTRADORES
                        .requestMatchers(HttpMethod.PUT, "/api/**").hasAuthority("ROLE_ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/**").hasAuthority("ROLE_ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasAuthority("ROLE_ADMINISTRADOR")

                        // Permitir GET y POST para cualquier usuario autenticado (incluye ESTANDAR)
                        .requestMatchers("/api/**").authenticated()

                        // Cualquier otra petición debe estar autenticada
                        .anyRequest().authenticated()
                )

                // 💡 PASO 3: Añadir el filtro JWT a la cadena 💡
                // Colocamos AuthTokenFilter ANTES del filtro estándar de autenticación de Spring.
                // Esto asegura que el token se lea y el usuario se autentique antes de que Spring haga su chequeo.
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)

                // 4. Deshabilitar formularios y HTTP Basic (ya que usamos JWT)
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());
        // Nota: Tu código original no tenía estas dos últimas líneas,
        // pero son una buena práctica al usar JWT.

        return http.build();
    }
}