import { Cliente } from "./cliente.model";
import { Producto } from "./producto.model";

export interface VentaDetalle {
    id?: number;
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
    totalLinea: number;
}

export interface Venta {
    id?: number;
    cliente?: Cliente;
    fecha: Date;
    total: number;
    montoPagado: number;
    cambio: number;
    detalles: VentaDetalle[];
}
