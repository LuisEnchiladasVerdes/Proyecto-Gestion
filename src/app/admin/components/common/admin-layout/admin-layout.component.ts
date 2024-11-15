import { Component } from '@angular/core';
import {HeaderAdminComponent} from "../header-admin/header-admin.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    HeaderAdminComponent,
    RouterOutlet
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
