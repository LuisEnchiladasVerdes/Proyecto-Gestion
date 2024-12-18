import {Component, OnInit} from '@angular/core';
import {Cart, PaquetesCart, ProductosCart} from "../../../../../models/cart.models";
import {SharedDataService} from "../../../../../services/shared-data.service";
import {Reserva} from "../../../../../models/Reserva.models";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-realizado',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './realizado.component.html',
  styleUrl: './realizado.component.css'
})
export class RealizadoComponent implements OnInit {
  cart: Cart | null = null;
  reserva: Reserva | null = null;

  products: ProductosCart[] = [];
  paquetes: PaquetesCart[] = [];

  constructor(private sharedDataService: SharedDataService) {
  }

  ngOnInit() {
    this.loadCart();
    this.loadReserva();
  }

  loadCart(): void {
    this.cart = this.sharedDataService.getCart()
    console.log('carrito arrastrado',this.cart);

    this.products = this.cart?.productos_individuales!;
    this.paquetes = this.cart?.paquetes!;

    console.log('productos',this.products);
    console.log('paquetes',this.paquetes);
  }

  // loadReserva(): void {
  //   this.reserva = this.sharedDataService.getReserva();
  //   console.log('reserva arrastrada', this.reserva);
  // }

  loadReserva(): void {
    this.reserva = this.sharedDataService.getReserva();
    console.log('reserva arrastrada', this.reserva);

    // Asignar los productos individuales
    this.products = this.reserva?.detalles?.filter((detalle) => !detalle.paquete) || [];

    // Agrupar productos por paquetes
    this.paquetes = this.agruparPaquetes(this.reserva?.detalles || []);
  }

// Método para agrupar productos por nombre de paquete
  agruparPaquetes(detalles: any[]): any[] {
    const paquetesMap = new Map<string, any>();

    detalles.forEach((detalle) => {
      if (detalle.paquete) {
        if (!paquetesMap.has(detalle.paquete)) {
          paquetesMap.set(detalle.paquete, { nombre: detalle.paquete, cantidad: 0, productos: [] });
        }

        const paquete = paquetesMap.get(detalle.paquete);
        paquete.cantidad += detalle.cantidad;
        paquete.productos.push({
          producto: detalle.producto,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          precio_total: detalle.precio_total,
        });
      }
    });

    return Array.from(paquetesMap.values());
  }


}
