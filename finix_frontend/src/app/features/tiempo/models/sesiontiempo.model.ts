// --- archivo: /models/sesiontiempo.model.ts ---

import { ClienteModel } from '../../cliente/models/cliente.model'; // Asumiendo que tienes un modelo de cliente
import { ProductoModel } from '../../producto/models/producto.model';
import { VentaModel } from '../../venta/models/venta.model'; // Asumiendo que tienes un modelo de venta

// El tipo Enum debe coincidir con el del backend
export type EstadoSesion = 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

/**
 * Esta interfaz representa la estructura de datos EXACTA que envía el backend
 * para una SesionTiempo. No contiene campos calculados en el frontend.
 */
export interface SesionTiempo {
    id: number;
    productoServicio: ProductoModel; // El backend envía el objeto completo
    cliente?: ClienteModel; // Es opcional
    horaInicio: string; // LocalDateTime se convierte en string ISO
    horaFin?: string;
    duracionSolicitadaMinutos?: number; // El nombre debe coincidir con el backend
    estado: EstadoSesion;
    venta?: VentaModel;
    puesto?: string;
}