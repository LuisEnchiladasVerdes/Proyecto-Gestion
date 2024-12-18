import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {AlertService} from "./alert.service";
import {CookieService} from "ngx-cookie-service";
import {Reserva} from "../models/Reserva.models";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/clientes/carritos/';
  private mediaBaseUrl = 'http://127.0.0.1:8000';

  private cartUpdated = new Subject<void>();
  cartUpdated$ = this.cartUpdated.asObservable();

  constructor(private http: HttpClient, private alertService: AlertService, private cookieService: CookieService) {}

  private getCartTokenFromCookies(): string | null {
    const cookies = document.cookie.split(';');
    let cartToken = null;
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'cart_token') {
        cartToken = value;
      }
    });
    return cartToken;
  }

  // OBTENER CARRITO ACTUAL
  getCurrentCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}current/`, { withCredentials: true }).pipe(
      // catchError((error) => {
      //   console.error('Error al obtener el carrito :(:', error);
      //   return throwError(() => new Error('Error al obtener el carrito.'));
      // })
    );
  }

  getMediaBaseUrl(): string {
    return this.mediaBaseUrl;
  }

  notifyCartUpdated(): void {
    this.cartUpdated.next();
  }

  // PRODUCTOS
  addToCart(productoId: number, cantidad: number): Observable<any> {
    const body = {
      producto_id: productoId,
      cantidad: cantidad,
    };

    // Verificar si el cart_token está presente en las cookies
    const cartToken = this.getCartTokenFromCookies();

    return this.http.post<any>(`${this.apiUrl}add-to-cart/`, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al agregar al carrito:', error);
        return throwError(() => new Error('Error al agregar al carrito.'));
      })
    );
  }

  decrementItemInCart(productId: number): Observable<any> {
    const body = { producto_id: productId };
    return this.http.post<any>(`${this.apiUrl}decrement-item/`, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al decrementar el producto:', error);
        return throwError(() => new Error('Error al decrementar el producto.'));
      })
    );
  }

  removeItemFromCart(productoId: number): Observable<{ message: string }> {
    const body = { producto_id: productoId };
    return this.http.request<{ message: string }>('delete', `${this.apiUrl}remove-item/`, { body, withCredentials: true }).pipe(
      tap(() => console.log(`Producto con ID ${productoId} eliminado del carrito.`)),
      catchError((error) => {
        console.error('Error al eliminar el producto del carrito:', error);
        throw new Error('Error al eliminar el producto del carrito.');
      })
    );
  }

  eliminarItemFromCart(productoId: number): Observable<any> {
    const body = {producto_id: productoId };
    return this.http.delete<any>(`${this.apiUrl}remove-item/`, { body, withCredentials: true }).pipe(
      catchError((error) => {
        console.log('Error al eliminar', error);
        throw new Error('Error al eliminar el producto');
      })
    );
  }

  actualizarItemFromCart(productoId: number, cantidad: number): Observable<any> {
    const body = {
      producto_id: productoId,
      cantidad: cantidad
    };

    return this.http.put(`${this.apiUrl}update-cantidad/`, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.log('Error al actualizar la cantidad', error);
        throw new Error('Error al eliminar el producto');
      })
    );
  }




  // SECCION DE PAQUETES
  addPaqueteToCart(paqueteId: number, cantidad: number): Observable<any> {
    const body = {
      paquete_id: paqueteId,
      cantidad: cantidad,
    };

    // Verificar si el cart_token está presente en las cookies
    const cartToken = this.getCartTokenFromCookies();

    return this.http.post<any>(`${this.apiUrl}add-package-to-cart/`, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al agregar al carrito:', error);
        return throwError(() => new Error('Error al agregar al carrito.'));
      })
    );
  }

  decrementPaqueteToCart(paqueteId: number): Observable<any> {
    const body = { paquete_id: paqueteId };

    return this.http.post<any>(`${this.apiUrl}decrement-package/`,  body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.log('Error al decrementar paquetes', error);
        throw new Error('Error al decrementar paquetes');
      }));
  }

  eliminarPaqueteFormCart(paqueteId: number): Observable<any> {
    const body = {paquete_id: paqueteId };

    return this.http.delete<any>(`${this.apiUrl}remove-item/`, { body, withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al decrementar el paquete del carrito:', error);
        return throwError(() => new Error('Error al decrementar el producto.'));
      })
    );
  }

  actualizarPaqueteFormCart(paqueteId: number, cantidad: number): Observable<any> {
    const body = {
      paquete_id: paqueteId,
      cantidad: cantidad
    };

    return this.http.put<any>(`${this.apiUrl}update-cantidad/`, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.log('Error al actualizar la cantidad', error);
        throw new Error('Error al eliminar el producto');
      })
    );
  }




  //
  confirmCart(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}confirm-cart/`, {}, {withCredentials: true}).pipe(
      // tap(() => console.log(`Se confirmo el carrito`)),
      catchError((error) => {
        console.error('Error al confirmar el carrito', error);
        throw new Error('Error al confirmar el carrito.');
      })
    )
  }

  crearReserva(body: Reserva): Observable<any> {
    const url = 'http://127.0.0.1:8000/api/clientes/cliente-reserva/';
    return this.http.post<any>(url, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al crear la reserva:', error);
        return throwError(() => new Error('Error al crear la reserva.'));
      })
    );
  }

  consultarDisponibilidad(mes: number, anio: number): Observable<any> {
    const body = {
      mes: mes,
      año: anio,
    }
    const url = 'http://127.0.0.1:8000/api/clientes/reservas/fechas_horas_ocupadas_mes/';
    return this.http.post<any>(url, body, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al consultar la disponibilidad:', error);
        return throwError(() => new Error('Error al consultar la disponibilidad.'));
      })
    );
  }


}
