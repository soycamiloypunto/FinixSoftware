package com.cristiancamilo.finix.finix_security.service;

import com.cristiancamilo.finix.finix_security.repository.UsuarioRepository; // Asume que el Repositorio está copiado aquí
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * Service to load user details for Spring Security WebFlux.
 * Wraps the JPA repository call in a Mono to handle it non-blockingly.
 */
@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements ReactiveUserDetailsService {

    // Necesita el repositorio JPA copiado de finix
    private final UsuarioRepository usuarioRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        // Mono.fromCallable ejecuta la operación bloqueante (JPA) fuera del Event Loop de Netty
        return Mono.fromCallable(() -> usuarioRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username)))
                // Mapea la Entidad Usuario a nuestra implementación de UserDetailsImpl
                .map(UserDetailsImpl::new);
    }
}
