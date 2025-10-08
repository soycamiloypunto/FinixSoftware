import { Proveedor } from "./proveedor.model";

export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precioVenta: number;
    precioCompra: number;
    stock: number;
    proveedor: Proveedor;
    esServicioDeTiempo: boolean;
}
