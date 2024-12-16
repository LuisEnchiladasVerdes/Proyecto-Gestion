import {Component, OnInit} from '@angular/core';
import {Producto} from "../../../../../models/producto.models";
import {ProductoService} from "../../../../../services/producto.service";
import {CategoriaService} from "../../../../../services/categoria.service";
import {Categoria} from "../../../../../models/categoria.models";
import {NgForOf, NgIf} from "@angular/common";
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
    FormsModule,
    NgIf
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

  showDetailsModal: boolean = false; // Controla la visibilidad del modal
  selectedItem: any = null; // Almacena el producto/paquete seleccionado
  selectedType: string = ''; // Indica si es producto o paquete

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

  openDetailsModal(item: any, type: string): void {
    this.selectedItem = item; // Almacena el producto o paquete
    this.selectedType = type; // Guarda si es producto o paquete
    this.showDetailsModal = true; // Abre el modal

    // Depuración de imágenes
    if (type === 'producto' && this.selectedItem.media_relacionado?.length > 0) {
      console.log('Imagen del producto encontrada:', this.mediaBaseUrl + this.selectedItem.media_relacionado[0]);
    } else if (type === 'paquete' && this.selectedItem.media_urls?.length > 0) {
      console.log('Imagen del paquete encontrada:', this.mediaBaseUrl + this.selectedItem.media_urls[0]);
    } else {
      console.warn('No se encontraron imágenes para este elemento.');
    }
  }


  closeDetailsModal(): void {
    this.showDetailsModal = false; // Cierra el modal
    this.selectedItem = null; // Limpia la selección
    this.selectedType = '';
  }

  addItemToCart(item: any, type: string): void {
    const cantidad = 1;
    if (type === 'producto') {
      this.cartService.addToCart(item.id, cantidad).subscribe({
        next: () => {
          this.toastr.success('Producto agregado al carrito', 'Éxito');
          this.cartService.notifyCartUpdated();
        },
        error: () => this.toastr.error('Error al agregar producto al carrito'),
      });
    } else if (type === 'paquete') {
      this.cartService.addPaqueteToCart(item.id, cantidad).subscribe({
        next: () => {
          this.toastr.success('Paquete agregado al carrito', 'Éxito');
          this.cartService.notifyCartUpdated();
        },
        error: () => this.toastr.error('Error al agregar paquete al carrito'),
      });
    }
  }

}
