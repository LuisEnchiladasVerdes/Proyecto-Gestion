import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Producto} from "../models/producto.models";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://127.0.0.1:8000/api/administrador/productos/'; // URL de tu API de categorías
  private mediaBaseUrl = 'http://127.0.0.1:8000'; // Base URL del servidor

  constructor(private http: HttpClient) { }

  getProducto(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.apiUrl);
  }

  addItem(producto : Producto): Observable<Producto>{
    return this.http.post<Producto>(`${this.apiUrl}`,producto);
  }

  getItemById(id: string) : Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${id}/`);
  }

  // updateItem(producto: Producto) : Observable<Producto> {
  //   return this.http.put(`${this.apiUrl}${producto.id}`, producto);
  //
  //   return this.http.put(`${this.apiUrl}${producto.id}`, {
  //     nombre: producto.nombre,
  //     stock: producto.stock,
  //     precio_actual: producto.precio_actual
  //   });
  //
  //   const payload = {
  //     nombre: producto.nombre,
  //     descripcion: producto.descripcion,
  //     stock: producto.stock,
  //     precio: producto.precio_actual,
  //     media_relacionado: producto.media_relacionado
  //   };
  //   return this.http.put<Producto>(`${this.apiUrl}${producto.id}`, payload);
  // }

  updateItem(formData: FormData, id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;  // URL con el ID del producto
    return this.http.put(url, formData);
  }


  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

}
