import {Categoria} from "./categoria.models";

export interface Producto{
  id?: number;
  nombre: string;
  descripcion: string;
  stock: number;
  categoria: Categoria
  precio_actual: number;
  media_relacionado?: string[];
}
