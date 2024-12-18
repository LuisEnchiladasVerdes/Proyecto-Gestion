import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import {Reserva} from "../models/Reserva.models";
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReservacionService {

  private baseUrl = 'http://127.0.0.1:8000/api/clientes';

  private adminBaseUrl = 'http://127.0.0.1:8000/api/administrador'; // Base URL para administrador

  private reservaSubject = new BehaviorSubject<Reserva | null>(null); // Estado inicial


  constructor(private http: HttpClient) {}


  setReserva(reserva: Reserva): void {
    console.log('Emitiendo nueva reserva:', reserva); // Confirma emisión
    this.reservaSubject.next(reserva);
  }

  getReserva(): Observable<Reserva | null> {
    return this.reservaSubject.asObservable();
  }


  // Enviar código de verificación
  sendVerificationCode(phoneNumber: string, codigoPedido: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-verification-code/`, {
      phone_number: phoneNumber,
      codigo_pedido: codigoPedido,
    });
  }

  // Verificar código
  verifyCode(phoneNumber: string, code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-code/`, {
      phone_number: phoneNumber,
      code: code,
    });
  }



  // Método para obtener la lista de reservas
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.adminBaseUrl}/reservasAdmin/`);
  }


  // Obtener detalles de una reserva por código de pedido
  getReservaByCodigo(codigoPedido: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/detalle/${codigoPedido}`);
  }

  // Obtener detalles de una reserva por código
  getReservaPorCodigo(codigoPedido: string): Observable<Reserva> {
    const url = `${this.baseUrl}/reservas/codigo/${codigoPedido}/`;
    return this.http.get<Reserva>(url).pipe(
      tap((reserva) => this.setReserva(reserva)) // Actualizar el estado local al obtener la reserva
    );
  }



  // Confirmar una reserva (Cliente)
  confirmarReserva(codigoPedido: string): Observable<any> {
    const url = `${this.baseUrl}/confirmar/`;
    return this.http.post(url, { codigo_pedido: codigoPedido }).pipe(
      tap(() => {
        const reserva = this.reservaSubject.value;
        if (reserva) {
          reserva.estado = 'CONFIRMADA';
          this.setReserva(reserva); // Actualizar el estado local
        }
      })
    );
  }

  // Cancelar una reserva
  confirmarCancelacion(codigoPedido: string): Observable<any> {
    const url = `${this.baseUrl}/confirmar-cancelacion/`;
    return this.http.post(url, { codigo_pedido: codigoPedido }).pipe(
      tap(() => {
        const reserva = this.reservaSubject.value;
        if (reserva) {
          reserva.estado_solicitud = 'CANCELAR';
          this.setReserva(reserva); // Actualizar el estado local
        }
      })
    );
  }



  // Confirmar reserva desde el administrador
  confirmarReservaAdmin(codigoPedido: string): Observable<any> {
    const url = `${this.adminBaseUrl}/reservasAdmin/confirmar/`;
    return this.http.post(url, { codigo_pedido: codigoPedido }, {
      withCredentials: true
    });
  }

  // Gestionar solicitud de cancelación (Administrador)
  gestionarSolicitudCancelacion(codigoPedido: string, accion: string): Observable<any> {
    const url = `${this.adminBaseUrl}/reservasAdmin/gestionar-solicitud-cancelacion/${codigoPedido}/`;
    return this.http.post(url, { accion }, {
      withCredentials: true
    });
  }




}
