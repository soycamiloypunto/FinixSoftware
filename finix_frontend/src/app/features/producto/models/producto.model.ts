// archivo: src/app/features/producto/models/producto.model.ts
import { ProveedorModel } from '../../proveedor/models/proveedor.model';

export interface ProductoModel {
    id?: number;
    nombre: string;
    descripcion?: string;
    precioVenta: number;
    precioCompra: number;
    stock: number; 
    proveedor?: ProveedorModel; // Ya no es proveedorId?: number
    esServicioDeTiempo: boolean;
}