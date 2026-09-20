package com.cristiancamilo.finix.config;

import com.cristiancamilo.finix.model.ERole;
import com.cristiancamilo.finix.model.Rol;
import com.cristiancamilo.finix.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRoles(RolRepository rolRepository) {
        return args -> {
            Arrays.stream(ERole.values()).forEach(role -> {
                if (rolRepository.findByNombre(role).isEmpty()) {
                    rolRepository.save(new Rol(role));
                }
            });
        };
    }
}
