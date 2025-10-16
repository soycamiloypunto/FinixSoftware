// --- archivo: /services/sesiontiempo.service.ts ---

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SesionTiempo } from '../models/sesiontiempo.model'; // Importamos el modelo corregido
import { AdicionarTiempoRequest, IniciarSesionRequest } from '../dto/sesion.dto'; // Importamos los DTOs
import { environment } from '../../../../enviroments/environment.lan';

@Injectable({
  providedIn: 'root'
})
export class GestionTiempoService {
  private http = inject(HttpClient);
        private apiUrl = `${environment.apiUrl}/sesiones`;


  getSesionesActivas(): Observable<SesionTiempo[]> {
    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/activas`);
  }

  iniciarSesion(request: IniciarSesionRequest): Observable<SesionTiempo> {
    return this.http.post<SesionTiempo>(`${this.apiUrl}/iniciar`, request);
  }
  
  adicionarTiempo(sesionId: number, request: AdicionarTiempoRequest): Observable<SesionTiempo> {
    // La URL correcta según tu Controller es '/adicionar', no '/adicionar-tiempo'
    return this.http.post<SesionTiempo>(`${this.apiUrl}/${sesionId}/adicionar`, request);
  }

  finalizarSesion(sesionId: number): Observable<SesionTiempo> {
    return this.http.post<SesionTiempo>(`${this.apiUrl}/${sesionId}/finalizar`, {});
  }

  // --- MÉTODO ELIMINADO ---
  // Se elimina el método 'venderProducto' porque el endpoint no existe actualmente 
  // en tu GestionTiempoController. Se puede añadir en el futuro cuando el backend lo soporte.
  
}