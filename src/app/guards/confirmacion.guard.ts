import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationStateService } from '../services/navigation-state.service';

export const confirmacionGuard: CanActivateFn = (route, state) => {
  const navigationStateService = inject(NavigationStateService);
  const router = inject(Router);

  if (navigationStateService.getAccessConfirmacion()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
