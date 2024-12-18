import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../../../../services/alert.service";
import { ReservacionService } from '../../../../../services/reservacion.service';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  formularioReserva: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private ReservacionService: ReservacionService
  ) {
    this.formularioReserva = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  onSubmit(): void {
    if (this.formularioReserva.valid) {
      const { codigo, telefono } = this.formularioReserva.value;
      console.log('Formulario válido. Enviando código:', { codigo, telefono }); // Verificar valores del formulario

      // Paso 1: Enviar código de verificación
      this.ReservacionService.sendVerificationCode(telefono, codigo).subscribe({
        next: () => {
          console.log('Código de verificación enviado. Telefono:', telefono); // Confirmar que se envió correctamente

          this.alertService.success('Código enviado. Por favor, espera...');
          this.verifyCode(telefono); // Llamar a la verificación
        },
        error: (error) => {
          this.alertService.error('Error al enviar el código. Intenta nuevamente.');
          console.error(error);
        },
      });
    } else {
      this.alertService.error('Por favor, revisa que todos los campos sean correctos.');
      this.formularioReserva.markAllAsTouched();
    }
  }

  private verifyCode(phoneNumber: string): void {
    // Solicitar código de verificación al usuario
    const code = prompt('Introduce el código de verificación enviado a tu teléfono:');

    if (code) {
      this.ReservacionService.verifyCode(phoneNumber, code).subscribe({
        next: (response) => {
          this.alertService.success('Código verificado. Redirigiendo...');
          this.router.navigate(['/tracker/status'], { state: { reserva: response.reserva } });
          console.log('Reserva enviada al estado:', response.reserva);
        },
        error: (error) => {
          this.alertService.error('Error al verificar el código.');
          console.error(error);
        },
      });
    }
  }
}
