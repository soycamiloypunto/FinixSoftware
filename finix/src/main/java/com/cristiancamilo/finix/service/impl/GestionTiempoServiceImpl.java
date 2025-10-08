package com.cristiancamilo.finix.service.impl;

import com.cristiancamilo.finix.model.EstadoSesion;
import com.cristiancamilo.finix.model.Producto;
import com.cristiancamilo.finix.model.SesionTiempo;
import com.cristiancamilo.finix.repository.ProductoRepository;
import com.cristiancamilo.finix.repository.SesionTiempoRepository;
import com.cristiancamilo.finix.service.GestionTiempoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GestionTiempoServiceImpl implements GestionTiempoService {

    @Autowired
    private SesionTiempoRepository sesionTiempoRepository;

    @Autowired
    private ProductoRepository productoRepository; // Necesario para validar el servicio

    @Override
    public List<SesionTiempo> getSesionesActivas() {
        return sesionTiempoRepository.findByEstado(EstadoSesion.ACTIVA);
    }

    @Override
    public Optional<SesionTiempo> findById(Long id) {
        return sesionTiempoRepository.findById(id);
    }

    @Override
    public SesionTiempo iniciarSesion(Long productoServicioId, Long clienteId, Integer minutos, String puesto) {
        // Lógica de negocio:
        // 1. Validar que el productoServicioId corresponde a un producto que es 'esServicioDeTiempo = true'.
        // 2. Crear una nueva instancia de SesionTiempo.
        // 3. Establecer la hora de inicio, estado, etc.
        // 4. Si 'minutos' no es nulo, calcular la hora de fin.
        // 5. Guardar la nueva sesión en la base de datos.
        Producto servicio = productoRepository.findById(productoServicioId)
                .orElseThrow(() -> new RuntimeException("El servicio de tiempo no existe"));
        if (!servicio.isEsServicioDeTiempo()) {
            throw new RuntimeException("El producto seleccionado no es un servicio de tiempo");
        }

        SesionTiempo nuevaSesion = new SesionTiempo();
        nuevaSesion.setProductoServicio(servicio);
        nuevaSesion.setPuesto(puesto);
        nuevaSesion.setDuracionSolicitadaMinutos(minutos);
        // Lógica para asociar cliente si viene el id
        // ...

        return sesionTiempoRepository.save(nuevaSesion);
    }

    @Override
    public SesionTiempo finalizarSesion(Long sesionId) {
        // Lógica de negocio:
        // 1. Encontrar la sesión por su ID.
        // 2. Cambiar su estado a FINALIZADA.
        // 3. Establecer la hora de fin.
        // 4. Aquí se podría calcular el costo total y prepararlo para la facturación.
        // 5. Guardar los cambios.
        SesionTiempo sesion = sesionTiempoRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));
        sesion.setEstado(EstadoSesion.FINALIZADA);
        sesion.setHoraFin(ZonedDateTime.now(ZoneId.of("America/Bogota")));

        return sesionTiempoRepository.save(sesion);
    }

    @Override
    public SesionTiempo adicionarTiempo(Long sesionId, int minutosAdicionales) {
        // Lógica de negocio:
        // 1. Encontrar la sesión por su ID.
        // 2. Validar que la sesión esté ACTIVA.
        // 3. Actualizar el campo 'duracionSolicitadaMinutos' o la 'horaFin'.
        // 4. Guardar los cambios.
        SesionTiempo sesion = sesionTiempoRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        if (sesion.getEstado() != EstadoSesion.ACTIVA) {
            throw new RuntimeException("No se puede adicionar tiempo a una sesión que no está activa");
        }

        int duracionActual = sesion.getDuracionSolicitadaMinutos() != null ? sesion.getDuracionSolicitadaMinutos() : 0;
        sesion.setDuracionSolicitadaMinutos(duracionActual + minutosAdicionales);

        return sesionTiempoRepository.save(sesion);
    }
}
