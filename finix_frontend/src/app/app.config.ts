import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importamos la función para proveer HttpClient
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  // Añadimos provideHttpClient() a la lista de proveedores
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient()]
};