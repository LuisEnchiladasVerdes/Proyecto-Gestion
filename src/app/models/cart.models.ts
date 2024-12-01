import {DetallerCart} from "./detaller-cart.models";

export interface Cart{
  id_carrito?: number,
  token?: string,
  // cliente?: Cliente | null,
  detalles: DetallerCart
}
