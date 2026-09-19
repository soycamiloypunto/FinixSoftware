package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Cliente;
import com.cristiancamilo.finix.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
@RestController
@CrossOrigin("*")
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public Mono<List<Cliente>> getAllClientes() {
        return Mono.fromCallable(() -> clienteService.findAll())
                   .subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public Mono<Cliente> createCliente(@RequestBody Cliente cliente) {
        return Mono.fromCallable(() -> clienteService.save(cliente))
                   .subscribeOn(Schedulers.boundedElastic());
    }

    // Aquí irían los demás endpoints para GET por ID, PUT y DELETE, siguiendo el ejemplo de ProveedorController
}
