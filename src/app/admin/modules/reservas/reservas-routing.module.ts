import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'detalles/:codigo_pedido',
    loadComponent: () => import('./pages/detalles/detalles.component')
      .then(m => m.DetallesComponent)
  }
  ,
  {
    path: 'preview',
    loadComponent: () => import('./pages/preview/preview.component')
      .then(m => m.PreviewComponent)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reporte/reporte.component')
      .then(m => m.ReporteComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule { }
