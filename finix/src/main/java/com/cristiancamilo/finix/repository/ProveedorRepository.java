package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    // Aquí puedes añadir métodos de consulta personalizados si los necesitas.
    // Ejemplo: Optional<Proveedor> findByNombre(String nombre);
}
