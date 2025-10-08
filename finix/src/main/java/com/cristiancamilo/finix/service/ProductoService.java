package com.cristiancamilo.finix.service;

import com.cristiancamilo.finix.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> findAll();
    Optional<Producto> findById(Long id);
    Producto save(Producto producto);
    void deleteById(Long id);
    // Métodos específicos para la lógica de negocio de productos
    void actualizarStock(Long productoId, int cantidad);
}
