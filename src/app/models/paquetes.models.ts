export interface Paquetes {
  id?: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  detalles: paqueteDetails[]
}

export interface paqueteDetails {
  idProducto: number;
  cantidad: number;
  precioDescuente?: number;
}
