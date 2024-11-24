import {Categoria} from "./categoria.models";

export interface Producto{
  // id?: number;
  // nombre: string;
  // descripcion: string;
  // stock: number;
  // categoria: Categoria;
  // precio_actual: number;
  // media_relacionado?: string[];

  id?: number; // Opcional para cuando creas un nuevo producto
  nombre: string;
  descripcion: string;
  stock: number;
  categoria: Categoria; // Para mostrar la categoría (GET)
  categoria_id?: number; // Para enviar la ID de la categoría (POST/PUT)
  precio: number; // Precio opcional para crear/actualizar
  precio_actual: number; // Precio actual mostrado (GET)
  media?: File[]; // Para enviar imágenes al backend
  media_relacionado?: string[]; // URLs de las imágenes asociadas (GET)
}
