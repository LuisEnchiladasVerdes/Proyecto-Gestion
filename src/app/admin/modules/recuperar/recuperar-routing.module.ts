import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/input-password/input-password.component')
      .then(m => m.InputPasswordComponent)
  },
  {
    path: 'reset',
    loadComponent: () => import('./pages/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuperarRoutingModule { }
