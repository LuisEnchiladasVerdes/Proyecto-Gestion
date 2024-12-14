import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {DropdownComponent} from "../../aplication/dropdown/dropdown.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    DropdownComponent,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  showHeader: boolean = true; // Controla si el header (y dropdown) se muestra

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escuchar cambios en la navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = [
          '/carrito/revisar',
          '/carrito/confirmar',
          '/carrito/realizado',
        ];
        this.showHeader = !hiddenRoutes.includes(event.url);
      }
    });
  }
}
