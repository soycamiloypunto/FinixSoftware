import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importamos la función para proveer HttpClient
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/auth.interceptor';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Registrar el proveedor para inyectar el interceptor
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimationsAsync(),
    // Registrar el cliente HTTP, habilitando la inyección de interceptores
    provideHttpClient(withInterceptors([jwtInterceptor])), // <-- USAR withInterceptors
  ]
};