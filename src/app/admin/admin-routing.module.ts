import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayoutComponent} from "./components/common/admin-layout/admin-layout.component";
import {authGuard} from "../guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirige a 'login' por defecto si no se especifica una sub-ruta
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard], // Protege el layout completo con el guard
    children: [

      {
        path: 'home',
        loadComponent: () => import('./components/aplication/home/home.component')
          .then(m => m.HomeComponent),
        canActivate: [authGuard]
      },
      {
        path: 'inventario',
        loadChildren: () => import('./modules/inventario/inventario.module')
          .then(m => m.InventarioModule),
        canActivate: [authGuard]
      },
      {
        path: 'reservas',
        loadChildren: () => import('./modules/reservas/reservas.module')
          .then(m => m.ReservasModule),
        canActivate: [authGuard]
      },
      {
        path: 'pagos',
        loadChildren: () => import('./modules/pagos/pagos.module')
          .then(m => m.PagosModule),
        canActivate: [authGuard]
      }

    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/aplication/login/login.component')
      .then(m => m.LoginComponent),
  },
  {
    path: 'forget',
    loadChildren: () => import('./modules/recuperar/recuperar.module')
      .then(m => m.RecuperarModule)
  },
  {
    path: '**', // Ruta comodín para manejar rutas no encontradas
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
