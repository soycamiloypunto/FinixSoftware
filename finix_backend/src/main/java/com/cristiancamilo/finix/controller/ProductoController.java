package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Producto;
import com.cristiancamilo.finix.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public Mono<List<Producto>> getAllProductos() {
        return Mono.fromCallable(() -> {
            return productoService.findAll();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public Mono<Producto> createProducto(@RequestBody Producto producto) {
        return Mono.fromCallable(() -> {
            return productoService.save(producto);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Producto>> getProductoById(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            Optional<Producto> producto = productoService.findById(id);
            return producto.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Producto>> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        return Mono.fromCallable(() -> {
            return productoService.findById(id)
                    .map(productoExistente -> {
                        productoExistente.setNombre(productoDetails.getNombre());
                        productoExistente.setDescripcion(productoDetails.getDescripcion());
                        productoExistente.setPrecioVenta(productoDetails.getPrecioVenta());
                        productoExistente.setStock(productoDetails.getStock());
                        productoExistente.setProveedor(productoDetails.getProveedor());
                        productoExistente.setEsServicioDeTiempo(productoDetails.isEsServicioDeTiempo());
                        Producto productoActualizado = productoService.save(productoExistente);
                        return ResponseEntity.ok(productoActualizado);
                    })
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<?>> deleteProducto(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            if (productoService.findById(id).isPresent()) {
                productoService.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(404).<Void>build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
