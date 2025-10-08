// --- archivo: /dto/sesion.dto.ts ---

export interface IniciarSesionRequest {
    productoServicioId: number;
    clienteId?: number;
    minutos?: number;
    puesto?: string;
}

export interface AdicionarTiempoRequest {
    minutosAdicionales: number;
}

export interface AgregarProductoRequest {
  productoId: number;
  cantidad: number;
}