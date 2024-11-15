import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './components/common/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/aplication/body/body.component')
          .then(m => m.BodyComponent)
      },
      {
        path: 'carrito',
        loadChildren: () => import('./modules/checkout/checkout.module')
          .then(m => m.CheckoutModule)
      },
      {
        path: 'productos',
        loadChildren: () => import('./modules/productos/productos.module')
          .then(m => m.ProductosModule)
      },
      {
        path: 'tracker',
        loadChildren: () =>  import('./modules/tracker/tracker.module')
          .then(m => m.TrackerModule)

      }

    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
