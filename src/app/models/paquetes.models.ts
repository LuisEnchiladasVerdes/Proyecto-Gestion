import {Producto} from "./producto.models";

export interface Paquetes {
  id?: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  precio_total_sin_descuento?: number;
  ahorro_total?: number;
  descuento_total?: number;
  detalles: paqueteDetails[]
}

export interface paqueteDetails {
  producto: number;
  detalles_producto?: Producto;
  cantidad: number;
  precio_con_descuento?: number;
}
