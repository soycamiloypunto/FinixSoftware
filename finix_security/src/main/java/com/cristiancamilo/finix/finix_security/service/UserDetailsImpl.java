package com.cristiancamilo.finix.finix_security.service;

import com.cristiancamilo.finix.finix_security.model.Usuario; // Asume que la entidad Usuario está copiada aquí
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Wrapper for the Usuario entity, implementing Spring Security's UserDetails.
 * Used to transfer user information from the JPA repository to the Security Context.
 */
@Getter
public class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String username;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Usuario usuario) {
        this.id = usuario.getId();
        this.username = usuario.getUsername();
        this.email = usuario.getEmail();
        this.password = usuario.getPassword();
        // Map user roles to Spring Security Granted Authorities
        this.authorities = usuario.getRoles().stream()
                .map(role -> {
                    return new SimpleGrantedAuthority(role.getNombre().name());
                })
                .collect(Collectors.toList());
    }

    // Default implementations for UserDetails flags
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
