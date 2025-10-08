// --- archivo: auth.interceptor.ts ---

import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos PLATFORM_ID para saber en qué entorno estamos
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;

  // --- INICIO DE LA CORRECCIÓN ---
  // Verificamos si estamos en el entorno del navegador
  if (isPlatformBrowser(platformId)) {
    // Si estamos en el navegador, podemos acceder a localStorage de forma segura
    token = localStorage.getItem('auth_token');
  }
  // --- FIN DE LA CORRECCIÓN ---

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(authReq);
};