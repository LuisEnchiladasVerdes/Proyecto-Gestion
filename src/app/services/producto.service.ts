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

  // addItem(producto : Producto): Observable<Producto>{
  //   return this.http.post<Producto>(`${this.apiUrl}`,producto);
  // }

  addProducto(formData: FormData): Observable<Producto> {
    // El formData ya debería tener la categoría como número
    return this.http.post<Producto>(this.apiUrl, formData);
  }

  getItemById(id: string) : Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${id}/`);
  }

  updateItem(formData: FormData, id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;  // URL con el ID del producto
    return this.http.put(url, formData);
  }

  deleteItem(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }


  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

}
