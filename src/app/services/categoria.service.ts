import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:3000/categoria';
  // private apiUrl = 'https://769b-2806-10ae-3-e8a9-5c68-5f6f-d886-971d.ngrok-free.app/categorias';


  constructor(private http: HttpClient) { }

  // Método para obtener las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  addCategoria(categoria : Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}`, categoria);
  }

}
