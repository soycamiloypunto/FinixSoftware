import { Component } from '@angular/core';
// Volvemos a necesitar RouterOutlet aquí
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // Reemplazamos LayoutComponent con RouterOutlet
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Ahora el AppComponent es solo un contenedor para el router.
}