// Archivo: src/main/java/com/cristiancamilo/finix/service/EgresoService.java
package com.cristiancamilo.finix.service;

import com.cristiancamilo.finix.model.Egreso;

import java.util.List;
import java.util.Optional;

public interface EgresoService {

    List<Egreso> findAll();

    Optional<Egreso> findById(Long id);

    Egreso save(Egreso egreso);

    void deleteById(Long id);
}