import {Component, OnInit} from '@angular/core';
import {Producto} from "../../../../../models/producto.models";
import {ProductoService} from "../../../../../services/producto.service";
import {CategoriaService} from "../../../../../services/categoria.service";
import {Categoria} from "../../../../../models/categoria.models";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-mobiliario',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './mobiliario.component.html',
  styleUrl: './mobiliario.component.css'
})
export class MobiliarioComponent implements OnInit{

  // ATRIBUTOS DE CATEGORIAS
  categorias: any[] = []; // Array para almacenar las categorías
  categoriaSeleccionada = ''; // Categoría seleccionada
  categoriaId: number = 0;


  // ATRIBUTO DE PRODUCTOS
  productos: Producto[] = []; // Definir un arreglo para los items


  // ATRIBUTO PARA IMAGENES
  mediaBaseUrl: string = '';


  // CONSTRUCTOS
  constructor(private productoService : ProductoService, private categoriaService : CategoriaService) { }


  // CARGA AL INICIAR LOS PRODUCTOS Y LAS CATEGORIAS
  ngOnInit(): void {
    this.productoService.getProductos().subscribe(   //CARGAR PRODUCTOS
      (productos: Producto[]) => {
        if (productos && productos.length > 0) {
          this.productos = productos; // Asignar todos los items al arreglo
        }
      },
      (error: any) => {
        console.error('Error al cargar los items', error);
      }
    );
    this.categoriaService.getCategorias().subscribe(  //CARGAR CATEGORIAS
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
    this.mediaBaseUrl = this.productoService.getMediaBaseUrl(); // Obtiene la base URL del servicio
  }
}
