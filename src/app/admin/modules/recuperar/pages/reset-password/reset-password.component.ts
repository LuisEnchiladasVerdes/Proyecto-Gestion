import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  passwordLengthError: string | null = null;
  passwordMatchError: string | null = null;

  constructor(private router: Router) {}

  validateNewPassword() {
    if (this.newPassword.length < 8) {
      this.passwordLengthError = 'La contraseña debe tener al menos 8 caracteres.';
      return false;
    }
    this.passwordLengthError = null;
    return true;
  }

  validateConfirmPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMatchError = 'Las contraseñas no coinciden.';
      return false;
    }
    this.passwordMatchError = null;
    return true;
  }

  onSubmit() {
    const isNewPasswordValid = this.validateNewPassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();

    if (isNewPasswordValid && isConfirmPasswordValid) {
      // Aquí iría la lógica para cambiar la contraseña
      console.log('Contraseña cambiada exitosamente');

      this.router.navigate(['/admin/login']);
    }
  }
}
