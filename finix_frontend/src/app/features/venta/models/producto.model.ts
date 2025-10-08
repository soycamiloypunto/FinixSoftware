export interface ProductoModel {
    id?: number;
    nombre: string;
    descripcion?: string;
    precioVenta: number;
    stock: number;
    proveedorId?: number;
    esServicioDeTiempo?: boolean;
}
