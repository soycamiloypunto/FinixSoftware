// --- archivo: VentaController.java ---

package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Venta;
import com.cristiancamilo.finix.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    // --- ENDPOINT QUE FALTABA ---
    // Este método responde a GET /api/ventas y devuelve la lista de todas las ventas.
    @GetMapping
    public List<Venta> getAllVentas() {
        return ventaService.findAll();
    }

    // --- ENDPOINT PARA CREAR LA VENTA ---
    // Este método responde a POST /api/ventas
    @PostMapping
    public ResponseEntity<Venta> registrarVenta(@RequestBody Venta venta) {
        try {
            Venta nuevaVenta = ventaService.registrarVenta(venta);
            return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
        } catch (Exception e) {
            // Manejo básico de errores
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/by-date")
    public List<Venta> getVentasByDateRange(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime fechaFin) {
        return ventaService.findByFechaBetween(fechaInicio, fechaFin);
    }
}