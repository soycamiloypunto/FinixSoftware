// src/app/models/auth.models.ts

/**
 * Interfaz para el cuerpo de la solicitud de Login (POST /auth/login).
 * Corresponde al LoginRequestDTO en Java.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interfaz para la respuesta exitosa de Login (JwtResponseDTO en Java).
 * Contiene el token JWT y los detalles del usuario.
 */
export interface JwtResponse {
  token: string;
  tokenType: string; // Debería ser "Bearer"
  id: number;
  username: string;
  email: string;
  roles: string[]; // Lista de roles del usuario, ej: ["ROLE_USER", "ROLE_ADMIN"]
}