package com.cristiancamilo.finix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada principal para la aplicación FINIX Backend.
 */
@SpringBootApplication
public class FinixBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinixBackendApplication.class, args);
		System.out.println("\n¡Backend de FINIX iniciado correctamente!");
		System.out.println("Consola H2 disponible en: http://localhost:8080/h2-console");
	}

}