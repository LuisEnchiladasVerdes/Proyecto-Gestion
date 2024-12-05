import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';

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
  styleUrls: ['./login.component.css'] // Corregí la propiedad a "styleUrls" (plural)
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/admin/home']),
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Error al iniciar sesión';
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
