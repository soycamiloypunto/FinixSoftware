package com.cristiancamilo.finix.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod; // Importación necesaria para HttpMethod
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // <-- Nueva Importación
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Nueva Importación

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity // Asumo que usas esta anotación
public class SecurityConfig {

    // 💡 SOLUCIÓN DEL ERROR DE INYECCIÓN DE DEPENDENCIA 💡
    /**
     * Define el bean para el encriptador de contraseñas, necesario para
     * que UsuarioService pueda autowirearlo.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    // ... (Otros beans como PasswordEncoder, etc.) ...

    /**
     * Define la configuración de CORS para el filtro de Spring Security.
     * Esta configuración es necesaria para que las peticiones OPTIONS (preflight)
     * sean manejadas correctamente por Spring Security antes del JWT Filter.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 💡 Origen de Angular 💡
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));

        // Métodos, incluyendo OPTIONS para el preflight
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headers permitidos, cruciales para el JWT Bearer Token
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplicar a todas las rutas
        return source;
    }

    /**
     * Configura la cadena de filtros de seguridad.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 💡 1. Habilitar y aplicar la configuración CORS definida arriba 💡
                // Esto asegura que el filtro CORS se ejecute antes que los filtros de seguridad.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Deshabilitar CSRF para APIs REST
                .csrf(csrf -> csrf.disable())

                // 3. Permitir peticiones OPTIONS (preflight) sin autenticación
                // Esto es fundamental para que el navegador complete el handshake CORS
                .authorizeHttpRequests(auth -> auth
                        // *** FIX: Reemplazar antMatchers por requestMatchers ***
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Aquí van tus reglas de autenticación JWT
                        // Ejemplo: .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated()
                );

        // ... (Añadir tu filtro JWT y otras configuraciones aquí) ...

        return http.build();
    }
}
