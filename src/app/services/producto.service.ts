import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Producto } from '../models/producto.models';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/api/administrador/productos/';
  private mediaBaseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProductos(): Observable<Producto[]> {
    if (!this.authService.isAdminUser()) {
      return throwError(() => new Error('Acceso denegado: No tienes permisos administrativos.'));
    }

    return this.http.get<Producto[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al obtener productos:', error);
        return throwError(() => new Error('Error al obtener productos.'));
      })
    );
  }

  addProducto(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, formData, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al agregar producto:', error);
        return throwError(() => new Error('Error al agregar producto.'));
      })
    );
  }

  getItemById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  updateItem(formData: FormData, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, formData, { headers: this.getHeaders() });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

  getProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}?categoria_id=${categoriaId}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al filtrar productos:', error);
        return throwError(() => new Error('Error al filtrar productos.'));
      })
    );
  }
}
