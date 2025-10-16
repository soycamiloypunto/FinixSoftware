// archivo: app/features/compra/services/compra.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraModel } from '../models/compra.model';
import { environment } from '../../../../enviroments/environment.lan';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/compras`;
  

  getCompras(): Observable<CompraModel[]> {
    return this.http.get<CompraModel[]>(this.apiUrl);
  }

  registrarCompra(compra: CompraModel): Observable<CompraModel> {
    return this.http.post<CompraModel>(this.apiUrl, compra);
  }

  findByFechaBetween(fechaInicio: Date, fechaFin: Date): Observable<CompraModel[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio.toISOString())
      .set('fechaFin', fechaFin.toISOString());
    const url = `${this.apiUrl}/by-date`; 

    return this.http.get<CompraModel[]>(url, { params });
  }
}