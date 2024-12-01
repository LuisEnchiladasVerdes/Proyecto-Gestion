import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {DetallerCart} from "../models/detaller-cart.models";
import {catchError, tap} from "rxjs/operators";
import {Cart} from "../models/cart.models";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/clientes/carritos/';

  constructor(private http: HttpClient, private alertService: AlertService) {}

  // Agregar producto al carrito
  // addToCart(productoId: number, cantidad: number): Observable<DetallerCart> {
  //   const body = { producto_id: productoId, cantidad };
  //   return this.http
  //     .post<DetallerCart>(`${this.apiUrl}add-to-cart/`, body)
  //     .pipe(
  //       catchError((error) => {
  //         this.alertService.error('Error al agregar al carrito');
  //         return throwError(() => new Error('Error al agregar al carrito.'));
  //       })
  //     );
  // }



  // addToCart(productoId: number, cantidad: number): Observable<any> {
  //   const body = { producto_id: productoId, cantidad };
  //   return this.http.post(`${this.apiUrl}add-to-cart/`, body, { withCredentials: true }).pipe(
  //     catchError((error) => {
  //       console.error('Error al agregar producto al carrito:', error);
  //       throw new Error('Error al agregar producto al carrito.');
  //     })
  //   );
  // }

  addToCart(productoId: number, cantidad: number): Observable<any> {
    const body = { producto_id: productoId, cantidad };

    console.log('Cookie cart_token:', this.getCookie('cart_token'));

    // LOG: Imprime la cookie antes de enviar la solicitud
    console.log('Cookie antes de addToCart:', document.cookie);

    return this.http.post(`${this.apiUrl}add-to-cart/`, body, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Respuesta addToCart:', response); // LOG para verificar la respuesta del backend
      }),
      catchError((error) => {
        console.error('Error al agregar producto al carrito:', error);
        throw new Error('Error al agregar producto al carrito.');
      })
    );
  }

  // Obtener el carrito actual (resumen)
  getCarritoActual(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}current/`, { withCredentials: true }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.warn('Carrito no encontrado, devolviendo carrito vacío.');
          return of({
            id_carrito: undefined,
            token: undefined,
            detalles: [],
          } as Cart); // Devolvemos un carrito vacío
        }
        console.error('Error al obtener el carrito actual:', error);
        throw new Error('Error al obtener el carrito actual.');
      })
    );
  }

  // Eliminar un producto del carrito
  removeItemFromCart(productoId: number): Observable<{ message: string }> {
    const body = { producto_id: productoId };
    return this.http.request<{ message: string }>('delete', `${this.apiUrl}remove-item/`, { body });
  }

  // Limpiar el carrito
  clearCart(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}clear-cart/`);
  }

  // Confirmar el carrito (validar stock y cliente)
  confirmCart(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}confirm-cart/`, {});
  }



  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

}
