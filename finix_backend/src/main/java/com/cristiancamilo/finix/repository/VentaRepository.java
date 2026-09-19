package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByFechaBetween(ZonedDateTime fechaInicio, ZonedDateTime fechaFin);

    List<Venta> findByFechaBetweenOrderByFechaDesc(ZonedDateTime start, ZonedDateTime end);
    
    @Query("SELECT COALESCE(SUM(v.totalVenta), 0) FROM Venta v")
    BigDecimal sumarTotalHistoricoVentas();
}
