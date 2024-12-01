import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-revisar',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgForOf
  ],
  templateUrl: './revisar.component.html',
  styleUrl: './revisar.component.css'
})
export class RevisarComponent {
  cartProducts = [
    {
      id: 1,
      name: 'Mesa de madera',
      category: 'Mesas',
      price: 50.0,
      quantity: 5,
      image: 'assets/img/PROD/1.jpg',
    },
    {
      id: 2,
      name: 'Silla de oficina',
      category: 'Sillas',
      price: 75.0,
      quantity: 3,
      image: 'assets/img/PROD/10.jpg',
    },
  ];

  // Incrementar cantidad
  increaseQuantity(product: any): void {
    product.quantity++;
  }

  // Decrementar cantidad
  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }

  // Eliminar producto
  removeProduct(product: any): void {
    this.cartProducts = this.cartProducts.filter((p) => p.id !== product.id);
  }

  // Calcular el total
  calculateTotal(): number {
    return this.cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }
}
