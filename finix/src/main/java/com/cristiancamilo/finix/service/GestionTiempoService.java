package com.cristiancamilo.finix.service;

import com.cristiancamilo.finix.model.SesionTiempo;
import java.util.List;
import java.util.Optional;

public interface GestionTiempoService {
    List<SesionTiempo> getSesionesActivas();
    Optional<SesionTiempo> findById(Long id);
    // Lógica para iniciar una nueva sesión de tiempo
    SesionTiempo iniciarSesion(Long productoServicioId, Long clienteId, Integer minutos, String puesto);
    // Lógica para finalizar una sesión y calcular el costo
    SesionTiempo finalizarSesion(Long sesionId);
    // Lógica para añadir tiempo extra a una sesión existente
    SesionTiempo adicionarTiempo(Long sesionId, int minutosAdicionales);
}
