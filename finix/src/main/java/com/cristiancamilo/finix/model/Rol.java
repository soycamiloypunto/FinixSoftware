package com.cristiancamilo.finix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole nombre;

    public Rol() {
    }

    public Rol(ERole nombre) {
        this.nombre = nombre;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ERole getNombre() {
        return nombre;
    }

    public void setNombre(ERole nombre) {
        this.nombre = nombre;
    }
}