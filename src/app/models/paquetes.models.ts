export interface Paquetes {
  id?: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  detalles: paqueteDetails[]
}

export interface paqueteDetails {
  // idProducto: number;
  // cantidad: number;
  // precioDescuento?: number;
  producto: number;
  cantidad: number;
  precio_con_descuento?: number;
}
