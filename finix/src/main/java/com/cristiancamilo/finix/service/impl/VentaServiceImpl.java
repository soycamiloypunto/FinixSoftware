package com.cristiancamilo.finix.service.impl;

import com.cristiancamilo.finix.model.Venta;
import com.cristiancamilo.finix.repository.VentaRepository;
import com.cristiancamilo.finix.service.ProductoService;
import com.cristiancamilo.finix.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VentaServiceImpl implements VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoService productoService;

    @Override
    public List<Venta> findAll() {
        return ventaRepository.findAll();
    }

    @Override
    public Optional<Venta> findById(Long id) {
        return ventaRepository.findById(id);
    }

    @Override
    @Transactional
    public Venta registrarVenta(Venta venta) {
        // Lógica de negocio para registrar una venta:
        // 1. Recorrer cada 'VentaDetalle' en la venta.
        // 2. Por cada detalle, llamar a productoService.actualizarStock() con la cantidad en negativo
        //    para rebajar del inventario.
        // 3. Asegurarse de que el cálculo del total, monto pagado y cambio sea correcto.
        // 4. Guardar la venta y sus detalles en la base de datos.

        // Ejemplo simple (la lógica real será más robusta):
        venta.getDetalles().forEach(detalle -> {
            // Asociar el detalle con la venta padre
            detalle.setVenta(venta);
            // Actualizar stock
            productoService.actualizarStock(detalle.getProducto().getId(), -detalle.getCantidad());
        });

        return ventaRepository.save(venta);
    }
}
