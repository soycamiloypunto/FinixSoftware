// Archivo: src/main/java/com/cristiancamilo/finix/service/CompraService.java
package com.cristiancamilo.finix.service;

import com.cristiancamilo.finix.model.Compra;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface CompraService {

    List<Compra> findAll();

    Optional<Compra> findById(Long id);

    /**
     * Registra una nueva compra y actualiza el stock de los productos involucrados.
     * @param compra La compra a registrar, con su lista de detalles.
     * @return La compra guardada con su ID asignado.
     */
    Compra crearCompra(Compra compra);

    void deleteById(Long id);

    List<Compra> findByFechaBetween(ZonedDateTime fechaInicio, ZonedDateTime fechaFin);

}