// import { Component } from '@angular/core';
// import {Router, RouterLink} from "@angular/router";
// import {FormsModule} from "@angular/forms";
// import {NgIf} from "@angular/common";
//
// @Component({
//   selector: 'app-reset-password',
//   standalone: true,
//   imports: [
//     RouterLink,
//     FormsModule,
//     NgIf
//   ],
//   templateUrl: './reset-password.component.html',
//   styleUrl: './reset-password.component.css'
// })
// export class ResetPasswordComponent {
//   newPassword: string = '';
//   confirmPassword: string = '';
//   passwordLengthError: string | null = null;
//   passwordMatchError: string | null = null;
//
//   constructor(private router: Router) {}
//
//   validateNewPassword() {
//     if (this.newPassword.length < 8) {
//       this.passwordLengthError = 'La contraseña debe tener al menos 8 caracteres.';
//       return false;
//     }
//     this.passwordLengthError = null;
//     return true;
//   }
//
//   validateConfirmPassword() {
//     if (this.newPassword !== this.confirmPassword) {
//       this.passwordMatchError = 'Las contraseñas no coinciden.';
//       return false;
//     }
//     this.passwordMatchError = null;
//     return true;
//   }
//
//   onSubmit() {
//     const isNewPasswordValid = this.validateNewPassword();
//     const isConfirmPasswordValid = this.validateConfirmPassword();
//
//     if (isNewPasswordValid && isConfirmPasswordValid) {
//       // Aquí iría la lógica para cambiar la contraseña
//       console.log('Contraseña cambiada exitosamente');
//
//       this.router.navigate(['/admin/login']);
//     }
//   }
// }





import { Component } from '@angular/core';
import {Router, ActivatedRoute } from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { AuthService } from '../../../../../services/auth.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  newPassword: string = ''; // Nueva contraseña ingresada
  confirmPassword: string = ''; // Confirmación de la nueva contraseña
  passwordLengthError: string | null = null; // Error de longitud
  passwordMatchError: string | null = null; // Error de coincidencia
  successMessage: string | null = null; // Mensaje de éxito
  email: string = ''; // Correo del usuario (recibido en la URL)
  resetToken: string = ''; // Token para el restablecimiento (recibido en la URL)


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    // Obtiene los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.resetToken = params['token'] || '';

      if (!this.email || !this.resetToken) {
        // Si no hay correo o token, redirige a la página de inicio
        this.alertService.warning('Faltan parámetros para restablecer la contraseña.');
        this.router.navigate(['/admin/forget/recuperar']);
      }
    });
  }

  /**
   * Valida la longitud de la nueva contraseña.
   * @returns {boolean} Si la contraseña es válida.
   */
  validateNewPassword(): boolean {
    if (this.newPassword.length < 8) {
      this.passwordLengthError = 'La contraseña debe tener al menos 8 caracteres.';
      this.alertService.error(this.passwordLengthError);
      return false;
    }
    this.passwordLengthError = null;
    return true;
  }

  /**
   * Verifica si las contraseñas coinciden.
   * @returns {boolean} Si las contraseñas coinciden.
   */
  validateConfirmPassword(): boolean {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMatchError = 'Las contraseñas no coinciden.';
      this.alertService.error(this.passwordMatchError);
      return false;
    }
    this.passwordMatchError = null;
    return true;
  }

  /**
   * Restablece la contraseña del usuario.
   */
  onSubmit(): void {
    const isNewPasswordValid = this.validateNewPassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();

    if (isNewPasswordValid && isConfirmPasswordValid) {
      // Llama al servicio para restablecer la contraseña
      this.authService.confirmPasswordReset(this.email, this.resetToken, this.newPassword).subscribe({
        next: (response) => {
          this.alertService.success(response.message || 'Contraseña restablecida con éxito.');
          setTimeout(() => this.router.navigate(['/admin/login']), 3000); // Redirige al login después de 3 segundos
        },
        error: (err) => {
          const errorMessage = err.error?.error || 'Error al restablecer la contraseña.';
          this.alertService.modalConIconoError(errorMessage);        },
      });
    }
  }
}
