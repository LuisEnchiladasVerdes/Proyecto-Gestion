import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {Producto} from "../models/producto.models";
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://127.0.0.1:8000/api/administrador/productos/'; // URL de tu API de categorías
  private mediaBaseUrl = 'http://127.0.0.1:8000'; // Base URL del servidor

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener productos:', error);
        return throwError(() => new Error('Error al obtener productos.'));
      })
    );
  }

  addProducto(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, formData).pipe(
      catchError((error) => {
        console.error('Error al agregar producto:', error);
        return throwError(() => new Error('Error al agregar producto.'));
      })
    );
  }

  getItemById(id: string) : Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${id}/`);
  }

  updateItem(formData: FormData, id: number): Observable<any> {
    const url = (`${this.apiUrl}${id}/`);  // URL con el ID del producto
    return this.http.put(url, formData);
  }

  deleteItem(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

  getProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    const url = `${this.apiUrl}?categoria_id=${categoriaId}`;
    return this.http.get<Producto[]>(url).pipe(
      catchError((error) => {
        console.error('Error al filtrar productos:', error);
        return throwError(() => new Error('Error al filtrar productos.'));
      })
    );
  }



}
