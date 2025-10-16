import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoModel } from '../models/producto.model';
import { environment } from '../../../../enviroments/environment.lan';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/productos`;

  getAll(): Observable<ProductoModel[]> {
    return this.http.get<ProductoModel[]>(this.apiUrl);
  }

  create(producto: ProductoModel): Observable<ProductoModel> {
    return this.http.post<ProductoModel>(this.apiUrl, producto);
  }

  update(id: number, producto: ProductoModel): Observable<ProductoModel> {
    return this.http.put<ProductoModel>(`${this.apiUrl}/${id}`, producto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
}

