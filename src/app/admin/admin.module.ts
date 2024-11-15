import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import {HeaderAdminComponent} from "./components/common/header-admin/header-admin.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,

    HeaderAdminComponent,
    AdminRoutingModule
  ]
})
export class AdminModule { }
