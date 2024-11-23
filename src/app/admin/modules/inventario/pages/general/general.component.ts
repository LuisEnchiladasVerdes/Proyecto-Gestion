import {Component, OnInit} from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CategoriaService} from "../../../../../services/categoria.service";
import { Categoria } from '../../../../../models/categoria.models';
import {ProductoService} from "../../../../../services/producto.service";
import {Producto} from "../../../../../models/producto.models";

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit{

  //ATRIBUTOS DE MODALES
  mostrarModal: boolean = false;
  mostrarModalEditar = false;
  mostrarAgregarCategoriaModal: boolean = false; // Controla la visibilidad del modal
  nuevaCategoria: string = ''; // Almacena el valor de la nueva categoría


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
    this.productoService.getProducto().subscribe(   //CARGAR PRODUCTOS
      (productos: Producto[]) => {
        if (productos && productos.length > 0) {
          this.productos = productos; // Asignar todos los items al arreglo
          // console.log(this.productos); // Ver el array completo de items
        }
      },
      (error: any) => {
        console.error('Error al cargar los items', error);
      }
    );
    this.categoriaService.getCategorias().subscribe(  //CARGAR CATEGORIAS
      (data: Categoria[]) => {
        this.categorias = data;
        console.log(this.categorias); // Verificar los datos
        // alert('Categorias obtenidas')
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );

    this.mediaBaseUrl = this.productoService.getMediaBaseUrl(); // Obtiene la base URL del servicio
  }

  obtenerCategoria(){
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        console.log(this.categorias); // Verificar los datos
        // alert('Categorias obtenidas')
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }



  // validarStock(categoria : number, stock : number){
  //   if(categoria === 1 || categoria === 4){
  //     if(stock < 10) return 'Bajo Stock'
  //     else return 'En Stock'
  //   }else {
  //     if(stock < 50) return 'Bajo Stock'
  //     else return 'En Stock'
  //   }



  // CRUD CATEDORIAS
  agregarCategoria(): void {
    if (this.nuevaCategoria.trim()) {
      this.categoriaService.addCategoria({ nombre: this.nuevaCategoria }).subscribe(
        (categoria: Categoria) => {
          this.categorias.push(categoria); // Añadir la nueva categoría al arreglo
          this.cerrarAgregarCategoriaModal(); // Cerrar el modal
          alert('Categoria agregada con exito')
        },
        (error) => {
          console.error('Error al agregar la categoría', error);
          alert('Error al agregar la categoria')
        }
      );
    }
  }

  editCategoria(): void {
    if (this.categoriaId && this.categoriaSeleccionada.trim()) {
      const categoriaEditada = {
        id: this.categoriaId,
        nombre: this.categoriaSeleccionada
      };

      this.categoriaService.editarCategoria(categoriaEditada).subscribe(
        (categoriaActualizada: Categoria) => {
          const index = this.categorias.findIndex(c => c.id === categoriaEditada.id);
          if (index !== -1) {
            this.categorias[index] = categoriaActualizada; // Actualiza la categoría en el arreglo
          }
          this.cerrarEditarCategoriaModal(); // Cerrar el modal de edición
          alert('Categoria editada con exito')
        },
        (error) => {
          console.error('Error al editar la categoría', error);
          alert('Error al editar la categoria')
        }
      );
    }
  }

  eliminarCategoria(categoriaId: number) {
    if (categoriaId > 0) {
      this.categoriaService.deleteCategorias(categoriaId).subscribe(() => {
        // Eliminar categoría exitosa
        this.categorias = this.categorias.filter(c => c.id !== categoriaId);  // Elimina la categoría del array
        alert('Categoría eliminada con éxito');
      }, (error) => {
        console.error('Error al eliminar la categoría:', error);
        alert('Categoria no eliminada')
      });
    }
  }



  // MODALES
  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModalClickExterior(event: MouseEvent): void {
    // Este método se ejecuta si el usuario hace clic fuera del contenido del modal
    this.cerrarModal();
  }

  cerrarModal(): void {
    // Cierra el modal estableciendo la variable a false
    this.mostrarModal = false;
  }

  editarCategoria(): void {
    // alert('Editar Categoría seleccionado.');
    this.cerrarModal(); // Opcional: cerrar el modal después de seleccionar
    this.mostrarModalEditar = true;
  }

  cerrarEditarCategoriaClickExterior(event: MouseEvent): void {
    this.cerrarEditarCategoriaModal();
  }

  cerrarEditarCategoriaModal(): void {
    this.mostrarModalEditar = false;
  }

  volverAlModalPrincipal(): void {
    this.cerrarEditarCategoriaModal(); // Cierra el modal de editar categoría
    this.cerrarAgregarCategoriaModal();
    this.mostrarModal = true; // Reabre el modal principal
  }

  abrirAgregarCategoriaModal(): void {
    this.cerrarModal();
    this.mostrarAgregarCategoriaModal = true;
  }

  cerrarAgregarCategoriaModal(): void {
    this.mostrarAgregarCategoriaModal = false;
    this.nuevaCategoria = ''; // Limpia el campo al cerrar
  }


  isEditing: boolean = false;

  // Activar el modo de edición cuando se selecciona una categoría
  onCategoriaSeleccionada() {
    this.isEditing = true;  // Activa el modo de edición
    const selectedCategory = this.categorias.find(c => c.nombre === this.categoriaSeleccionada);
    this.categoriaId = selectedCategory ? selectedCategory.id : 0;  // Asigna el id basado en el nombre
  }

  guardarEdicion() {
    if (this.categoriaSeleccionada) {
      // Actualiza la categoría en el array
      const categoriaEditada = this.categorias.find(categoria => categoria.id === this.categoriaId);
      if (categoriaEditada) {
        categoriaEditada.nombre = this.categoriaSeleccionada;
        // Llamar al servicio para guardar la categoría editada (si se necesita)
        this.categoriaService.editarCategoria(categoriaEditada).subscribe(() => {
          // Actualización exitosa
          this.isEditing = false;  // Desactiva el modo de edición
        }, (error) => {
          console.error('Error al guardar la categoría:', error);
        });
      }
    }
  }

}
