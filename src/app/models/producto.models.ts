export interface Producto{
  id?: number;
  nombre: string;
  categoria: {
    id: number;
    nombre: string;
  };
  descripcion: string;
  stock: number;
  precio_actual: number;
  media_relacionado: string[];
}
