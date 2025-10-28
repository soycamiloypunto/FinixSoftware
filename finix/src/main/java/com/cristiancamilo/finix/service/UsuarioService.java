package com.cristiancamilo.finix.service;

import com.cristiancamilo.finix.dto.RegistroUsuarioDTO;
import com.cristiancamilo.finix.model.ERole;
import com.cristiancamilo.finix.model.Rol;
import com.cristiancamilo.finix.model.Usuario;
import com.cristiancamilo.finix.repository.RolRepository;
import com.cristiancamilo.finix.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    RolRepository rolRepository;

    // Asume que tienes este Bean configurado en tu Spring Security Config
    @Autowired
    PasswordEncoder encoder;

    // --- CRUD: CREATE ---
    @Transactional
    public Usuario crearUsuario(RegistroUsuarioDTO registroDto) {
        if (usuarioRepository.existsByUsername(registroDto.getUsername())) {
            throw new IllegalArgumentException("Error: El nombre de usuario ya está en uso.");
        }
        if (usuarioRepository.existsByEmail(registroDto.getEmail())) {
            throw new IllegalArgumentException("Error: El correo electrónico ya está en uso.");
        }

        // 1. Crear nuevo usuario con la contraseña encriptada
        Usuario usuario = new Usuario(registroDto.getUsername(),
                registroDto.getEmail(),
                encoder.encode(registroDto.getPassword()));

        // 2. Asignar roles
        Set<String> strRoles = registroDto.getRoles();
        Set<Rol> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // Asigna un rol por defecto si no se especifica
            Rol rolInvitado = rolRepository.findByNombre(ERole.ROLE_INVITADO)
                    .orElseThrow(() -> new RuntimeException("Error: Rol INVITADO no encontrado."));
            roles.add(rolInvitado);
        } else {
            strRoles.forEach(role -> {
                switch (role.toUpperCase()) {
                    case "ADMINISTRADOR":
                        Rol rolAdmin = rolRepository.findByNombre(ERole.ROLE_ADMINISTRADOR)
                                .orElseThrow(() -> new RuntimeException("Error: Rol ADMINISTRADOR no encontrado."));
                        roles.add(rolAdmin);
                        break;
                    case "VISUALIZACION":
                        Rol rolVisual = rolRepository.findByNombre(ERole.ROLE_VISUALIZACION)
                                .orElseThrow(() -> new RuntimeException("Error: Rol VISUALIZACION no encontrado."));
                        roles.add(rolVisual);
                        break;
                    case "INVITADO":
                    default:
                        Rol rolInvitado = rolRepository.findByNombre(ERole.ROLE_INVITADO)
                                .orElseThrow(() -> new RuntimeException("Error: Rol INVITADO no encontrado."));
                        roles.add(rolInvitado);
                }
            });
        }

        usuario.setRoles(roles);
        return usuarioRepository.save(usuario);
    }

    // --- CRUD: READ ---
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    // --- CRUD: UPDATE ---
    @Transactional
    public Usuario actualizarUsuario(Long id, RegistroUsuarioDTO registroDto) {
        Usuario usuario = obtenerUsuarioPorId(id);

        // Actualizar datos básicos (si se proporcionan)
        if (registroDto.getUsername() != null && !registroDto.getUsername().equals(usuario.getUsername())) {
            if (usuarioRepository.existsByUsername(registroDto.getUsername())) {
                throw new IllegalArgumentException("Error: El nombre de usuario " + registroDto.getUsername() + " ya existe.");
            }
            usuario.setUsername(registroDto.getUsername());
        }

        if (registroDto.getEmail() != null && !registroDto.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(registroDto.getEmail())) {
                throw new IllegalArgumentException("Error: El email " + registroDto.getEmail() + " ya existe.");
            }
            usuario.setEmail(registroDto.getEmail());
        }

        // Actualizar contraseña si se proporciona
        if (registroDto.getPassword() != null && !registroDto.getPassword().isEmpty()) {
            usuario.setPassword(encoder.encode(registroDto.getPassword()));
        }

        // Actualizar roles (lógica simplificada, similar a la creación)
        if (registroDto.getRoles() != null) {
            Set<Rol> roles = new HashSet<>();
            registroDto.getRoles().forEach(role -> {
                // Implementación de búsqueda de rol similar a la de crearUsuario
                try {
                    ERole eRole = ERole.valueOf("ROLE_" + role.toUpperCase());
                    Rol rol = rolRepository.findByNombre(eRole)
                            .orElseThrow(() -> new RuntimeException("Error: Rol " + role + " no encontrado."));
                    roles.add(rol);
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Error: Nombre de rol inválido: " + role);
                }
            });
            usuario.setRoles(roles);
        }

        return usuarioRepository.save(usuario);
    }

    // --- CRUD: DELETE ---
    @Transactional
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }
}