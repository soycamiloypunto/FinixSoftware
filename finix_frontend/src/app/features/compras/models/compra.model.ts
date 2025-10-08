// archivo: app/features/compra/models/compra.model.ts

import { ProductoModel } from "../../producto/models/producto.model";
import { ProveedorModel } from "../../proveedor/models/proveedor.model";

// Interfaz para el detalle de la compra en el frontend
export interface CompraDetalleUI {
  producto: ProductoModel;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

// Interfaz principal de la Compra
export interface CompraModel {
  id?: number;
  fecha: string;
  proveedor: ProveedorModel;
  totalCompra: number;
  numeroFactura?: string;
  // Para el backend, solo necesitamos enviar una versión simplificada del detalle
  detalles: {
    producto: { id: number | undefined };
    cantidad: number;
    costoUnitario: number;
  }[];
}