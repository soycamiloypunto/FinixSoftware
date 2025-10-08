// --- archivo: venta.model.ts ---

import { ClienteModel } from '../../cliente/models/cliente.model';
import { ProductoModel } from '../../producto/models/producto.model';

// Este modelo coincide con la entidad VentaDetalle de Java
export interface VentaDetalleModel {
    id?: number;
    // El backend espera el objeto producto, no solo el ID
    producto: Partial<ProductoModel>; 
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

// Este modelo coincide con la entidad Venta de Java
export interface VentaModel {
    id?: number;
    fecha: Date | string; // Permitimos string para el envío de LocalDateTime
    // El backend espera el objeto cliente
    cliente?: Partial<ClienteModel>; 
    totalVenta: number;
    montoPagado?: number;
    cambio?: number;
    detalles: VentaDetalleModel[];
}

// --- archivo: /models/venta.model.ts ---

/**
 * Representa un item de producto vendido, ya sea en una venta normal o
 * como un adicional dentro de una sesión de tiempo.
 */
export interface VentaItem {
  id?: number; // El backend debería devolver el ID del registro creado
  productoId: number;
  nombreProducto: string; // Útil para mostrar en el frontend sin hacer otra consulta
  cantidad: number;
  precioUnitario: number; // Precio al momento de la venta
  total: number;
}