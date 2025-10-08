// ruta: com/cristiancamilo/finix/dto/VentaItemDTO.java

package com.cristiancamilo.finix.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder // El patrón Builder es útil para crear estos DTOs
public class VentaItemDTO {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private int cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal total;
}