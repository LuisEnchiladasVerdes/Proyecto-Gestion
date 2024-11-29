import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        this.router.navigate(['/admin/login']); // Redirige incluso si falla
      },
    });
  }
}