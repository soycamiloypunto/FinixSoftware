import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteModel } from '../models/cliente.model';
import { environment } from '../../../../enviroments/environment.lan';

@Injectable({
  // Proveer el servicio directamente aquí es una alternativa a proveerlo en el componente.
  // Para una arquitectura estrictamente modular, a veces se provee en el componente mismo.
  // Por ahora, 'root' está bien para simplificar.
  providedIn: 'root' 
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  getAll(): Observable<ClienteModel[]> {
    return this.http.get<ClienteModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.apiUrl}/${id}`);
  }

  create(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.apiUrl, cliente);
  }

  update(id: number, cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.put<ClienteModel>(`${this.apiUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
