package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.dto.RegistroUsuarioDTO;
import com.cristiancamilo.finix.model.Usuario;
import com.cristiancamilo.finix.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    @PostMapping
    public Mono<ResponseEntity<?>> crearUsuario(@RequestBody RegistroUsuarioDTO registroDto) {
        return Mono.fromCallable(() -> {
            try {
                Usuario nuevoUsuario = usuarioService.crearUsuario(registroDto);
                return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>("{\"message\": \"" + e.getMessage() + "\"}", HttpStatus.BAD_REQUEST);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping
    public Mono<ResponseEntity<List<Usuario>>> listarUsuarios() {
        return Mono.fromCallable(() -> {
            List<Usuario> usuarios = usuarioService.listarUsuarios();
            return new ResponseEntity<>(usuarios, HttpStatus.OK);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Usuario>> obtenerUsuarioPorId(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            try {
                Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
                return new ResponseEntity<>(usuario, HttpStatus.OK);
            } catch (RuntimeException e) {
                return new ResponseEntity<Usuario>(HttpStatus.NOT_FOUND);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<?>> actualizarUsuario(@PathVariable Long id, @RequestBody RegistroUsuarioDTO registroDto) {
        return Mono.fromCallable(() -> {
            try {
                Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, registroDto);
                return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>("{\"message\": \"" + e.getMessage() + "\"}", HttpStatus.BAD_REQUEST);
            } catch (RuntimeException e) {
                return new ResponseEntity<>("{\"message\": \"" + e.getMessage() + "\"}", HttpStatus.NOT_FOUND);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<HttpStatus>> eliminarUsuario(@PathVariable Long id) {
        return Mono.fromCallable(() -> {
            try {
                usuarioService.eliminarUsuario(id);
                return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT); 
            } catch (Exception e) {
                return new ResponseEntity<HttpStatus>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
