import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayoutComponent} from "./components/common/admin-layout/admin-layout.component";

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [

      {
        path: 'home',
        loadComponent: () => import('./components/aplication/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'inventario',
        loadChildren: () => import('./modules/inventario/inventario.module')
          .then(m => m.InventarioModule)
      },
      {
        path: 'reservas',
        loadChildren: () => import('./modules/reservas/reservas.module')
          .then(m => m.ReservasModule)
      }

    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/aplication/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'forget',
    loadChildren: () => import('./modules/recuperar/recuperar.module')
      .then(m => m.RecuperarModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
