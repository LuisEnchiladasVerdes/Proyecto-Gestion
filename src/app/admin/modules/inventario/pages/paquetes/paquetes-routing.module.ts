import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'general',
    loadComponent: () => import('./pages/general/general.component')
      .then(m => m.GeneralComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/agregar/agregar.component')
      .then(m => m.AgregarComponent)
  },
  {
    path: 'edit:/id',
    loadComponent: () => import('./pages/editar/editar.component')
      .then(m => m.EditarComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaquetesRoutingModule { }
