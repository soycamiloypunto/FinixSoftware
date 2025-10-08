package com.cristiancamilo.finix.dto;

import lombok.Data;

// Objeto para transferir los datos necesarios para iniciar una sesión de tiempo
@Data
public class IniciarSesionRequest {
    private Long productoServicioId;
    private Long clienteId; // Puede ser nulo
    private Integer minutos; // Nulo para cuenta ascendente
    private String puesto; // Ej: "PC-01", "Xbox-S"
}
