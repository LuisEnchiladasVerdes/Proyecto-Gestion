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
    loadComponent: () => import('./pages/add/add.component')
      .then(m => m.AddComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit/edit.component')
      .then(m => m.EditComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
