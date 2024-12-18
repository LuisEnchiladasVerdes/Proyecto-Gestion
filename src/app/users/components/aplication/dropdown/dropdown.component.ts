import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {DetallerCart} from "../../../../models/detaller-cart.models";
import {CartService} from "../../../../services/cart.service";
import {ToastrService} from "ngx-toastr";
import {NavigationStateService} from "../../../../services/navigation-state.service";
import {Cart, PaquetesCart, ProductosCart} from "../../../../models/cart.models";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
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
  cartIsEmpty = true;
  total = 0;
  totalItems = 0;

  products: ProductosCart[] = [];
  paquetes: PaquetesCart[] = [];

  mediaBaseUrl: string = this.cartService.getMediaBaseUrl();

  constructor(private cartService: CartService, private router: Router, private navigationStateService: NavigationStateService,) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cartUpdated$.subscribe(() => this.loadCart());
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  loadCart(): void {
    this.cartService.getCurrentCart().subscribe((cart: Cart) => {
      this.products = cart.productos_individuales || [];
      this.paquetes = cart.paquetes || [];
      this.calculateTotals(cart.total_carrito);
    });
  }

  calculateTotals(totalCarrito?: number): void {
    // Asignar el total directamente desde el backend si está disponible
    if (totalCarrito !== undefined) {
      this.total = totalCarrito;
    } else {
      this.total = 0; // Total del carrito si no viene del backend
    }

    // Reiniciar el contador de ítems
    this.totalItems = 0;

    // Sumar todas las cantidades de productos individuales
    this.products.forEach((item) => {
      this.totalItems += item.cantidad || 0; // Asegurarse de que cantidad no sea nula
    });

    // Contar cada paquete como una unidad
    this.totalItems += this.paquetes.length;

    // Verificar si el carrito está vacío
    this.cartIsEmpty = this.products.length === 0 && this.paquetes.length === 0;
  }


  incrementQuantity(productId: number): void {
    this.cartService.addToCart(productId, 1).subscribe(() => this.loadCart());
  }

  decrementQuantity(productId: number): void {
    this.cartService.decrementItemInCart(productId).subscribe(() => this.loadCart());
  }

  removeItem(productId: number): void {
    // this.cartService.removeItemFromCart(productId).subscribe(() => this.loadCart());
    this.cartService.eliminarItemFromCart(productId).subscribe(() => this.loadCart());
  }

  //PAQUETES

  incrementarPaquete(paqueteId: number): void {
    this.cartService.addPaqueteToCart(paqueteId, 1).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error al agregar paquete al carrito:', error);
      },
    });
  }

  decrementarPaquete(productId: number): void {
    this.cartService.decrementPaqueteToCart(productId).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error al decrementar paquete:', error);
      },
    });
  }

  removePaquete(paqueteId: number): void {
    // this.cartService.removePaqueteFromCart(paqueteId).subscribe(() => this.loadCart());
    this.cartService.eliminarPaqueteFormCart(paqueteId).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error al decrementar paquete:', error);
      },
    });
  }

  navigateToCart(): void {
    this.isOpen = false; // Cierra el dropdown al navegar al carrito
    this.navigationStateService.setAccessRevisar(true); // Habilitar acceso a "Revisar"
    this.router.navigate(['/carrito/revisar']);
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
