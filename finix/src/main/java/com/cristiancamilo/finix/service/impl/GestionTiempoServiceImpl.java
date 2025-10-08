package com.cristiancamilo.finix.service.impl;

import com.cristiancamilo.finix.dto.AgregarProductoRequest;
import com.cristiancamilo.finix.dto.ProductoDTO;
import com.cristiancamilo.finix.dto.SesionTiempoDTO;
import com.cristiancamilo.finix.dto.VentaItemDTO;
import com.cristiancamilo.finix.model.EstadoSesion;
import com.cristiancamilo.finix.model.Producto;
import com.cristiancamilo.finix.model.SesionProductoAdicional;
import com.cristiancamilo.finix.model.SesionTiempo;
import com.cristiancamilo.finix.repository.ProductoRepository;
import com.cristiancamilo.finix.repository.SesionProductoAdicionalRepository;
import com.cristiancamilo.finix.repository.SesionTiempoRepository;
import com.cristiancamilo.finix.service.GestionTiempoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GestionTiempoServiceImpl implements GestionTiempoService {

    @Autowired
    private SesionTiempoRepository sesionTiempoRepository;

    @Autowired
    private SesionProductoAdicionalRepository sesionProductoAdicionalRepository; // <-- NUEVO REPO


    @Autowired
    private ProductoRepository productoRepository; // Necesario para validar el servicio

    @Override
    public List<SesionTiempoDTO> getSesionesActivas() {
        // 1. Obtenemos las entidades como siempre
        List<SesionTiempo> sesionesActivas = sesionTiempoRepository.findByEstado(EstadoSesion.ACTIVA);

        // 2. Las convertimos a una lista de DTOs
        return sesionesActivas.stream()
                .map(this::convertirASesionTiempoDTO) // Usamos un método ayudante
                .collect(Collectors.toList());
    }

    // --- MÉTODO AYUDANTE PRIVADO PARA LA CONVERSIÓN ---
    private SesionTiempoDTO convertirASesionTiempoDTO(SesionTiempo sesion) {
        // Convertir el producto de servicio a su DTO
        ProductoDTO productoServicioDTO = ProductoDTO.builder()
                .id(sesion.getProductoServicio().getId())
                .nombre(sesion.getProductoServicio().getNombre())
                .precioVenta(sesion.getProductoServicio().getPrecioVenta())
                .esServicioDeTiempo(sesion.getProductoServicio().isEsServicioDeTiempo())
                .build();

        // Convertir la lista de productos adicionales a una lista de VentaItemDTO
        List<VentaItemDTO> productosAdicionalesDTO = sesion.getProductosAdicionales().stream()
                .map(item -> VentaItemDTO.builder()
                        .id(item.getId())
                        .productoId(item.getProducto().getId()) // <-- El ID que necesita el 'track'
                        .nombreProducto(item.getProducto().getNombre()) // <-- El nombre que faltaba
                        .cantidad(item.getCantidad())
                        .precioUnitario(item.getPrecioUnitarioVenta())
                        .total(item.getTotalVenta()) // <-- El total que faltaba
                        .build())
                .collect(Collectors.toList());

        // Construir y devolver el DTO principal de la sesión
        return SesionTiempoDTO.builder()
                .id(sesion.getId())
                .horaInicio(sesion.getHoraInicio())
                .horaFin(sesion.getHoraFin())
                .duracionSolicitadaMinutos(sesion.getDuracionSolicitadaMinutos())
                .estado(sesion.getEstado())
                .puesto(sesion.getPuesto())
                .productoServicio(productoServicioDTO) // <-- DTO anidado
                .productosAdicionales(productosAdicionalesDTO) // <-- Lista de DTOs anidada
                .build();
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

    // --- IMPLEMENTACIÓN DE LA NUEVA LÓGICA ---
    @Override
    public VentaItemDTO agregarProductoASesion(Long sesionId, AgregarProductoRequest request) {
        // 1. Validar que la sesión exista y esté activa
        SesionTiempo sesion = sesionTiempoRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));
        if (sesion.getEstado() != EstadoSesion.ACTIVA) {
            throw new RuntimeException("Solo se pueden agregar productos a sesiones activas");
        }

        // 2. Validar que el producto exista
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // (Opcional) Aquí podrías validar el stock del producto si lo manejas

        // 3. Crear la nueva entidad
        SesionProductoAdicional nuevoItem = new SesionProductoAdicional();
        nuevoItem.setSesionTiempo(sesion);
        nuevoItem.setProducto(producto);
        nuevoItem.setCantidad(request.getCantidad());
        nuevoItem.setPrecioUnitarioVenta(producto.getPrecioVenta());
        nuevoItem.setTotalVenta(producto.getPrecioVenta().multiply(BigDecimal.valueOf(request.getCantidad())));

        // 4. Guardar en la base de datos
        SesionProductoAdicional itemGuardado = sesionProductoAdicionalRepository.save(nuevoItem);

        // 5. Convertir la entidad guardada a un DTO para la respuesta
        return VentaItemDTO.builder()
                .id(itemGuardado.getId())
                .productoId(itemGuardado.getProducto().getId())
                .nombreProducto(itemGuardado.getProducto().getNombre())
                .cantidad(itemGuardado.getCantidad())
                .precioUnitario(itemGuardado.getPrecioUnitarioVenta())
                .total(itemGuardado.getTotalVenta())
                .build();
    }

    @Override
    public void cancelarSesion(Long sesionId) {
        // 1. Encontrar la sesión por su ID. Si no existe, lanza una excepción.
        SesionTiempo sesion = sesionTiempoRepository.findById(sesionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sesionId));

        // 2. Regla de Negocio CRÍTICA: Validar que no tenga productos adicionales.
        //    Usamos .isEmpty() que es muy eficiente.
        if (!sesion.getProductosAdicionales().isEmpty()) {
            throw new IllegalStateException("No se puede cancelar una sesión que ya tiene productos vendidos.");
        }

        // 3. Si la validación pasa, eliminar la sesión de la base de datos.
        //    Esto cumple con "no hace ningun registro".
        sesionTiempoRepository.delete(sesion);
    }
}
