import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { FormsModule } from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import { CartService } from "../../../../../services/cart.service";
import { DetallerCart } from "../../../../../models/detaller-cart.models";
import {ToastrService} from "ngx-toastr";
import {NavigationStateService} from "../../../../../services/navigation-state.service";
import {SharedDataService} from "../../../../../services/shared-data.service";
import {PaquetesCart, ProductosCart} from "../../../../../models/cart.models";

@Component({
  selector: 'app-revisar',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './revisar.component.html',
  styleUrl: './revisar.component.css'
})
export class RevisarComponent implements OnInit {
  cartProducts: DetallerCart[] = []; // Reemplaza los datos estáticos por un arreglo vacío
  mediaBaseUrl: string = '';
  cartIsEmpty = true;
  total = 0;
  totalCart = 0;
  totalItems = 0;

  isProcessing = false;

  fechaActual = new Date().toISOString().split('T')[0];
  fecahHoy = new Date();
  fechaMaxima = new Date(this.fecahHoy.getTime() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  horasDisponibles: string[] = []; // Almacena las horas disponibles para la fecha seleccionada
  fechaSeleccionada: string = ''; // Almacena la fecha seleccionada
  horaSeleccionadas: string = '';

  products: ProductosCart[] = [];
  paquetes: PaquetesCart[] = [];

  constructor(private cartService: CartService, private toastr: ToastrService, private router: Router, private navigationStateService: NavigationStateService, private sharedDataService: SharedDataService) {
    this.mediaBaseUrl = this.cartService.getMediaBaseUrl();
  }

  ngOnInit(): void {
    this.loadCart(); // Carga los productos del carrito al iniciar
  }

  loadCart(): void {
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        this.products = cart.productos_individuales || [];
        this.paquetes = cart.paquetes || [];

        this.calculateTotals(cart.total_carrito);

        console.log('productos', this.products);
        console.log('paquetes', this.paquetes);
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    });
  }

  calculateTotals(totalCarrito?: number): void {
    // Asignar el total directamente desde el backend si está disponible
    if (totalCarrito !== undefined) {
      this.totalCart = totalCarrito;
    } else {
      this.totalCart = 0; // Total del carrito si no viene del backend
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

    console.log('Total del carrito:', this.totalCart);
    console.log('Total de ítems:', this.totalItems);
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

  calculateTotal(): void {
    this.total = this.cartProducts.reduce((sum, item) => sum + item.total, 0);
  }

  onFechaChange(event: any): void {
    const fecha = event.target.value; // Fecha seleccionada en formato YYYY-MM-DD
    this.fechaSeleccionada = fecha; // Almacena la fecha seleccionada localmente

    // Extraer mes y año de la fecha seleccionada
    const [anio, mes] = fecha.split('-').map(Number);

    // Llamar al servicio para consultar la disponibilidad
    this.cartService.consultarDisponibilidad(mes, anio).subscribe({
      next: (response) => {
        // Filtrar las horas ocupadas para la fecha seleccionada
        const horasOcupadas = response.ocupadas.find(
          (ocupada: any) => ocupada.fecha_entrega === fecha
        )?.horas_ocupadas || [];

        // Actualizar las horas disponibles eliminando las ocupadas
        this.horasDisponibles = this.getHorasDisponibles(horasOcupadas);
      },
      error: (error) => {
        console.error('Error al consultar la disponibilidad:', error);
        this.horasDisponibles = []; // Reiniciar si hay un error
      },
    });
  }

  onHoraChange(event: any): void {
    const hora = event.target.value; // Hora seleccionada
    this.horaSeleccionadas = hora; // Guardar la hora seleccionada
  }

  navigateToRevisar(): void {
    // Validar que se hayan seleccionado una fecha y una hora
    if (!this.fechaSeleccionada) {
      this.toastr.error('Por favor, selecciona una fecha.', 'Error');
      return;
    }
    if (!this.horaSeleccionadas) {
      this.toastr.error('Por favor, selecciona una hora.', 'Error');
      return;
    }

    this.sharedDataService.setFechaSeleccionada(this.fechaSeleccionada);
    this.sharedDataService.setHoraSeleccionada(this.horaSeleccionadas);

    this.isProcessing = true;
    this.cartService.confirmCart().subscribe({
      next: (response) => {
        // Acciones después de confirmar
        this.navigationStateService.setAccessConfirmacion(true);
        this.router.navigate(['/carrito/confirmar']);
      },
      error: (error) => {
        console.error('Error al confirmar el carrito:', error);
      },
      complete: () => {
        this.isProcessing = false;
      },
    });
  }

  getHorasDisponibles(horasOcupadas: string[]): string[] {
    const todasLasHoras = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];
    const horasOcupadasFormateadas = horasOcupadas.map((hora) => hora.slice(0, 5));
    return todasLasHoras.filter((hora) => !horasOcupadasFormateadas.includes(hora));
  }

  removePaquete(paqueteId: number): void {
    // this.cartService.removePaqueteFromCart(paqueteId).subscribe(() => this.loadCart());
    console.log('se eliminara paquete');
  }

}
