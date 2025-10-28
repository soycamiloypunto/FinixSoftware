package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.dto.RegistroUsuarioDTO;
import com.cristiancamilo.finix.model.Usuario;
import com.cristiancamilo.finix.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
// Nota: Deberás asegurar este controlador con Spring Security para que solo el ADMINISTRADOR pueda acceder.
// Por ejemplo: @PreAuthorize("hasRole('ADMINISTRADOR')") en la clase o en los métodos.
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    // POST /api/usuarios
    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody RegistroUsuarioDTO registroDto) {
        try {
            Usuario nuevoUsuario = usuarioService.crearUsuario(registroDto);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Devuelve un 400 Bad Request si el usuario/email ya existe o hay un error en el rol
            return new ResponseEntity<>("{\"message\": \"" + e.getMessage() + "\"}", HttpStatus.BAD_REQUEST);
        }
    }

    // GET /api/usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // PUT /api/usuarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody RegistroUsuarioDTO registroDto) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, registroDto);
            return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"message\": \"" + e.getMessage() + "\"}", HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("{\"message\": \"" + e.getMessage() + "\"}", HttpStatus.NOT_FOUND);
        }
    }

    // DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}