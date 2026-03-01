import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

// URL del endpoint de login (para no enviar el token a sí mismo)
const LOGIN_URL = 'http://localhost:8081/auth/login'; 

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    
    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken(); // Obtener el token almacenado

    // Determinar si la solicitud necesita el header de autorización
    const isLoginRequest = req.url.includes(LOGIN_URL);

    let authReq = req;

    if (accessToken && !isLoginRequest) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Si el token expira u ocurre un error de autorización, cerramos la sesión y redirigimos
          authService.logout();
        }
        return throwError(() => error);
      })
    );
};