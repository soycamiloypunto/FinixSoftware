package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Producto;
import com.cristiancamilo.finix.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.findAll();
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.save(producto);
    }

    // --- NUEVO MÉTODO: OBTENER UN PRODUCTO POR SU ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> producto = productoService.findById(id);
        // Si el producto existe, devuelve 200 OK con el producto. Si no, devuelve 404 Not Found.
        return producto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- NUEVO MÉTODO: ACTUALIZAR (EDITAR) UN PRODUCTO EXISTENTE ---
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        // Buscamos el producto por ID
        return productoService.findById(id)
                .map(productoExistente -> {
                    // Actualizamos los campos del producto existente con los detalles del producto que llega
                    productoExistente.setNombre(productoDetails.getNombre());
                    productoExistente.setDescripcion(productoDetails.getDescripcion());
                    productoExistente.setPrecioVenta(productoDetails.getPrecioVenta());
                    // Asumimos que el precio de compra no se actualiza desde este endpoint general
                    // Si sí se debe actualizar, añade la línea: productoExistente.setPrecioCompra(productoDetails.getPrecioCompra());
                    productoExistente.setStock(productoDetails.getStock());
                    productoExistente.setProveedor(productoDetails.getProveedor());
                    productoExistente.setEsServicioDeTiempo(productoDetails.isEsServicioDeTiempo());

                    // Guardamos el producto actualizado y lo devolvemos con un 200 OK
                    Producto productoActualizado = productoService.save(productoExistente);
                    return ResponseEntity.ok(productoActualizado);
                })
                // Si el producto no se encuentra, devolvemos 404 Not Found
                .orElse(ResponseEntity.notFound().build());
    }

    // --- NUEVO MÉTODO: ELIMINAR UN PRODUCTO ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        // Verificamos si el producto existe antes de intentar borrarlo
        if (productoService.findById(id).isPresent()) {
            productoService.deleteById(id);
            // Devolvemos 204 No Content, que es el estándar para un borrado exitoso
            return ResponseEntity.noContent().build();
        } else {
            // Si no existe, devolvemos 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }
    // Aquí irían los demás endpoints para GET por ID, PUT y DELETE, siguiendo el ejemplo de ProveedorController
}
