import { Component, inject } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable para almacenar el mensaje de error
  emailError: string | null = null;  // Mensaje de error para el email

  // CONTRUCTOR
  constructor(private router: Router, private http : HttpClient) {}


  validarEmail() {
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

  onLogin() {
    if (this.validarEmail()) {
      if (this.email.trim() === '' || this.password.trim() === '') {
        this.errorMessage = 'Por favor, complete ambos campos.';
        return;
      }
      this.errorMessage = ''; // Limpiar el mensaje de error si los campos están completos
      this.router.navigate(['/admin/home']);
    }
  }



  // mensaje: string = '';

  // private usuariosService = inject(UsuariosService);  // Inyectamos el servicio

  // ngOnInit(): void {
  //   this.usuariosService.pruebaConexion().subscribe((response) => {
  //     this.mensaje = response.mensaje;  // Guardamos el mensaje recibido
  //   });
  // }
}
