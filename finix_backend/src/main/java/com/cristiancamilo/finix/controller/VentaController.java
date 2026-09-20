package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Venta;
import com.cristiancamilo.finix.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public Mono<List<Venta>> getVentasRecientes() {
        return Mono.fromCallable(() -> {
            return ventaService.findTop20();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public Mono<ResponseEntity<Venta>> registrarVenta(@RequestBody Venta venta) {
        return Mono.fromCallable(() -> {
            try {
                Venta nuevaVenta = ventaService.registrarVenta(venta);
                return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity<Venta>((Venta) null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/by-date")
    public Mono<List<Venta>> getVentasByDateRange(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaFin) {
        return Mono.fromCallable(() -> {
            return ventaService.findByFechaBetween(fechaInicio, fechaFin);
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
