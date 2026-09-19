package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Compra;
import com.cristiancamilo.finix.service.CompraService;
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
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public Mono<List<Compra>> getAllCompras() {
        return Mono.fromCallable(() -> {
            return compraService.findAll();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Compra>> getCompraById(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            return compraService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public Mono<ResponseEntity<Compra>> createCompra(@RequestBody Compra compra) {
        return Mono.fromCallable(() -> {
            try {
                Compra nuevaCompra = compraService.crearCompra(compra);
                return ResponseEntity.ok(nuevaCompra);
            } catch (Exception e) {
                return ResponseEntity.status(400).<Compra>build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteCompra(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            if (compraService.findById(id).isPresent()) {
                compraService.deleteById(id);
                return ResponseEntity.noContent().<Void>build();
            } else {
                return ResponseEntity.notFound().<Void>build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/by-date")
    public Mono<List<Compra>> getComprasByDateRange(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaFin) {
        return Mono.fromCallable(() -> {
            return compraService.findByFechaBetween(fechaInicio, fechaFin);
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
