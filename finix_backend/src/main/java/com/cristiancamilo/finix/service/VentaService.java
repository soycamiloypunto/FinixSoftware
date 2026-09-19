package com.cristiancamilo.finix.service;

import com.cristiancamilo.finix.model.Venta;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface VentaService {
    List<Venta> findAll();
    Optional<Venta> findById(Long id);
    // El método save será más complejo, recibirá un objeto con los detalles de la venta
    Venta registrarVenta(Venta venta);
    List<Venta> findByFechaBetween(ZonedDateTime fechaInicio, ZonedDateTime fechaFin);

}
