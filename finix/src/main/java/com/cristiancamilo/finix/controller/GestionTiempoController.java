package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.dto.AdicionarTiempoRequest;
import com.cristiancamilo.finix.dto.IniciarSesionRequest;
import com.cristiancamilo.finix.model.SesionTiempo;
import com.cristiancamilo.finix.service.GestionTiempoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sesiones")
public class GestionTiempoController {

    @Autowired
    private GestionTiempoService gestionTiempoService;

    @GetMapping("/activas")
    public List<SesionTiempo> getSesionesActivas() {
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
}
