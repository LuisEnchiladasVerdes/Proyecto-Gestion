import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { AuthService } from '../../../../../services/auth.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.css'
})
export class InputPasswordComponent {
  email: string = ''; // Almacena el correo ingresado
  codigo: string = ''; // Almacena el código de recuperación
  emailError: string | null = null; // Mensaje de error para el correo
  codigoError: string | null = null; // Mensaje de error para el código
  successMessage: string | null = null; // Mensaje de éxito al enviar el correo
  isCodeSent: boolean = false; // Indica si el código fue enviado correctamente


  constructor(private router: Router, private authService: AuthService,     private alertService: AlertService) {}

  /**
   * Valida el correo electrónico ingresado.
   * @returns {boolean} Si el correo es válido o no.
   */
  validarEmail(): boolean {
    if (!this.email) {
      this.emailError = 'Este campo no puede estar vacío.';
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Introduce un correo electrónico válido.';
      return false;
    }

    this.emailError = null; // Limpia el mensaje de error
    return true;
  }

  /**
   * Enviar solicitud de código de recuperación de contraseña.
   */
  onSendCode(): void {
    if (this.validarEmail()) {
      this.authService.requestPasswordReset(this.email).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'El código fue enviado a tu correo.';
          this.isCodeSent = true; // Marca como enviado
          if (this.successMessage) {
            this.alertService.success(this.successMessage); // Muestra alerta de éxito
          }
        },
        error: (err) => {
          const errorMessage = err.error?.error || 'Ocurrió un error al enviar el código.';
          this.alertService.modalConIconoError(errorMessage); // Muestra alerta con error
        }
      });
    }
  }

  /**
   * Valida el código de recuperación ingresado.
   */
  validateCode(): void {
    if (!this.codigo || this.codigo.length !== 6) {
      this.codigoError = 'Introduce un código válido de 6 caracteres.';
      return;
    }

    this.authService.verifyResetCode(this.email, this.codigo).subscribe({
      next: (response) => {
        const resetToken = response.reset_token; // Token generado por el backend
        this.alertService.success('Código validado correctamente.'); // Muestra alerta de éxito
        this.router.navigate(['/admin/forget/reset'], { queryParams: { email: this.email, token: resetToken } });
      },
      error: (err) => {
        this.codigoError = err.error?.error || 'Código inválido o expirado.';
        this.alertService.modalConIconoError(this.codigoError || 'Código inválido o expirado.'); // Muestra alerta con error
      },
    });
  }

}
