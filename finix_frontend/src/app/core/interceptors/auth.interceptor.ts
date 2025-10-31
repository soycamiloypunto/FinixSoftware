// src/app/core/interceptors/jwt.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

// URL del endpoint de login (para no enviar el token a sí mismo)
const LOGIN_URL = 'http://localhost:8080/auth/login'; // ¡Ajusta el dominio/puerto!

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // 1. Obtener el token de acceso
    const accessToken = this.authService.getAccessToken();

    // 2. Determinar si la solicitud necesita el header de autorización
    // Solo se debe añadir si hay un token y si NO es la solicitud de login
    const isLoginRequest = request.url.includes(LOGIN_URL);

    if (accessToken && !isLoginRequest) {
      // 3. Clonar la solicitud y añadir el header de autorización
      request = request.clone({
        setHeaders: {
          // El formato 'Bearer <token>' es el que espera tu backend (AuthTokenFilter.java)
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    // 4. Continuar con el flujo de la solicitud modificada (o la original)
    return next.handle(request);
  }
}