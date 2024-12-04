import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {NavigationStateService} from "../services/navigation-state.service";

export const revisarGuard: CanActivateFn = (route, state) => {
  const navigationStateService = inject(NavigationStateService);
  const router = inject(Router);

  if (navigationStateService.getAccessRevisar()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
