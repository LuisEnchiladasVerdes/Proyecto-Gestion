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

  updateItem(producto: Producto) {
    return this.http.put(`${this.apiUrl}${producto.id}`, producto);
  }

  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

}
