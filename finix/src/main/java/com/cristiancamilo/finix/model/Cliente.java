package com.cristiancamilo.finix.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    private String apellido;

    @Column(unique = true)
    private String documentoIdentidad; // Cédula o NIT

    private String telefono;
    private String email;
}
