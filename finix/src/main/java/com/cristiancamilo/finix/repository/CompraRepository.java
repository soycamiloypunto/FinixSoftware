package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    List<Compra> findByFechaBetween(ZonedDateTime fechaInicio, ZonedDateTime fechaFin);

}
