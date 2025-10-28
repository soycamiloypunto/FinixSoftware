package com.cristiancamilo.finix.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.cristiancamilo.finix.jwt.AuthTokenFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // Habilita la seguridad web de Spring
// Habilita las anotaciones de seguridad como @PreAuthorize y @PostAuthorize
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private AuthTokenFilter authTokenFilter;

    /**
     * Define el bean para el encriptador de contraseñas (BCryptPasswordEncoder)
     * Este bean será inyectado en el UsuarioService.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura la cadena de filtros de seguridad.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Como usarás JWT (futuro WebFlux) y Angular, deshabilitas CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // La política de sesión es STATELESS (sin estado) para APIs REST con JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Define las reglas de autorización para las peticiones HTTP
                .authorizeHttpRequests(auth -> auth

                        // 1. EL ENDPOINT DE CREACIÓN DE USUARIOS: Lo haremos público temporalmente
                        //    para que puedas crear tu primer usuario ADMINISTRADOR sin login.
                        //    POST /api/usuarios es el endpoint de creación.
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()

                        // 2. REGLA PARA EL CRUD DE USUARIOS: Solo accesible por el rol ADMINISTRADOR.
                        //    Esto asegura que, después de crear tu primer ADMIN, solo él pueda ver/editar.
                        .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")

                        // 3. OTRAS RUTAS (Tus otros controladores de negocio)
                        //    Por defecto, cualquier otra ruta (GET, POST, etc.) requiere autenticación.
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        // En un proyecto real, se añadiría aquí la configuración de un filtro JWT
        // para manejar la autenticación. Por ahora, solo usamos la gestión de roles.

        return http.build();
    }
}