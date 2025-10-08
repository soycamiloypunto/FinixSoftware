// Archivo: src/main/java/com/cristiancamilo/finix/controller/EgresoController.java
package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Egreso;
import com.cristiancamilo.finix.service.EgresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/egresos")
public class EgresoController {

    @Autowired
    private EgresoService egresoService;

    @GetMapping
    public List<Egreso> getAllEgresos() {
        return egresoService.findAll();
    }

    @PostMapping
    public Egreso createEgreso(@RequestBody Egreso egreso) {
        return egresoService.save(egreso);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Egreso> getEgresoById(@PathVariable Long id) {
        return egresoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Egreso> updateEgreso(@PathVariable Long id, @RequestBody Egreso egresoDetails) {
        return egresoService.findById(id)
                .map(egresoExistente -> {
                    egresoExistente.setFecha(egresoDetails.getFecha());
                    egresoExistente.setMonto(egresoDetails.getMonto());
                    egresoExistente.setConcepto(egresoDetails.getConcepto());
                    egresoExistente.setNombreBeneficiario(egresoDetails.getNombreBeneficiario());
                    egresoExistente.setTipoIdentificacion(egresoDetails.getTipoIdentificacion());
                    egresoExistente.setNumeroIdentificacion(egresoDetails.getNumeroIdentificacion());
                    egresoExistente.setTelefonoBeneficiario(egresoDetails.getTelefonoBeneficiario());

                    Egreso egresoActualizado = egresoService.save(egresoExistente);
                    return ResponseEntity.ok(egresoActualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEgreso(@PathVariable Long id) {
        if (egresoService.findById(id).isPresent()) {
            egresoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}