import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';

import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { UserLayoutComponent } from './components/common/user-layout/user-layout.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,

    HeaderComponent,
    FooterComponent,
    UserLayoutComponent
  ]
})
export class UsersModule { }
