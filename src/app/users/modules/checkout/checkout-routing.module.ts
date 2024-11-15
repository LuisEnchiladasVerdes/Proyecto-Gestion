import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'revisar',
    loadComponent: () => import('./pages/revisar/revisar.component')
      .then(m => m.RevisarComponent)
  },
  {
    path: 'confirmar',
    loadComponent: () => import('./pages/confirmacion/confirmacion.component')
      .then(m => m.ConfirmacionComponent)
  },
  {
    path: 'realizado',
    loadComponent: () => import('./pages/realizado/realizado.component')
      .then(m => m.RealizadoComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
