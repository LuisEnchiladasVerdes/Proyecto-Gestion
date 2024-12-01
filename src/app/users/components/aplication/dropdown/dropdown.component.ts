import {Component, HostListener, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {Producto} from "../../../../models/producto.models";
import {DetallerCart} from "../../../../models/detaller-cart.models";
import {CartService} from "../../../../services/cart.service";

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
  // isOpen = false;
  // products: Producto[] = [
  //   {
  //     id: 1,
  //     nombre: 'Producto A',
  //     descripcion: 'Descripción del Producto A',
  //     stock: 10,
  //     categoria: { id: 1, nombre: 'Categoría 1' },
  //     categoria_id: 1,
  //     precio: 100,
  //     precio_actual: 100,
  //     media_relacionado: ['assets/img/PROD/14.jpg'],
  //     codigo: 123456
  //   },
  //   {
  //     id: 2,
  //     nombre: 'Producto B',
  //     descripcion: 'Descripción del Producto B',
  //     stock: 5,
  //     categoria: { id: 2, nombre: 'Categoría 2' },
  //     categoria_id: 2,
  //     precio: 200,
  //     precio_actual: 200,
  //     media_relacionado: ['assets/img/PROD/15.jpg'],
  //     codigo: 654321
  //   },
  // ];
  // total: number = 0;
  //
  // ngOnInit(): void {
  //   this.calculateTotal(); // Calcula el total al cargar
  // }
  //
  // toggleDropdown(event: Event): void {
  //   event.preventDefault();
  //   this.isOpen = !this.isOpen;
  // }
  //
  // incrementQuantity(productId: number): void {
  //   const product = this.products.find(product => product.id === productId);
  //   if (product) {
  //     product.stock++;
  //     this.calculateTotal(); // Recalcula el total
  //   }
  // }
  //
  // decrementQuantity(productId: number): void {
  //   const product = this.products.find(product => product.id === productId);
  //   if (product && product.stock > 1) {
  //     product.stock--;
  //     this.calculateTotal(); // Recalcula el total
  //   }
  // }
  //
  // removeItem(productId: number): void {
  //   this.products = this.products.filter(product => product.id !== productId);
  //   this.calculateTotal(); // Recalcula el total
  // }
  //
  // calculateTotal(): void {
  //   this.total = this.products.reduce((sum, product) => sum + product.precio_actual * product.stock, 0);
  // }
  //
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   const element = event.target as HTMLElement;
  //   const isClickedInside = element.closest('app-dropdown');
  //   if (!isClickedInside) {
  //     this.isOpen = false;
  //   }
  // }
  //
  // navigateToCart(): void {
  //     this.isOpen = false; // Cerrar el dropdown
  //   }




  isOpen = false;
  products: DetallerCart[] = []; // Ahora usamos DetallerCart
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart(); // Carga los productos del carrito al iniciar
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  loadCart(): void {
    this.cartService.getCarritoActual().subscribe({
      next: (cart) => {
        this.products = cart.detalles; // Carga los detalles del carrito
        this.calculateTotal(); // Calcula el total
      },
      error: (error) => {
        console.error("Error al cargar el carrito:", error);
      }
    });
  }

  incrementQuantity(productId: number): void {
    const detalle = this.products.find(item => item.producto.id === productId);
    if (detalle) {
      this.cartService.addToCart(productId, detalle.cantidad + 1).subscribe({
        next: (updatedDetalle) => {
          detalle.cantidad = updatedDetalle.cantidad;
          detalle.total = updatedDetalle.total;
          this.calculateTotal(); // Actualiza el total
        },
        error: (error) => console.error("Error al incrementar la cantidad:", error)
      });
    }
  }

  decrementQuantity(productId: number): void {
    const detalle = this.products.find(item => item.producto.id === productId);
    if (detalle && detalle.cantidad > 1) {
      this.cartService.addToCart(productId, detalle.cantidad - 1).subscribe({
        next: (updatedDetalle) => {
          detalle.cantidad = updatedDetalle.cantidad;
          detalle.total = updatedDetalle.total;
          this.calculateTotal(); // Actualiza el total
        },
        error: (error) => console.error("Error al decrementar la cantidad:", error)
      });
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItemFromCart(productId).subscribe({
      next: () => {
        this.products = this.products.filter(item => item.producto.id !== productId);
        this.calculateTotal(); // Recalcula el total
      },
      error: (error) => console.error("Error al eliminar el producto:", error)
    });
  }

  calculateTotal(): void {
    this.total = this.products.reduce((sum, item) => sum + item.total, 0);
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
    this.isOpen = false; // Cierra el dropdown al navegar al carrito
  }

}
