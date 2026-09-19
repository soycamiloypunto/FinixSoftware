package com.cristiancamilo.finix.service.impl;

import com.cristiancamilo.finix.dto.TotalCajaDTO;
import com.cristiancamilo.finix.repository.CompraRepository;
import com.cristiancamilo.finix.repository.EgresoRepository;
import com.cristiancamilo.finix.repository.VentaRepository;
import com.cristiancamilo.finix.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReporteServiceImpl implements ReporteService {

    private final VentaRepository ventaRepository;
    private final CompraRepository compraRepository;
    private final EgresoRepository egresoRepository;

    @Override
    @Transactional(readOnly = true)
    public TotalCajaDTO obtenerTotalCajaHistorico() {
        // En base de datos el COALESCE garantiza que regrese 0 si no hay tablas o filas
        BigDecimal totalVentas = ventaRepository.sumarTotalHistoricoVentas();
        BigDecimal totalCompras = compraRepository.sumarTotalHistoricoCompras();
        BigDecimal totalEgresos = egresoRepository.sumarTotalHistoricoEgresos();

        // Operacion: Venta - Compra - Egreso
        BigDecimal totalCaja = totalVentas.subtract(totalCompras).subtract(totalEgresos);
        
        return new TotalCajaDTO(totalCaja);
    }
}
