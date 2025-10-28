package com.cristiancamilo.finix.repository;

import com.cristiancamilo.finix.model.ERole;
import com.cristiancamilo.finix.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(ERole nombre);
}