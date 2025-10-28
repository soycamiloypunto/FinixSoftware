package com.cristiancamilo.finix.finix_security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO {

    private String token;
    private String type = "Bearer"; // Tipo de token
    private Long id;
    private String username;
    private String email;
    private List<String> roles; // Roles del usuario
}
