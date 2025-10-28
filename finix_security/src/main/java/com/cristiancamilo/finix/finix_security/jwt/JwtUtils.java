package com.cristiancamilo.finix.finix_security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {

    // Se inyecta la clave secreta desde application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Se inyecta el tiempo de expiración (en milisegundos)
    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    /**
     * Obtiene la clave de firma (Signing Key) desde la cadena secreta.
     */
    private Key key() {
        // Usa Decoders para convertir el String base64url-safe a bytes
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtSecret));
    }

    /**
     * Genera un JSON Web Token a partir de los datos del usuario.
     * @param username Nombre de usuario (principal del JWT)
     * @param userId ID del usuario
     * @param roles Lista de roles del usuario
     * @return El token JWT como String
     */
    public String generateJwtToken(String username, Long userId, List<String> roles) {
        return Jwts.builder()
                .setSubject(username) // El sujeto del token (típicamente el nombre de usuario)
                .claim("id", userId) // Claim personalizado: ID del usuario
                .claim("roles", roles) // Claim personalizado: Roles del usuario
                .setIssuedAt(new Date()) // Fecha de creación
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Fecha de expiración
                .signWith(key(), SignatureAlgorithm.HS512) // Firma con la clave secreta y algoritmo HS512
                .compact(); // Construye el token
    }

    // Nota: Las funciones de validación y extracción se usarían en el filtro
    // del proyecto principal (finix), no en este.
}
