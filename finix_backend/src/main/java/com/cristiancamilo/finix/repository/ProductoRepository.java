package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Busca productos que no sean servicios de tiempo
    List<Producto> findByEsServicioDeTiempoFalse();

    // Busca productos que SÍ sean servicios de tiempo
    List<Producto> findByEsServicioDeTiempoTrue();
}
