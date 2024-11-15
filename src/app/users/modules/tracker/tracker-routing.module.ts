import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'consultar',
    loadComponent: () => import('./pages/input/input.component')
      .then(m => m.InputComponent)
  },
  {
    path: 'status',
    loadComponent: () => import('./pages/status/status.component')
      .then(m => m.StatusComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackerRoutingModule { }
