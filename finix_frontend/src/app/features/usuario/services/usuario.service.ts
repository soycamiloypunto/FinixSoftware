// src/app/features/usuario/services/usuario.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment.lan';

export interface RolModel {
  id?: number;
  nombre: string; // ROLE_ADMINISTRADOR, ROLE_ESTANDAR
}

export interface UsuarioModel {
  id?: number;
  username: string;
  email: string;
  password?: string;
  roles?: RolModel[];
}

export interface RegistroUsuarioDTO {
  username?: string;
  email?: string;
  password?: string;
  roles: string[]; // ['ADMINISTRADOR', 'ESTANDAR']
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getAll(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrl}/${id}`);
  }

  create(dto: RegistroUsuarioDTO): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(this.apiUrl, dto);
  }

  update(id: number, dto: RegistroUsuarioDTO): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
