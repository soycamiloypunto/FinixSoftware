// ruta: com/cristiancamilo/finix/repository/SesionProductoAdicionalRepository.java

package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.SesionProductoAdicional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SesionProductoAdicionalRepository extends JpaRepository<SesionProductoAdicional, Long> {
}