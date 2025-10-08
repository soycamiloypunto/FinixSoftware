// archivo: app/features/egreso/services/egreso.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EgresoModel } from '../models/egreso.model';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/egresos';

  getEgresos(): Observable<EgresoModel[]> {
    return this.http.get<EgresoModel[]>(this.apiUrl);
  }
  
  getEgresoById(id: number): Observable<EgresoModel> {
      return this.http.get<EgresoModel>(`${this.apiUrl}/${id}`);
  }

  createEgreso(egreso: EgresoModel): Observable<EgresoModel> {
    return this.http.post<EgresoModel>(this.apiUrl, egreso);
  }
  
  updateEgreso(id: number, egreso: EgresoModel): Observable<EgresoModel> {
      return this.http.put<EgresoModel>(`${this.apiUrl}/${id}`, egreso);
  }
  
  deleteEgreso(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}