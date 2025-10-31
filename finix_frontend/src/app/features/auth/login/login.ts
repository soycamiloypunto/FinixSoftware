// src/app/features/auth/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para usar *ngIf
import { AuthService } from '../../../core/services/auth';// Asegúrate de que el alias o la ruta sea correcta
import { LoginRequest } from '../../../models/auth.models'; // Asegúrate de que el alias o la ruta sea correcta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario reactivo
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Getter de conveniencia para acceder rápidamente a los controles del formulario
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.errorMessage = ''; // Limpia el error previo

    if (this.loginForm.invalid) {
      // Marcar todos los campos como tocados para mostrar validaciones inmediatamente
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials: LoginRequest = {
        username: this.f['username'].value,
        password: this.f['password'].value
    };

    this.authService.login(credentials)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirige a la página principal (la raíz protegida)
          this.router.navigate(['/']); 
        },
        error: (err) => {
          this.isLoading = false;
          // Manejo del error de autenticación 401 del backend
          if (err.status === 401 || err.error?.message) {
            this.errorMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.';
          } else {
            this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Intenta de nuevo más tarde.';
          }
          console.error('Error de Login:', err);
        }
      });
  }
}