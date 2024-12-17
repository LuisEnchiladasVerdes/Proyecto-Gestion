import { Producto } from "./producto.models";

export interface Paquetes {
  id?: number;
  nombre: string;
  descripcion: string;
  descuento_general?: number | null;

  precio_original?: number;
  descuento_aplicado?: number;
  precio_final?: number;

  detalles?: paquetePost[]; // Para creación/edición
  media?: File[];

  detalles_relacionados?: paqueteGet[]; // Para respuestas de API
  media_urls?: string[];
}

export interface paquetePost {
  producto: number ;
  cantidad: number;
}

export interface paqueteGet {
  producto: Producto;
  producto_id: number;
  cantidad: number;
  precio_unitario?: number;
  total?: number;
}
