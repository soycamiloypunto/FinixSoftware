package com.cristiancamilo.finix.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException; // Usamos la excepción general
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    // Crear clave de firma (Retorna java.security.Key)
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtSecret));
    }

    // Generar token JWT
    public String generateJwtToken(String username, Long userId, List<String> roles) {
        return Jwts.builder()
                .subject(username)
                .claim("id", userId)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Obtener nombre de usuario (subject)
    // Usa la sintaxis moderna de JJWT
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key()) // Se mantiene el casting si el IDE lo exige, o se puede intentar key()
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Obtener los claims del token
    // Usa la sintaxis moderna de JJWT
    public Claims getClaimsFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key()) // Se mantiene el casting si el IDE lo exige
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Validar token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key()) // Se mantiene el casting si el IDE lo exige
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT Validation Error: " + e.getMessage());
        }
        return false;
    }
}
