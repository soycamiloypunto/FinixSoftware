package com.cristiancamilo.finix.finix_security.controller;

import com.cristiancamilo.finix.finix_security.dto.JwtResponseDTO;
import com.cristiancamilo.finix.finix_security.dto.LoginRequestDTO;
import com.cristiancamilo.finix.finix_security.jwt.JwtUtils;
import com.cristiancamilo.finix.finix_security.service.UserDetailsImpl;
import com.cristiancamilo.finix.finix_security.service.UserDetailsServiceImpl; // <-- Importación correcta
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador reactivo para el login. Este utiliza el UserDetailsServiceImpl
 * para buscar el hash de la contraseña en la BD y el PasswordEncoder para verificarla.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    // **CORRECCIÓN:** Usamos el servicio REACTIVO correcto para la búsqueda de usuario.
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public Mono<ResponseEntity<JwtResponseDTO>> authenticateUser(@RequestBody Mono<LoginRequestDTO> loginRequest) {

        return loginRequest
                .flatMap(loginDto ->
                        // 1. Cargar UserDetails desde la BD
                        userDetailsService.findByUsername(loginDto.getUsername()) // <-- Uso el servicio correcto
                                .flatMap(userDetails -> {

                                    UserDetailsImpl userDetailsImpl = (UserDetailsImpl) userDetails;

                                    // 2. Verificar la contraseña
                                    if (passwordEncoder.matches(loginDto.getPassword(), userDetailsImpl.getPassword())) {

                                        // Autenticación exitosa!
                                        List<String> roles = userDetailsImpl.getAuthorities().stream()
                                                .map(GrantedAuthority::getAuthority)
                                                .collect(Collectors.toList());

                                        // 3. Generar el JWT
                                        String jwt = jwtUtils.generateJwtToken(
                                                userDetailsImpl.getUsername(),
                                                userDetailsImpl.getId(),
                                                roles
                                        );

                                        // 4. Crear la respuesta DTO
                                        JwtResponseDTO responseDto = new JwtResponseDTO(
                                                jwt,
                                                "Bearer",
                                                userDetailsImpl.getId(),
                                                userDetailsImpl.getUsername(),
                                                userDetailsImpl.getEmail(),
                                                roles
                                        );

                                        return Mono.just(new ResponseEntity<>(responseDto, HttpStatus.OK));
                                    } else {
                                        // Contraseña no coincide
                                        return Mono.error(new Exception("Credenciales inválidas"));
                                    }
                                })
                )
                // 5. Manejo de errores final (Usuario no encontrado o Contraseña incorrecta)
                .onErrorResume(e -> {
                    System.err.println("Error de autenticación (BD o credenciales): " + e.getMessage());
                    // 401 para cualquier fallo de autenticación (usuario no existe o clave inválida)
                    return Mono.just(new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
                });
    }
}
