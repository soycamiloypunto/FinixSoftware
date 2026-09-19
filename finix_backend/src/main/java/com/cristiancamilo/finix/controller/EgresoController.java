package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Egreso;
import com.cristiancamilo.finix.service.EgresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/egresos")
public class EgresoController {

    @Autowired
    private EgresoService egresoService;

    @GetMapping
    public Mono<List<Egreso>> getAllEgresos() {
        return Mono.fromCallable(() -> {
            return egresoService.findAll();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public Mono<Egreso> createEgreso(@RequestBody Egreso egreso) {
        return Mono.fromCallable(() -> {
            return egresoService.save(egreso);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Egreso>> getEgresoById(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            return egresoService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Egreso>> updateEgreso(@PathVariable Long id, @RequestBody Egreso egresoDetails) {
        return Mono.fromCallable(() -> {
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
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteEgreso(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            if (egresoService.findById(id).isPresent()) {
                egresoService.deleteById(id);
                return ResponseEntity.noContent().<Void>build();
            } else {
                return ResponseEntity.notFound().<Void>build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/by-date")
    public Mono<List<Egreso>> getEgresosByDateRange(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaFin) {
        return Mono.fromCallable(() -> {
            return egresoService.findByFechaBetween(fechaInicio, fechaFin);
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
