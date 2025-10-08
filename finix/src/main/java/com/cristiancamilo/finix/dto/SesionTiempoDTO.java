// ruta: com/cristiancamilo/finix/dto/SesionTiempoDTO.java
package com.cristiancamilo.finix.dto;

import com.cristiancamilo.finix.model.EstadoSesion;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
public class SesionTiempoDTO {
    private Long id;
    private ZonedDateTime horaInicio;
    private ZonedDateTime horaFin;
    private Integer duracionSolicitadaMinutos;
    private EstadoSesion estado;
    private String puesto;

    // --- Objetos anidados con la estructura que el frontend necesita ---
    private ProductoDTO productoServicio;
    private List<VentaItemDTO> productosAdicionales;
}