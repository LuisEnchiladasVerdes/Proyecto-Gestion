import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.css'
})
export class InputPasswordComponent {
  email: string = '';
  emailError: string | null = null;  // Mensaje de error para el email
  codigo: string = '';
  codigoError: string | null = null;

  constructor(private router: Router) {}

  validarEmail() {
    // Verificar si el campo está vacío
    if (!this.email) {
      this.emailError = 'Este campo no puede estar vacio.';
      return false;
    }

    // Expresión regular para validar formato de correo
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Introduce un correo electrónico válido.';
      return false;
    }

    // Si el correo es válido, limpiar el mensaje de error
    this.emailError = null;
    return true;
  }

  validateCode() {
    if (this.codigo.length !== 6 || this.codigo !== '123123') {
      this.codigoError = 'Introduce un codigo valido.';
    } else {
      this.codigoError = null;
      // Redirigir a la ruta especificada si el código es correcto
      this.router.navigate(['/admin/forget/reset']);
    }
  }

  onSendCode() {
    if (this.validarEmail()) {
      // Aquí va la lógica para enviar el código
      console.log('Enviando código al correo:', this.email);

      // this.router.navigate(['/admin/forget/reset']);
    }
  }

}
