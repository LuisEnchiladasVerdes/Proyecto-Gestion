import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {DetallerCart} from "../../../../models/detaller-cart.models";
import {CartService} from "../../../../services/cart.service";
import {ToastrService} from "ngx-toastr";
import {NavigationStateService} from "../../../../services/navigation-state.service";

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
  products: DetallerCart[] = []; // Ahora usamos DetallerCart
  total: number = 0;

  mediaBaseUrl: string = '';

  constructor(private cartService: CartService, private toastr: ToastrService, private router: Router, private navigationStateService: NavigationStateService) {
    this.mediaBaseUrl = this.cartService.getMediaBaseUrl();
  }

  ngOnInit(): void {
    this.loadCart(); // Carga los productos del carrito al iniciar

    this.cartService.cartUpdated$.subscribe(() => {
      this.loadCart(); // Recarga el contenido del carrito
    });
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  loadCart(): void {
    this.cartService.getCurrentCart().subscribe({
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
      this.cartService.addToCart(productId,  1).subscribe({
        next: (updatedDetalle) => {
          detalle.cantidad = updatedDetalle.cantidad;
          detalle.total = updatedDetalle.total;
          this.calculateTotal(); // Actualiza el total
        },
        error: (error) => {
          console.error('Error al incrementar la cantidad:', error);
          this.toastr.error('No se puede agregar más productos. Falta de stock.', 'Error');
        },
      });
    }
  }

  decrementQuantity(productId: number): void {
    const detalle = this.products.find(item => item.producto.id === productId); // Encuentra el detalle del producto en el carrito
    if (detalle && detalle.cantidad > 1) {
      // Llama al backend para decrementar la cantidad
      this.cartService.decrementItemInCart(productId, 1).subscribe({
        next: (updatedDetalle) => {
          // Actualiza la cantidad y el total solo para este producto
          detalle.cantidad -= 1; // Resta una unidad
          detalle.total = detalle.cantidad * detalle.producto.precio_actual; // Recalcula el subtotal localmente
          this.calculateTotal(); // Recalcula el total del carrito
        },
        error: (error) => {
          console.error('Error al decrementar la cantidad:', error);
          this.toastr.error('No se pudo decrementar la cantidad', 'Error');
        }
      });
    } else if (detalle && detalle.cantidad === 1) {
      // Si la cantidad llega a 1, elimina el producto
      this.removeItem(productId);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItemFromCart(productId).subscribe({
      next: (response) => {
        console.log(response.message); // Confirmación del backend
        this.products = this.products.filter(item => item.producto.id !== productId); // Filtrar el producto eliminado
        this.calculateTotal(); // Recalcular el total
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    });
  }

  calculateTotal(): void {
    this.total = this.products.reduce((sum, item) => {
      const subtotal = item.total || 0; // Usa 0 si el subtotal es inválido
      return sum + subtotal;
    }, 0);
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
    this.navigationStateService.setAccessRevisar(true); // Habilitar acceso a "Revisar"
    this.router.navigate(['/carrito/revisar']);
  }

}
