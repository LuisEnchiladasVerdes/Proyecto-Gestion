import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio
  const router = inject(Router); // Inyecta el router

  if (authService.isAuthenticated()) {
    return true; // Permite el acceso
  } else {
    router.navigate(['/admin/login']); // Redirige al login
    return false; // Bloquea el acceso
    alert('SIN ACCESO')
  }
};
