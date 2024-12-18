import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Reserva} from "../models/Reserva.models";
import {Cart} from "../models/cart.models";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private fechaSeleccionada: string | null = null; // Variable para almacenar la fecha seleccionada
  private horaSeleccionada: string | null = null; // Variable para almacenar la hora seleccionada

  // Setter para la fecha seleccionada
  setFechaSeleccionada(fecha: string): void {
    this.fechaSeleccionada = fecha;
  }

  // Getter para la fecha seleccionada
  getFechaSeleccionada(): string | null {
    return this.fechaSeleccionada;
  }

  // Setter para la hora seleccionada
  setHoraSeleccionada(hora: string): void {
    this.horaSeleccionada = hora;
  }

  // Getter para la hora seleccionada
  getHoraSeleccionada(): string | null {
    return this.horaSeleccionada;
  }


  //TRANFERENCIA DE CARRITO
  private cart : Cart | null = null;

  setCart(cart : Cart): void {
    this.cart = cart ;
  }

  getCart(): Cart | null {
    return this.cart;
  }


  //TRASNFERENCIA DE RESERVA
  private reserva: Reserva | null = null;

  setReserva(reserva: Reserva ): void {
    this.reserva = reserva;
  }

  getReserva(): Reserva | null {
    return this.reserva;
  }

}
