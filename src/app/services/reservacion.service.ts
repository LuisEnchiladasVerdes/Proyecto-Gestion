import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Reserva} from "../models/Reserva.models";

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {

  private baseUrl = 'http://127.0.0.1:8000/api/clientes';

  private adminBaseUrl = 'http://127.0.0.1:8000/api/administrador'; // Base URL para administrador

  constructor(private http: HttpClient) {}

  sendVerificationCode(phoneNumber: string, codigoPedido: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-verification-code/`, {
      phone_number: phoneNumber,
      codigo_pedido: codigoPedido,
    });
  }

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



  // Confirmar una reserva
  confirmarReserva(codigoPedido: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirmar/`, { codigo_pedido: codigoPedido });
  }

  // Confirmar la cancelación de una reserva
  confirmarCancelacion(codigoPedido: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirmar-cancelacion/`, { codigo_pedido: codigoPedido });
  }

}
