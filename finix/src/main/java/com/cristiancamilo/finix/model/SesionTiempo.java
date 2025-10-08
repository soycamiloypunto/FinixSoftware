package com.cristiancamilo.finix.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
// --- IMPORTACIONES NUEVAS Y CORREGIDAS ---
import java.time.ZonedDateTime;
import java.time.ZoneId;

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

    // --- CAMBIO PRINCIPAL AQUÍ ---
    // Usamos ZonedDateTime para guardar la fecha, hora y zona horaria de forma explícita.
    // Siempre se creará con la hora actual de Colombia, sin importar dónde esté el servidor.
    @Column(nullable = false)
    private ZonedDateTime horaInicio = ZonedDateTime.now(ZoneId.of("America/Bogota"));

    // Cambiamos también horaFin para mantener la consistencia
    private ZonedDateTime horaFin;

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
