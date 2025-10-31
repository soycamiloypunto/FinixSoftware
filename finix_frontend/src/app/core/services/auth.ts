// src/app/core/services/auth.service.ts (Ajustado para SSR/Vite)

import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // <-- Importar PLATFORM_ID y Inject
import { isPlatformBrowser } from '@angular/common'; // <-- Importar isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, JwtResponse } from '../../models/auth.models';

const AUTH_API = 'http://localhost:8081/auth/'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Flag para saber si estamos en el navegador
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object // <-- Inyectar PLATFORM_ID
  ) {
    // Establecer la bandera de la plataforma una sola vez en el constructor
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // --- MÉTODOS DE MANEJO DE ALMACENAMIENTO SEGURO ---

  private setStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private getStorageItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeStorageItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  // ---------------------------------------------------

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AUTH_API + 'login', credentials)
      .pipe(
        tap(response => {
          this.setStorageItem('accessToken', response.token);
          this.setStorageItem('currentUser', JSON.stringify({
            id: response.id,
            username: response.username,
            roles: response.roles,
            email: response.email
          }));
        })
      );
  }

  logout(): void {
    this.removeStorageItem('accessToken');
    this.removeStorageItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    // Usar la función segura
    return !!this.getStorageItem('accessToken');
  }

  getAccessToken(): string | null {
    // Usar la función segura
    return this.getStorageItem('accessToken');
  }

  getUserRoles(): string[] {
    const userStr = this.getStorageItem('currentUser'); // Usar la función segura
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.roles || [];
      } catch (e) {
        // Manejar JSON inválido
        return [];
      }
    }
    return [];
  }
}