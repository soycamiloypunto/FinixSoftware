package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.dto.*;
import com.cristiancamilo.finix.model.SesionTiempo;
import com.cristiancamilo.finix.service.GestionTiempoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sesiones")
public class GestionTiempoController {

    @Autowired
    private GestionTiempoService gestionTiempoService;

    @GetMapping("/activas")
    public Mono<List<SesionTiempoDTO>> getSesionesActivas() { 
        return Mono.fromCallable(() -> {
            return gestionTiempoService.getSesionesActivas();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/iniciar")
    public Mono<SesionTiempo> iniciarSesion(@RequestBody IniciarSesionRequest request) {
        return Mono.fromCallable(() -> {
            return gestionTiempoService.iniciarSesion(
                    request.getProductoServicioId(),
                    request.getClienteId(),
                    request.getMinutos(),
                    request.getPuesto()
            );
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/{id}/finalizar")
    public Mono<ResponseEntity<SesionTiempo>> finalizarSesion(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            try {
                return ResponseEntity.ok(gestionTiempoService.finalizarSesion(id));
            } catch (RuntimeException e) {
                return ResponseEntity.status(404).<SesionTiempo>build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/{id}/adicionar")
    public Mono<ResponseEntity<?>> adicionarTiempo(@PathVariable Long id, @RequestBody AdicionarTiempoRequest request) {
        return Mono.fromCallable(() -> {
            try {
                return ResponseEntity.ok(gestionTiempoService.adicionarTiempo(id, request.getMinutosAdicionales()));
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/{id}/productos")
    public Mono<ResponseEntity<?>> agregarProducto(
            @PathVariable Long id,
            @RequestBody AgregarProductoRequest request) {
        return Mono.fromCallable(() -> {
            try {
                VentaItemDTO nuevoItem = gestionTiempoService.agregarProductoASesion(id, request);
                return new ResponseEntity<>(nuevoItem, HttpStatus.CREATED);
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/{id}/cancelar")
    public Mono<ResponseEntity<?>> cancelarSesion(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            try {
                gestionTiempoService.cancelarSesion(id);
                return ResponseEntity.<Void>ok().build();
            } catch (IllegalStateException e) {
                return ResponseEntity.status(HttpStatus.CONFLICT).<Void>build();
            } catch (RuntimeException e) {
                return ResponseEntity.status(404).<SesionTiempo>build();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/finalizadas")
    public Mono<ResponseEntity<List<SesionTiempoDTO>>> getSesionesFinalizadas() {
        return Mono.fromCallable(() -> {
            return ResponseEntity.ok(gestionTiempoService.getSesionesFinalizadas());
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
