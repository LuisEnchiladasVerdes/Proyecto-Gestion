import {Producto} from "./producto.models";

export interface DetallerCart {
  id_detalle_carrito?: number,
  id_carrito?: number,
  producto: Producto,
  cantidad: number,
  total: number
}
