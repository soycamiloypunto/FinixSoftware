// Archivo: src/main/java/com/cristiancamilo/finix/service/impl/EgresoServiceImpl.java
package com.cristiancamilo.finix.service.impl;

import com.cristiancamilo.finix.model.Egreso;
import com.cristiancamilo.finix.repository.EgresoRepository;
import com.cristiancamilo.finix.service.EgresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EgresoServiceImpl implements EgresoService {

    @Autowired
    private EgresoRepository egresoRepository;

    @Override
    public List<Egreso> findAll() {
        return egresoRepository.findAll();
    }

    @Override
    public Optional<Egreso> findById(Long id) {
        return egresoRepository.findById(id);
    }

    @Override
    public Egreso save(Egreso egreso) {
        return egresoRepository.save(egreso);
    }

    @Override
    public void deleteById(Long id) {
        egresoRepository.deleteById(id);
    }
}