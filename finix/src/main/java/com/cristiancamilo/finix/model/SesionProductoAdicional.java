// ruta: com/cristiancamilo/finix/model/SesionProductoAdicional.java

package com.cristiancamilo.finix.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Data
public class SesionProductoAdicional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sesion_tiempo_id", nullable = false)
    @JsonIgnore // Para evitar bucles infinitos al serializar
    private SesionTiempo sesionTiempo;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private BigDecimal precioUnitarioVenta; // Guardamos el precio al momento de la venta

    @Column(nullable = false)
    private BigDecimal totalVenta;

    @Column(nullable = false)
    private ZonedDateTime fechaCreacion = ZonedDateTime.now();
}