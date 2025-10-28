package com.cristiancamilo.finix.finix_security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Usamos Lombok para reducir el código
@Data // Genera Getters, Setters, toString, equals, hashCode
@NoArgsConstructor // Genera constructor sin argumentos
@AllArgsConstructor // Genera constructor con todos los argumentos
public class LoginRequestDTO {

    private String username;
    private String password;
}
