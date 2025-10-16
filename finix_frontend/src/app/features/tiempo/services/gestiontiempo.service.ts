// --- archivo: /services/sesiontiempo.service.ts ---

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Modelos y DTOs ---
import { SesionTiempo } from '../models/sesiontiempo.model';
import { VentaItem } from '../../venta/models/venta.model'; // <-- Importamos el nuevo modelo
import {
  AdicionarTiempoRequest,
  IniciarSesionRequest,
  AgregarProductoRequest // <-- Importamos el nuevo DTO
} from '../dto/sesion.dto';
import { environment } from '../../../../enviroments/environment.lan';

@Injectable({
  providedIn: 'root'
})
export class GestionTiempoService {
  private http = inject(HttpClient);
  // Usamos una URL base para que sea más fácil de cambiar en el futuro.
      private apiUrl = `${environment.apiUrl}/sesiones`;


  getSesionesActivas(): Observable<SesionTiempo[]> {
    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/activas`);
  }

  iniciarSesion(request: IniciarSesionRequest): Observable<SesionTiempo> {
    return this.http.post<SesionTiempo>(`${this.apiUrl}/iniciar`, request);
  }

  adicionarTiempo(sesionId: number, request: AdicionarTiempoRequest): Observable<SesionTiempo> {
    return this.http.post<SesionTiempo>(`${this.apiUrl}/${sesionId}/adicionar`, request);
  }

  finalizarSesion(sesionId: number): Observable<SesionTiempo> {
    return this.http.post<SesionTiempo>(`${this.apiUrl}/${sesionId}/finalizar`, {});
  }

  // ===========================================================================
  // ===           NUEVO MÉTODO PERFECTAMENTE INTEGRADO                      ===
  // ===========================================================================
  /**
   * Agrega un producto como venta adicional a una sesión de tiempo activa.
   * @param sesionId El ID de la sesión a la que se agregará el producto.
   * @param request El DTO con la información del producto y la cantidad.
   * @returns Un Observable que emite el objeto VentaItem creado en el backend.
   */
  agregarProductoASesion(sesionId: number, request: AgregarProductoRequest): Observable<VentaItem> {
    // Este endpoint sigue la convención REST para añadir un sub-recurso a un recurso existente.
    // POST /api/sesiones/{sesionId}/productos
    return this.http.post<VentaItem>(`${this.apiUrl}/${sesionId}/productos`, request);
  }

  cancelarSesion(sesionId: number): Observable<void> {
    // Usaremos un POST para mantener consistencia con finalizarSesion
    return this.http.post<void>(`${this.apiUrl}/${sesionId}/cancelar`, {});
    }

     getSesionesFinalizadas(): Observable<SesionTiempo[]> {
    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`);
  }
}