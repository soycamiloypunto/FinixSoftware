// src/app/core/guards/admin-guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Si el usuario está logueado y es ADMINISTRADOR, permitimos el acceso
    if (this.authService.isLoggedIn() && this.authService.getUserRoles().includes('ROLE_ADMINISTRADOR')) {
      return true;
    } else {
      // De lo contrario, redirigimos al home
      this.router.navigate(['/']);
      return false;
    }
  }
}
