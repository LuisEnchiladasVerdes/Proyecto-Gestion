import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {revisarGuard} from "../../../guards/revisar.guard";
import {confirmacionGuard} from "../../../guards/confirmacion.guard";
import {realizadoGuard} from "../../../guards/realizado.guard";
import { formChangesGuard } from "../../../guards/confirm-exit.guard";

const routes: Routes = [
  {
    path: 'revisar',
    loadComponent: () => import('./pages/revisar/revisar.component')
      .then(m => m.RevisarComponent), canActivate: [revisarGuard]
  },
  {
    path: 'confirmar',
    loadComponent: () => import('./pages/confirmacion/confirmacion.component')
      .then(m => m.ConfirmacionComponent),
    // canActivate: [confirmacionGuard],
    // canDeactivate: [formChangesGuard]
  },
  {
    path: 'realizado',
    loadComponent: () => import('./pages/realizado/realizado.component')
      .then(m => m.RealizadoComponent), canActivate: [realizadoGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
