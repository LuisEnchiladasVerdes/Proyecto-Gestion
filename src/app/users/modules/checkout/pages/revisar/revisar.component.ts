import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { CartService } from "../../../../../services/cart.service";
import { DetallerCart } from "../../../../../models/detaller-cart.models";
import {ToastrService} from "ngx-toastr";
import {NavigationStateService} from "../../../../../services/navigation-state.service";

@Component({
  selector: 'app-revisar',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './revisar.component.html',
  styleUrl: './revisar.component.css'
})
export class RevisarComponent implements OnInit {
  cartProducts: DetallerCart[] = []; // Reemplaza los datos estáticos por un arreglo vacío
  mediaBaseUrl: string = '';
  total: number = 0;

  isProcessing = false;

  fechaActual = new Date().toISOString().split('T')[0];
  fecahHoy = new Date();
  fechaMaxima = new Date(this.fecahHoy.getTime() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  constructor(private cartService: CartService, private toastr: ToastrService, private router: Router, private navigationStateService: NavigationStateService) {
    this.mediaBaseUrl = this.cartService.getMediaBaseUrl();
  }

  ngOnInit(): void {
    this.loadCart(); // Carga los productos del carrito al iniciar
  }

  loadCart(): void {
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        this.cartProducts = cart.detalles; // Carga los detalles reales del carrito
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    });
  }

  // Decrementar cantidad
  decreaseQuantity(product: DetallerCart): void {
    if (product.cantidad > 1) {
      this.cartService.decrementItemInCart(product.producto.id!, 1).subscribe({
        next: (updatedDetalle) => {
          product.cantidad -= 1; // Decrementa la cantidad
          product.total = product.cantidad * product.producto.precio_actual; // Actualiza el subtotal
          this.calculateTotal(); // Recalcula el total del carrito
        },
        error: (error) => {
          console.error("Error al decrementar la cantidad:", error);
          this.toastr.error("No se pudo decrementar la cantidad", "Error");
        }
      });
    } else {
      // Si es 1, elimina el producto del carrito
      this.removeProduct(product);
    }
  }

  decreaseQuantityPersonalizada(product: DetallerCart): void {
    if (product.cantidad > 1) {
      this.cartService.decrementItemInCart(product.producto.id!, 1).subscribe({
        next: (updatedDetalle) => {
          product.cantidad -= 1; // Decrementa la cantidad
          product.total = product.cantidad * product.producto.precio_actual; // Actualiza el subtotal
          this.calculateTotal(); // Recalcula el total del carrito
        },
        error: (error) => {
          console.error("Error al decrementar la cantidad:", error);
          this.toastr.error("No se pudo decrementar la cantidad", "Error");
        }
      });
    } else {
      // Si es 1, elimina el producto del carrito
      this.removeProduct(product);
    }
  }

  increaseQuantity(product: any): void {
    this.cartService.addToCart(product.producto.id, 1).subscribe({
      next: (updatedItem) => {
        product.cantidad = updatedItem.cantidad;
        product.total = updatedItem.total;
      },
      error: (error) => console.error('Error al incrementar la cantidad:', error),
      complete: () => {
        this.calculateTotal();
      }
    });
  }

  removeProduct(product: any): void {
    this.cartService.removeItemFromCart(product.producto.id).subscribe({
      next: () => {
        this.cartProducts = this.cartProducts.filter((p) => p.producto.id !== product.producto.id);
      },
      error: (error) => console.error('Error al eliminar el producto:', error),
      complete: () => {
        this.calculateTotal();
      }
    });
  }

  // Almacena la cantidad previa
  storePreviousQuantity(product: DetallerCart): void {
    (product as any).previousCantidad = product.cantidad; // Guardamos el valor anterior
  }

// Detecta y maneja cambios en el input de cantidad
  onQuantityChange(product: DetallerCart): void {
    const nuevaCantidad = Math.max(1, product.cantidad); // Asegurar que sea al menos 1
    const cantidadAnterior = (product as any).previousCantidad || 0; // Valor almacenado

    console.log('Cantidad anterior:', cantidadAnterior);
    console.log('Nueva cantidad:', nuevaCantidad);

    if (nuevaCantidad === cantidadAnterior) {
      console.log('La cantidad no cambió. Saliendo...');
      return;
    }

    if (nuevaCantidad > cantidadAnterior) {
      // Incremento
      const cantidadIncrementada = nuevaCantidad - cantidadAnterior;
      console.log('Incrementando cantidad en:', cantidadIncrementada);

      this.cartService.addToCart(product.producto.id!, cantidadIncrementada).subscribe({
        next: (detalleActualizado) => {
          product.cantidad = detalleActualizado.cantidad;
          product.total = detalleActualizado.total;
          this.calculateTotal(); // Actualizamos el total
        },
        error: (error) => {
          console.error('Error al incrementar la cantidad:', error);
          this.toastr.error('Error al incrementar la cantidad.');
        },
      });
    } else {
      // Decremento
      const cantidadDecrementada = cantidadAnterior - nuevaCantidad;
      console.log('Decrementando cantidad en:', cantidadDecrementada);

      this.cartService.decrementItemInCart(product.producto.id!, cantidadDecrementada).subscribe({
        next: (detalleActualizado) => {
          product.cantidad = detalleActualizado.cantidad;
          product.total = detalleActualizado.total;
          this.calculateTotal(); // Actualizamos el total
        },
        error: (error) => {
          console.error('Error al decrementar la cantidad:', error);
          this.toastr.error('Error al decrementar la cantidad.');
        },
      });
    }
  }

  // calculateTotal(): number {
  //   return this.cartProducts.reduce((sum, product) => sum + product.cantidad * product.producto.precio_actual, 0);
  // }

  calculateTotal(): void {
    this.total = this.cartProducts.reduce((sum, item) => sum + item.total, 0);
  }

  navigateToRevisar(): void {
    this.isProcessing = true;
    this.cartService.confirmCart().subscribe({
      next: (response) => {
        console.log('Carrito confirmado exitosamente:', response);
        // this.alertService.success('¡Carrito confirmado exitosamente!');
        this.navigationStateService.setAccessConfirmacion(true);
        this.router.navigate(['/carrito/confirmar']);
      },
      error: (error) => {
        console.error('Error al confirmar el carrito:', error);
        // this.alertService.error('Hubo un problema al confirmar el carrito.');
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

}
