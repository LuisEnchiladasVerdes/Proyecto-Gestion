import {Cliente} from "./cliente.models";
import {Producto} from "./producto.models";

export interface Cart{
  id_carrito?: number,
  token?: string,
  cliente?: Cliente | null,
  fecha_creacion?: string,
  fecha_actualizacion?: string,
  productos_individuales?: ProductosCart[],
  paquetes?: PaquetesCart[],

  total_carrito?: number,
}

export interface ProductosCart {
  id_detalle_carrito?: number,
  id_carrito?: number,
  producto?: Producto | null,
  paquete?: string | null,
  cantidad?: number,
  total?: number,
}

export interface PaquetesCart {
  id?: number;
  nombre?: string;
  descripcion?: string;
  descuento_general?: number;
  precio_original?: number;
  precio_final?: number;
  productos?: PaqueteProductoCart[]; // Lista de productos dentro del paquete
}

export interface PaqueteProductoCart {
  producto?: Producto; // Información del producto
  cantidad?: number; // Cantidad del producto dentro del paquete
  precio_unitario?: number; // Precio unitario con descuento
  total?: number; // Total (cantidad * precio_unitario)
}
