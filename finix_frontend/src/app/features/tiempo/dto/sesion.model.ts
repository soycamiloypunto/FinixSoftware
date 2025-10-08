/**
 * Este archivo define las interfaces para los cuerpos de las peticiones (requests)
 * que se envían desde Angular hacia el backend de Spring Boot.
 * Los nombres de las propiedades deben coincidir EXACTAMENTE con los DTOs de Java.
 */

// Corresponde al DTO usado en el endpoint /api/sesiones/iniciar
export interface IniciarSesionRequest {
    productoServicioId: number;
    minutos?: number;
    clienteId?: number;
    puesto?: string;
}

// Corresponde al DTO usado en el endpoint /api/sesiones/{id}/adicionar
export interface AdicionarTiempoRequest {
    minutosAdicionales: number;
}

// La interfaz VenderProductoRequest se ha eliminado porque el backend no tiene
// un endpoint para recibir esta petición todavía.