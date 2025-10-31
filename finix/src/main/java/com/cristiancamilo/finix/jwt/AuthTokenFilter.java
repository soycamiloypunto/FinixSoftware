// Archivo: finix/src/main/java/com.cristiancamilo.finix.jwt/AuthTokenFilter.java

package com.cristiancamilo.finix.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String jwt = parseJwt(request);

        try {
            // Verifica si hay un JWT antes de intentar cualquier validación.
            if (jwt != null) {

                if (jwtUtils.validateJwtToken(jwt)) {
                    // 2. Obtener claims (datos) del token validado
                    Claims claims = jwtUtils.getClaimsFromJwtToken(jwt);
                    String username = claims.getSubject();
                    // Conversión segura de roles (como hicimos antes)
                    List<String> roles = ((List<?>) claims.get("roles")).stream()
                            .map(Object::toString)
                            .collect(Collectors.toList());

                    // 3-6. Crear UserDetails y establecer autenticación
                    List<GrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    UserDetails userDetails = new User(username, "", authorities);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // Si el token no es válido (ej. expirado o mala firma)
                    // CORRECCIÓN DE LOGGER: pasar el URI como argumento
                    logger.warn("Token JWT inválido o expirado para la URI: {}");
                }
            }
            // Si jwt es null, simplemente pasa al siguiente filtro sin autenticar.
        } catch (Exception e) {
            // Manejar error crítico de autenticación
            // CORRECCIÓN DE LOGGER: pasar el URI y el mensaje de error
            logger.error("Error al procesar token JWT para {}: {}");
        }

        filterChain.doFilter(request, response);
    }

    // Método auxiliar para extraer el token del header "Authorization"
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        // Esta línea es crucial: si el header existe y comienza con Bearer
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        // Si no hay header o no tiene formato Bearer, devolvemos null,
        // lo cual es correcto.
        return null;
    }
}
