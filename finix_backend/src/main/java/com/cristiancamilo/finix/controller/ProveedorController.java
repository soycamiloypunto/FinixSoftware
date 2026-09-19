package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Proveedor;
import com.cristiancamilo.finix.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @GetMapping
    public Mono<List<Proveedor>> getAllProveedores() {
        return Mono.fromCallable(() -> {
            return proveedorService.findAll();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Proveedor>> getProveedorById(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            return proveedorService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public Mono<Proveedor> createProveedor(@RequestBody Proveedor proveedor) {
        return Mono.fromCallable(() -> {
            return proveedorService.save(proveedor);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Proveedor>> updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedorDetails) {
        return Mono.fromCallable(() -> {
            return proveedorService.findById(id)
                    .map(proveedor -> {
                        proveedor.setNombre(proveedorDetails.getNombre());
                        proveedor.setTelefono(proveedorDetails.getTelefono());
                        proveedor.setDireccion(proveedorDetails.getDireccion());
                        proveedor.setEmail(proveedorDetails.getEmail());
                        return ResponseEntity.ok(proveedorService.save(proveedor));
                    })
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProveedor(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            return proveedorService.findById(id)
                    .map(proveedor -> {
                        proveedorService.deleteById(id);
                        return ResponseEntity.ok().<Void>build();
                    })
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
