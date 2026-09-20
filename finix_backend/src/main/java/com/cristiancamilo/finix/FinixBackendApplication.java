package com.cristiancamilo.finix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class FinixBackendApplication {



	public static void main(String[] args) {
		org.springframework.boot.builder.SpringApplicationBuilder builder = new org.springframework.boot.builder.SpringApplicationBuilder(FinixBackendApplication.class);
		builder.headless(false).run(args);
	}

}
