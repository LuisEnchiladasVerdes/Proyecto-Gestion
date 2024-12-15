// import { CanDeactivateFn } from '@angular/router';
//
// export const confirmExitGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
//   return true;
// };


import { CanDeactivateFn } from '@angular/router';

export interface ComponentCanDeactivate {
  canDeactivate(): boolean;
}

export const formChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Verificar si el componente tiene cambios sin guardar
  if (component.canDeactivate()) {
    return true; // Puede salir de la página
  }

  // Mostrar confirmación para salir
  const confirmLeave = window.confirm(
    '¿Está seguro que desea abandonar la página? Los cambios no guardados se perderán.'
  );

  return confirmLeave;
};
