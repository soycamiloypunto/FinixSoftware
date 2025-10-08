import { Producto } from "./producto.model.js";

export interface Proveedor {
    id?: number;
    nombre: string;
    contacto?: string;
    telefono?: string;
    direccion?: string;
    email?: string;
}
