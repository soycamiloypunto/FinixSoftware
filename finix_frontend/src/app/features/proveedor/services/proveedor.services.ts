import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProveedorModel } from '../models/proveedor.model';
import { environment } from '../../../../enviroments/environment.lan';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/proveedores`;
  

  getAll(): Observable<ProveedorModel[]> {
    return this.http.get<ProveedorModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProveedorModel> {
    return this.http.get<ProveedorModel>(`${this.apiUrl}/${id}`);
  }

  create(proveedor: ProveedorModel): Observable<ProveedorModel> {
    return this.http.post<ProveedorModel>(this.apiUrl, proveedor);
  }

  update(id: number, proveedor: ProveedorModel): Observable<ProveedorModel> {
    return this.http.put<ProveedorModel>(`${this.apiUrl}/${id}`, proveedor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
