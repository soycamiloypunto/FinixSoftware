package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.EstadoSesion;
import com.cristiancamilo.finix.model.SesionTiempo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SesionTiempoRepository extends JpaRepository<SesionTiempo, Long> {
    // Método para encontrar todas las sesiones que están activas
    List<SesionTiempo> findByEstado(EstadoSesion estado);
}
