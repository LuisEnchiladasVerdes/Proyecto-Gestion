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
import {AlertService} from "../../../../../services/alert.service";

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

  constructor(private cartService: CartService, private toastr: ToastrService, private router: Router, private navigationStateService: NavigationStateService, private sharedDataService: SharedDataService, private alertService: AlertService) {
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
      this.alertService.error('Selecciona una fecha.', 'Error');
      return;
    }
    if (!this.horaSeleccionadas) {
      this.alertService.error('Selecciona una hora.', 'Error');
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

  incrementarProd(productId: number): void {
    this.cartService.addToCart(productId, 1).subscribe(() => this.loadCart());
  }

  decrementarProd(productId: number): void {
    this.cartService.decrementItemInCart(productId).subscribe(() => this.loadCart());
  }

  editarCantProd(productId: number, cantidad: number): void {
    this.cartService.actualizarItemFromCart(productId, cantidad).subscribe({
      next: (response) => {
        this.loadCart()
      },
      error: (error) => {
        console.error('Error al actualizar cantidad de producto:', error);
        this.toastr.error('Stock insuficiente');
      }
    });
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

  editarCantPaquete(paqueteId: number, cantidad: number): void {
    this.cartService.actualizarPaqueteFormCart(paqueteId, cantidad).subscribe({
      next: (response) => {
        console.log('Cantidad de paquetes actualizado');
        this.loadCart()
      },
      error: (error) => {
        console.error('Error al actualizar cantidad de paquetes:', error);
        this.toastr.error('Stock insuficiente');
      }
    });
  }

}
