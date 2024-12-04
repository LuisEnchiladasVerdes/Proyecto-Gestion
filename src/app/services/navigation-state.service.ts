import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationStateService {
  private accessRevisar = false;
  private accessConfirmacion = false;
  private accessRealizado = false;

  // Métodos para Revisar
  setAccessRevisar(value: boolean): void {
    this.accessRevisar = value;
  }

  getAccessRevisar(): boolean {
    return this.accessRevisar;
  }

  // Métodos para Confirmación
  setAccessConfirmacion(value: boolean): void {
    this.accessConfirmacion = value;
  }

  getAccessConfirmacion(): boolean {
    return this.accessConfirmacion;
  }

  // Métodos para Realizado
  setAccessRealizado(value: boolean): void {
    this.accessRealizado = value;
  }

  getAccessRealizado(): boolean {
    return this.accessRealizado;
  }
}
