package com.cristiancamilo.finix.controller;

import com.cristiancamilo.finix.model.Cliente;
import com.cristiancamilo.finix.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteService.findAll();
    }

    @PostMapping
    public Cliente createCliente(@RequestBody Cliente cliente) {
        return clienteService.save(cliente);
    }

    // Aquí irían los demás endpoints para GET por ID, PUT y DELETE, siguiendo el ejemplo de ProveedorController
}
