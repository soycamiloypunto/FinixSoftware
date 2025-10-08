// archivo: app/features/compra/services/compra.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraModel } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/compras';

  getCompras(): Observable<CompraModel[]> {
    return this.http.get<CompraModel[]>(this.apiUrl);
  }

  registrarCompra(compra: CompraModel): Observable<CompraModel> {
    return this.http.post<CompraModel>(this.apiUrl, compra);
  }
}