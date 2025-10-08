// ruta: com/cristiancamilo/finix/dto/AgregarProductoRequest.java

package com.cristiancamilo.finix.dto;

import lombok.Data;

@Data
public class AgregarProductoRequest {
    private Long productoId;
    private int cantidad;
}