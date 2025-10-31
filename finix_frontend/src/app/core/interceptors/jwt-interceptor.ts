import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core'; // Para inyectar servicios en un interceptor funcional
import { AuthService } from '../services/auth';// Asegúrate de que esta ruta/alias sea correcta

// URL del endpoint de login (para no enviar el token a sí mismo)
const LOGIN_URL = 'http://localhost:8081/auth/login'; 

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    
    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken(); // Obtener el token almacenado

    // Determinar si la solicitud necesita el header de autorización
    const isLoginRequest = req.url.includes(LOGIN_URL);

    if (accessToken && !isLoginRequest) {
      // Si tenemos un token y NO es la petición de login:
      
      // 1. Clonar la solicitud
      const cloned = req.clone({
        // 2. Añadir el header Authorization en formato Bearer
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Pasar la solicitud clonada (con el token) a la siguiente.
      return next(cloned);
    }
    
    // Si no hay token o es la solicitud de login, pasar la solicitud original.
    return next(req);
};