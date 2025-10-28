package com.cristiancamilo.finix.dto;

import java.util.Set;

public class RegistroUsuarioDTO {

    private String username;
    private String email;
    private String password;
    private Set<String> roles; // Nombres de los roles como "ADMINISTRADOR", "VISUALIZACION", etc.

    // Constructor vacío
    public RegistroUsuarioDTO() {
    }

    // Constructor con todos los campos
    public RegistroUsuarioDTO(String username, String email, String password, Set<String> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}