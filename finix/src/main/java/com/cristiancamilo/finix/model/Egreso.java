// Archivo: src/main/java/com/cristiancamilo/finix/model/Egreso.java
package com.cristiancamilo.finix.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Data
public class Egreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private ZonedDateTime fecha = ZonedDateTime.now(ZoneId.of("America/Bogota"));


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false)
    private String concepto;

    // --- Datos del beneficiario ---
    @Column(nullable = false)
    private String nombreBeneficiario;

    private String tipoIdentificacion; // Ej: Cédula, NIT, Pasaporte

    private String numeroIdentificacion;

    private String telefonoBeneficiario;

}