package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.dto.TotalCajaDTO;
import com.cristiancamilo.finix.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/total-caja-historico")
    public ResponseEntity<TotalCajaDTO> obtenerTotalCajaHistorico() {
        return ResponseEntity.ok(reporteService.obtenerTotalCajaHistorico());
    }
}
