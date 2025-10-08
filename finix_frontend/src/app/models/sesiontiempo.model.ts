import { Cliente } from "./cliente.model";
import { Producto } from "./producto.model";
import { VentaDetalle } from "./venta.model";

export interface SesionTiempo {
    id: number;
    productoServicio: Producto;
    cliente?: Cliente;
    horaInicio: string; // Se recibe como string, se convierte a Date
    horaFin?: string;
    duracionSolicitadaMinutos?: number;
    puesto: string;
    estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';
    
    // --- Campos solo para el Frontend ---
    tiempoTranscurridoStr?: string;
    consumosProductos?: VentaDetalle[];
    totalConsumoProductos?: number;
    totalConsumoTiempo?: number;
    alertaTiempo?: boolean;
}
