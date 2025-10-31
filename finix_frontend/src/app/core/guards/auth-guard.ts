// src/app/core/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Esta función se ejecuta antes de que se active la ruta
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Si el AuthService indica que el usuario está logueado (tiene token)
    if (this.authService.isLoggedIn()) {
      return true; // Permite el acceso
    } else {
      // Si no está logueado, redirige a la página de login
      this.router.navigate(['/login']);
      return false; // Bloquea el acceso a la ruta solicitada
    }
  }
}