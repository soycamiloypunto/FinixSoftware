import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment.lan';

export interface TotalCajaDTO {
  totalHistorico: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reportes`;

  getTotalCajaHistorico(): Observable<TotalCajaDTO> {
    return this.http.get<TotalCajaDTO>(`${this.baseUrl}/total-caja-historico`);
  }
}
