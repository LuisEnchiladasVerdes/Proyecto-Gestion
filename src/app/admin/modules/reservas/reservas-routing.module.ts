import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'detalles',
    loadComponent: () => import('./pages/detalles/detalles.component')
      .then(m => m.DetallesComponent)
  },
  {
    path: 'preview',
    loadComponent: () => import('./pages/preview/preview.component')
      .then(m => m.PreviewComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule { }
