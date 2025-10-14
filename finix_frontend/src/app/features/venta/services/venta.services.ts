// --- archivo: venta.services.ts ---

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { VentaModel } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ventas';

  // Cambiado para coincidir con el backend
  registrarVenta(venta: VentaModel): Observable<VentaModel> {
    return this.http.post<VentaModel>(this.apiUrl, venta);
  }

  // Nuevo método para traer las últimas ventas
  getUltimasVentas(limite: number): Observable<VentaModel[]> {
    // Asumimos que /api/ventas devuelve todas las ventas.
    // Lo ideal en el futuro es que el backend soporte paginación (ej: /api/ventas?limite=20)
    return this.http.get<VentaModel[]>(this.apiUrl).pipe(
      map(ventas => ventas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())), // Ordenar por fecha descendente
      map(ventas => ventas.slice(0, limite)) // Tomar solo las últimas 'limite' ventas
    );
  }

  findByFechaBetween(fechaInicio: Date, fechaFin: Date): Observable<VentaModel[]> {
    // Creamos los parámetros para la petición HTTP de forma segura
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio.toISOString()) // Convertimos la fecha a string ISO
      .set('fechaFin', fechaFin.toISOString());   // Ejemplo: "2025-10-14T05:00:00.000Z"

     const url = `${this.apiUrl}/by-date`; 

    return this.http.get<VentaModel[]>(url, { params });
  }

}