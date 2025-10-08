// ruta: com/cristiancamilo/finix/dto/ProductoDTO.java
package com.cristiancamilo.finix.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ProductoDTO {
    private Long id;
    private String nombre;
    private BigDecimal precioVenta;
    private boolean esServicioDeTiempo;
}