import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = 'http://localhost:3000/inventario'; // URL de tu API de categorías

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]>{
    return this.http.get<Item[]>(this.apiUrl);
  }

  addItem(item : Item): Observable<Item>{
    return this.http.post<Item>(`${this.apiUrl}`,item);
  }

  getItemById(id: string) {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }
  
  updateItem(item: Item) {
    return this.http.put(`${this.apiUrl}/${item.id}`, item);
  }

}
