import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable, throwError} from "rxjs";
import {Producto} from "../models/producto.models";
import {catchError} from "rxjs/operators";
import {Paquetes} from "../models/paquetes.models";

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {
  private apiUrl = 'http://127.0.0.1:8000/api/administrador/paquetes/';

  private apiUrlCliente = 'http://127.0.0.1:8000/api/clientes/productosClientes/';
  private mediaBaseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getPaquetes(): Observable<Paquetes[]> {
    if (!this.authService.isAdminUser()) {
      return throwError(() => new Error('Acceso denegado: No tienes permisos administrativos.'));
    }

    return this.http.get<Paquetes[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al obtener paquetes:', error);
        return throwError(() => new Error('Error al obtener paquetes.'));
      })
    );
  }

  addPaquete(formData: FormData): Observable<Paquetes> {
    return this.http.post<Paquetes>(this.apiUrl, formData, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al agregar producto:', error);
        return throwError(() => new Error('Error al agregar producto.'));
      })
    );
  }

  getPaqueteById(id: string): Observable<Paquetes> {
    return this.http.get<Paquetes>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  updatePaquete(formData: FormData, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, formData, { headers: this.getHeaders() });
  }

  deletePaquete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

  getProductosCliente(): Observable<Paquetes[]> {
    // return this.http.get<Producto[]>('http://127.0.0.1:8000/api/clientes/productosClientes/');
    return this.http.get<Paquetes[]>(this.apiUrlCliente);

  }

}
