import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {AuthService} from "../../../../services/auth.service";

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
  username = '';
  password: string = '';

  errorMessage: string = ''; // Variable para almacenar el mensaje de error

  // CONTRUCTOR
  constructor(private router: Router, private http : HttpClient, private authService: AuthService) {}




  onLogin() {

    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/admin/home']); // Redirige al dashboard si la autenticación es exitosa
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos'; // Muestra error
    }
  }



}
