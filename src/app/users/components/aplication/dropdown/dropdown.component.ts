import {Component, HostListener, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {Producto} from "../../../../models/producto.models";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf
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
export class DropdownComponent  implements OnInit {
  isOpen = false;
  products: Producto[] = [
    {
      id: 1,
      nombre: 'Producto A',
      descripcion: 'Descripción del Producto A',
      stock: 10,
      categoria: { id: 1, nombre: 'Categoría 1' },
      categoria_id: 1,
      precio: 100,
      precio_actual: 100,
      media_relacionado: ['assets/img/PROD/14.jpg'],
      codigo: 123456
    },
    {
      id: 2,
      nombre: 'Producto B',
      descripcion: 'Descripción del Producto B',
      stock: 5,
      categoria: { id: 2, nombre: 'Categoría 2' },
      categoria_id: 2,
      precio: 200,
      precio_actual: 200,
      media_relacionado: ['assets/img/PROD/15.jpg'],
      codigo: 654321
    },
    {
      id: 3,
      nombre: 'Producto B',
      descripcion: 'Descripción del Producto B',
      stock: 5,
      categoria: { id: 2, nombre: 'Categoría 2' },
      categoria_id: 2,
      precio: 200,
      precio_actual: 200,
      media_relacionado: ['assets/img/PROD/15.jpg'],
      codigo: 654321
    },
    {
      id: 4,
      nombre: 'Producto B',
      descripcion: 'Descripción del Producto B',
      stock: 5,
      categoria: { id: 2, nombre: 'Categoría 2' },
      categoria_id: 2,
      precio: 200,
      precio_actual: 200,
      media_relacionado: ['assets/img/PROD/15.jpg'],
      codigo: 654321
    }
  ];
  total: number = 0;

  ngOnInit(): void {
    this.calculateTotal(); // Calcula el total al cargar
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  incrementQuantity(productId: number): void {
    const product = this.products.find(product => product.id === productId);
    if (product) {
      product.stock++;
      this.calculateTotal(); // Recalcula el total
    }
  }

  decrementQuantity(productId: number): void {
    const product = this.products.find(product => product.id === productId);
    if (product && product.stock > 1) {
      product.stock--;
      this.calculateTotal(); // Recalcula el total
    }
  }

  removeItem(productId: number): void {
    this.products = this.products.filter(product => product.id !== productId);
    this.calculateTotal(); // Recalcula el total
  }

  calculateTotal(): void {
    this.total = this.products.reduce((sum, product) => sum + product.precio_actual * product.stock, 0);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    const isClickedInside = element.closest('app-dropdown');
    if (!isClickedInside) {
      this.isOpen = false;
    }
  }

  navigateToCart(): void {
      this.isOpen = false; // Cerrar el dropdown
    }

}
