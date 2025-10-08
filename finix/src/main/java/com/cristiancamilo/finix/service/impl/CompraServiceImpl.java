// Archivo: src/main/java/com/cristiancamilo/finix/service/impl/CompraServiceImpl.java
package com.cristiancamilo.finix.service.impl;

import com.cristiancamilo.finix.model.Compra;
import com.cristiancamilo.finix.model.CompraDetalle;
import com.cristiancamilo.finix.repository.CompraRepository;
import com.cristiancamilo.finix.service.CompraService;
import com.cristiancamilo.finix.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CompraServiceImpl implements CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoService productoService; // Inyectamos el servicio de producto

    @Override
    public List<Compra> findAll() {
        return compraRepository.findAll();
    }

    @Override
    public Optional<Compra> findById(Long id) {
        return compraRepository.findById(id);
    }

    @Override
    @Transactional // Anotación clave: toda la operación es atómica.
    public Compra crearCompra(Compra compra) {
        // 1. Iterar sobre cada detalle de la compra para actualizar el stock
        for (CompraDetalle detalle : compra.getDetalles()) {
            // Aseguramos la relación bidireccional
            detalle.setCompra(compra);

            // Obtenemos el ID del producto y la cantidad comprada
            Long productoId = detalle.getProducto().getId();
            int cantidadComprada = detalle.getCantidad();

            // Usamos el servicio de producto para actualizar el stock
            // El método 'actualizarStock' ya suma la cantidad, que es lo que necesitamos.
            productoService.actualizarStock(productoId, cantidadComprada);
        }

        // 2. Guardar la compra y sus detalles en la base de datos
        // Gracias a CascadeType.ALL, los detalles se guardan automáticamente con la compra.
        return compraRepository.save(compra);
    }

    @Override
    public void deleteById(Long id) {
        // Nota: Eliminar una compra no revierte el stock.
        // Si se necesitara esa lógica, se debería implementar aquí.
        compraRepository.deleteById(id);
    }
}