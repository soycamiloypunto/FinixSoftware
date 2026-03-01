package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    List<Compra> findByFechaBetween(ZonedDateTime fechaInicio, ZonedDateTime fechaFin);
    List<Compra> findByFechaBetweenOrderByFechaDesc(ZonedDateTime start, ZonedDateTime end);

    @Query("SELECT COALESCE(SUM(c.totalCompra), 0) FROM Compra c")
    BigDecimal sumarTotalHistoricoCompras();
}
