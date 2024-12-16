import {Component, OnInit} from '@angular/core';
import {Producto} from "../../../../../models/producto.models";
import {ProductoService} from "../../../../../services/producto.service";
import {CategoriaService} from "../../../../../services/categoria.service";
import {Categoria} from "../../../../../models/categoria.models";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CartService} from "../../../../../services/cart.service";
import {AlertService} from "../../../../../services/alert.service";
import {ToastrService} from "ngx-toastr";
import {PaquetesService} from "../../../../../services/paquetes.service";
import {Paquetes} from "../../../../../models/paquetes.models";

@Component({
  selector: 'app-mobiliario',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './mobiliario.component.html',
  styleUrl: './mobiliario.component.css'
})
export class MobiliarioComponent implements OnInit{
  // ATRIBUTOS DE CATEGORIAS
  categorias: any[] = []; // Array para almacenar las categorías
  categoriaSeleccionada = ''; // Categoría seleccionada
  categoriaId: number = 0;

  productos: Producto[] = []; // Definir un arreglo para los items
  paquetes: Paquetes[] = [];

  mediaBaseUrl: string = '';

  constructor(private productoService : ProductoService, private categoriaService : CategoriaService,
              private cartService : CartService, private alertService: AlertService, private toastr: ToastrService,
              private paquetesService: PaquetesService) { }


  ngOnInit(): void {
    this.productoService.getProductosCliente().subscribe(   //CARGAR PRODUCTOS
      (productos: Producto[]) => {
        if (productos && productos.length > 0) {
          this.productos = productos; // Asignar todos los items al arreglo
        }
      },
      (error: any) => {
        console.error('Error al cargar los items', error);
      }
    );
    this.categoriaService.getCategoriasCliente().subscribe(  //CARGAR CATEGORIAS
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
    this.paquetesService.getPaquetes().subscribe(
      (paquetes: Paquetes[] = []) => {
        this.paquetes = paquetes;
      }
    )
    this.mediaBaseUrl = this.productoService.getMediaBaseUrl(); // Obtiene la base URL del servicio
  }

  filterProductosPorCategoria(): void {
    if (this.categoriaSeleccionada === 'paquetes') {
      // Mostrar solo los paquetes
      this.paquetesService.getPaquetes().subscribe({
        next: (paquetes) => {
          this.paquetes = paquetes; // Asignar solo paquetes
          this.productos = [];
        },
        error: (error) => {
          console.error('Error al cargar paquetes', error);
        },
      });
    } else if (!this.categoriaSeleccionada) {
      // Mostrar todos los productos (sin filtro)
      this.productoService.getProductosCliente().subscribe({
        next: (productos) => {
          this.productos = productos; // Asignar productos
        },
        error: (error) => {
          console.error('Error al cargar todos los productos', error);
        },
      });

    } else {
      // Filtrar por categoría seleccionada
      const categoriaId = parseInt(this.categoriaSeleccionada, 10);
      this.productoService.getProductosPorCategoriaCliente(categoriaId).subscribe({
        next: (productos) => {
          this.productos = productos; // Asignar productos filtrados
          this.paquetes = [];
        },
        error: (error) => {
          console.error('Error al filtrar productos por categoría', error);
        },
      });
    }
  }

  addToCart(producto: Producto): void {
    const cantidad = 1; // Cantidad inicial (puedes agregar una funcionalidad para que el usuario elija)
    this.cartService.addToCart(producto.id!, cantidad).subscribe({
      next: (detalleCarrito) => {
        this.toastr.success('Producto agregado!', 'Exito');
        this.cartService.notifyCartUpdated();
      },
      error: (error) => {
        // console.error('Error al agregar al carrito:', error);
        // this.alertService.error('Error al cargar el producto al carrito');
        this.toastr.error('Error al cargar al carrito', error);
      },
    });
  }

  addPaqueteToCart(paquete: Paquetes): void {
    const cantidad = 1;
    this.cartService.addPaqueteToCart(paquete.id!, cantidad).subscribe({
      next: (detalleCarrito) => {
        this.toastr.success('Paquete agregado!', 'Exito');
        this.cartService.notifyCartUpdated();
      },
      error: (error) => {
        // console.error('Error al agregar al carrito:', error);
        // this.alertService.error('Error al cargar el producto al carrito');
        this.toastr.error('Error al cargar al carrito', error);
      },
    });
  }

}
