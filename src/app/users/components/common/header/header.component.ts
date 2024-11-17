import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {DropdownComponent} from "../../aplication/dropdown/dropdown.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    DropdownComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
