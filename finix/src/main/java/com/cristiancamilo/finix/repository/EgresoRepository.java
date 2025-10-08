// Archivo: src/main/java/com/cristiancamilo/finix/repository/EgresoRepository.java
package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.Egreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EgresoRepository extends JpaRepository<Egreso, Long> {
    // JpaRepository ya nos da métodos como findAll(), findById(), save(), deleteById(), etc.
}