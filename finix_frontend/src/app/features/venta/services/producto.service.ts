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


  // Este método trae TODOS los productos.
  getAll(): Observable<ProductoModel[]> {
    return this.http.get<ProductoModel[]>(this.apiUrl);
  }

  // --- MÉTODO MODIFICADO ---
  // Antes, este método filtraba los productos que eran 'esServicioDeTiempo'.
  // Ahora, simplemente llama a getAll() para traer TODOS los productos sin distinción.
  getProductosParaVenta(): Observable<ProductoModel[]> {
    return this.getAll();
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