package com.cristiancamilo.finix.config;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // Redirigir todos los errores 404 (rutas de Angular) al index.html
        return "forward:/index.html";
    }
}
