package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.dto.*;
import com.cristiancamilo.finix.model.SesionTiempo;
import com.cristiancamilo.finix.service.GestionTiempoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sesiones")
public class GestionTiempoController {

    @Autowired
    private GestionTiempoService gestionTiempoService;

    @GetMapping("/activas")
    public List<SesionTiempoDTO> getSesionesActivas() { // <-- Cambia el tipo de retorno aquí
        return gestionTiempoService.getSesionesActivas();
    }

    @PostMapping("/iniciar")
    public SesionTiempo iniciarSesion(@RequestBody IniciarSesionRequest request) {
        return gestionTiempoService.iniciarSesion(
                request.getProductoServicioId(),
                request.getClienteId(),
                request.getMinutos(),
                request.getPuesto()
        );
    }

    @PostMapping("/{id}/finalizar")
    public ResponseEntity<SesionTiempo> finalizarSesion(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(gestionTiempoService.finalizarSesion(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/adicionar")
    public ResponseEntity<SesionTiempo> adicionarTiempo(@PathVariable Long id, @RequestBody AdicionarTiempoRequest request) {
        try {
            return ResponseEntity.ok(gestionTiempoService.adicionarTiempo(id, request.getMinutosAdicionales()));
        } catch (RuntimeException e) {
            // Podríamos devolver un badRequest si la sesión no está activa
            return ResponseEntity.badRequest().build();
        }
    }

    // --- NUEVO ENDPOINT ---
    @PostMapping("/{id}/productos")
    public ResponseEntity<VentaItemDTO> agregarProducto(
            @PathVariable Long id,
            @RequestBody AgregarProductoRequest request) {
        try {
            VentaItemDTO nuevoItem = gestionTiempoService.agregarProductoASesion(id, request);
            return new ResponseEntity<>(nuevoItem, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Aquí podrías manejar diferentes excepciones y devolver diferentes códigos de error
            return ResponseEntity.badRequest().build();
        }
    }

    // Dentro de la clase GestionTiempoController

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarSesion(@PathVariable Long id) {
        try {
            gestionTiempoService.cancelarSesion(id);
            // Si no hay errores, devolvemos un 200 OK sin cuerpo.
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            // Si se intenta cancelar con productos, devolvemos 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (RuntimeException e) {
            // Si la sesión no se encuentra, devolvemos 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }
}
