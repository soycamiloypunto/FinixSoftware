package com.cristiancamilo.finix.finix_security.repository;

import com.cristiancamilo.finix.finix_security.model.ERole;
import com.cristiancamilo.finix.finix_security.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(ERole nombre);
}