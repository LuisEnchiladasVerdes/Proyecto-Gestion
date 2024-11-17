import {Component, HostListener} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class DropdownComponent {
  isOpen = false;

  productExample = {
    id: 1,
    name: 'Producto Ejemplo',
    price: 29.99,
    quantity: 1,
    image: 'assets/img/PROD/14.jpg'
  };

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  removeItem(): void {
    console.log('Eliminar item:', this.productExample.id);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    const isClickedInside = element.closest('app-dropdown');
    if (!isClickedInside) {
      this.isOpen = false;
    }
  }

}
