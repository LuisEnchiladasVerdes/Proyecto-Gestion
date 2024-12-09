import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

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
}
