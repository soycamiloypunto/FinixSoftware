package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Proveedor;
import com.cristiancamilo.finix.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/proveedores") // Ruta base para todos los endpoints de este controlador
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @GetMapping
    public List<Proveedor> getAllProveedores() {
        return proveedorService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> getProveedorById(@PathVariable Long id) {
        return proveedorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Proveedor createProveedor(@RequestBody Proveedor proveedor) {
        return proveedorService.save(proveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedorDetails) {
        return proveedorService.findById(id)
                .map(proveedor -> {
                    proveedor.setNombre(proveedorDetails.getNombre());
                    proveedor.setTelefono(proveedorDetails.getTelefono());
                    proveedor.setDireccion(proveedorDetails.getDireccion());
                    proveedor.setEmail(proveedorDetails.getEmail());
                    return ResponseEntity.ok(proveedorService.save(proveedor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Long id) {
        return proveedorService.findById(id)
                .map(proveedor -> {
                    proveedorService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
