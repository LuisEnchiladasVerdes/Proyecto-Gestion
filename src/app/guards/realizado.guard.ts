import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationStateService } from '../services/navigation-state.service';

export const realizadoGuard: CanActivateFn = (route, state) => {
  const navigationStateService = inject(NavigationStateService);
  const router = inject(Router);

  if (navigationStateService.getAccessRealizado()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
