package com.cristiancamilo.finix;

import com.cristiancamilo.finix.model.ERole;
import com.cristiancamilo.finix.model.Rol;
import com.cristiancamilo.finix.model.Usuario;
import com.cristiancamilo.finix.repository.RolRepository;
import com.cristiancamilo.finix.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RolRepository rolRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Inicialización de Roles (Asegura que los tipos de rol existen)
        Arrays.asList(ERole.values()).forEach(roleName -> {
            if (rolRepository.findByNombre(roleName).isEmpty()) {
                rolRepository.save(new Rol(roleName));
                System.out.println("Rol creado: " + roleName);
            }
        });

        // 2. Creación del Usuario de Bootstrap (Solo si no hay usuarios)
        if (usuarioRepository.count() == 0) {
            System.out.println("No se encontraron usuarios. Creando usuario de bootstrap...");

            // Busca el rol ADMINISTRADOR que acabamos de asegurar que existe
            Rol rolAdmin = rolRepository.findByNombre(ERole.ROLE_ADMINISTRADOR)
                    .orElseThrow(() -> new RuntimeException("Error fatal: Rol ADMINISTRADOR no encontrado después de inicialización."));

            Set<Rol> roles = new HashSet<>();
            roles.add(rolAdmin);

            // Crea el usuario
            Usuario adminBootstrap = new Usuario(
                    "superadmin", // Nombre de usuario por defecto
                    "admin@localhost.com",
                    passwordEncoder.encode("Finix@2025") // Contraseña inicial fuerte
            );
            adminBootstrap.setRoles(roles);

            usuarioRepository.save(adminBootstrap);

            System.out.println("************************************************************");
            System.out.println("USUARIO DE BOOTSTRAP CREADO:");
            System.out.println("Usuario: superadmin");
            System.out.println("Contraseña: Finix@2025");
            System.out.println("************************************************************");
        }
    }
}
