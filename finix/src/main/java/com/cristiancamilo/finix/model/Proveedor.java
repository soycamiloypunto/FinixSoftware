package com.cristiancamilo.finix.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // --- Campo Faltante ---
    // Agregamos el campo para el NIT.
    // Lo hacemos único porque cada proveedor debería tener un NIT distinto.
    @Column(unique = true)
    private String nit;

    private String telefono;
    private String direccion;
    private String email;

    // Un proveedor puede tener muchos productos (relación no gestionada aquí para evitar complejidad)
}
