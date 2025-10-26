import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Necesitas importar Router

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home-component.html', // Referencia al HTML separado
  styleUrl: './home-component.css' // Referencia al CSS separado
})
export class HomeComponent {

  // Inyectar el Router en el constructor para la navegación
  constructor(private router: Router) { } 

  navigateToDefault() {
    // Navega a la ruta por defecto (tiempos) que está dentro del Layout
    this.router.navigate(['/tiempos']);
  }
}
