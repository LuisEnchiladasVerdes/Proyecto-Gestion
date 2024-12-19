import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../../../../services/alert.service";
import { ReservacionService } from '../../../../../services/reservacion.service';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  formularioReserva: FormGroup;

  mostrarModal = false;
  codigo: string = '';
  phoneNumber: string = '';

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
      this.phoneNumber ='+52' + telefono; // Guardar el número de teléfono para usarlo en el modal
      console.log('numero de telefono',this.phoneNumber)

      // console.log('Formulario válido. Enviando código:', { codigo, telefono });

      this.ReservacionService.sendVerificationCode(this.phoneNumber, codigo).subscribe({
        next: () => {
          this.alertService.success('Código enviado.');
          this.abrirModal(); // Abre el modal
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

  validarCodigo(phoneNumber: string): void {
    if (!/^\d{6}$/.test(this.codigo)) {
      this.alertService.error('El código debe tener exactamente 6 dígitos.');
      return;
    }

    this.ReservacionService.verifyCode(this.phoneNumber, this.codigo).subscribe({
      next: (response) => {
        this.alertService.success('Código verificado. Redirigiendo...');
        this.router.navigate(['/tracker/status'], { state: { reserva: response.reserva } });
        console.log('Reserva enviada al estado:', response.reserva);
        this.cerrarModal();
      },
      error: (error) => {
        this.alertService.error('Error al verificar el código.');
        console.error(error);
      },
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.codigo = ''; // Limpia el código al cerrar
  }
}
