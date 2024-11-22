import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://127.0.0.1:8000/api/administrador/categorias/';

  constructor(private http: HttpClient) { }

  addCategoria(categoria : Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}`, categoria);
  }

  // Método para obtener las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoriasById(id: string) {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  updateCategorias(categoria : Categoria) {
    return this.http.put(`${this.apiUrl}/${categoria.id}`, categoria);
  }

  deleteCategorias(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
