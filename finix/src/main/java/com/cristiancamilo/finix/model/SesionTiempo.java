package com.cristiancamilo.finix.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class SesionTiempo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_servicio_id", nullable = false)
    private Producto productoServicio; // Referencia al producto tipo "Tiempo PC" o "Tiempo Consola"

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente; // Cliente que usa el servicio

    @Column(nullable = false)
    private LocalDateTime horaInicio = LocalDateTime.now();

    private LocalDateTime horaFin;

    // Si es una cuenta regresiva, se guarda la duración. Si no, es nulo y es cuenta ascendente.
    private Integer duracionSolicitadaMinutos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSesion estado = EstadoSesion.ACTIVA;

    // Se asocia a una venta cuando se finaliza y se cobra.
    @OneToOne
    @JoinColumn(name = "venta_id")
    private Venta venta;

    // Para identificar la máquina o consola
    private String puesto;
}
