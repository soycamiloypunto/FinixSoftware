import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importamos la función para proveer HttpClient
import { provideHttpClient } from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  // Añadimos provideHttpClient() a la lista de proveedores
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),{ provide: LOCALE_ID, useValue: 'es-CO' }]
};