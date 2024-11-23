import { Component } from '@angular/core';
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
export class GeneralComponent {

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

  // CONSTRUCTOS
  constructor(private productoService : ProductoService, private categoriaService : CategoriaService) { }

  // CARGA AL INICIAR LOS PRODUCTOS Y LAS CATEGORIAS
  ngOnInit(): void {
    this.productoService.getProducto().subscribe(
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

  validarCategoria(categoria:number){
    if(categoria === 1){
      return 'Mesas';
    }
    else if(categoria === 2){
      return 'Sillas';
    }
    else if (categoria === 3){
      return 'Vajilla'
    }else return 'Extras'
  }

  validarStock(categoria : number, stock : number){
    if(categoria === 1 || categoria === 4){
      if(stock < 10) return 'Bajo Stock'
      else return 'En Stock'
    }else {
      if(stock < 50) return 'Bajo Stock'
      else return 'En Stock'
    }
  }


  // CRUD DE CATEGORIAS
  // eliminarCategoria(): void {
  //   if (this.categoriaSeleccionada) {
  //     // this.categorias = this.categorias.filter(cat => cat !== this.categoriaSeleccionada);
  //     this.categoriaSeleccionada = ''; // Limpia el campo
  //     alert('Categoría eliminada exitosamente');
  //   } else {
  //     alert('Selecciona una categoría válida para eliminar.');
  //   }
  // }

  // actualizarCategoria(): void {
  //   if (this.categoriaSeleccionada) {
  //     const categoriaIndex = this.categorias.findIndex(cat => cat === this.categoriaSeleccionada);
  //     if (categoriaIndex !== -1) {
  //       alert('Categoría actualizada: ' + this.categoriaSeleccionada);
  //     }
  //     this.categoriaSeleccionada = ''; // Limpia el campo
  //   } else {
  //     alert('Escribe o selecciona una categoría válida.');
  //   }
  // }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.deleteCategorias(id).subscribe({
        next: () => {
          alert('Categoría eliminada correctamente.');
          this.obtenerCategoria(); // Actualiza la lista de categorías
        },
        error: (err) => {
          console.error('Error al eliminar la categoría:', err);
          alert('Ocurrió un error al intentar eliminar la categoría.');
        }
      });
    }
  }

  actualizarCategoria(categoria: Categoria): void {
    this.categoriaService.updateCategorias(categoria).subscribe({
      next: () => {
        alert('Categoría actualizada correctamente.');
        this.obtenerCategoria(); // Actualiza la lista de categorías
      },
      error: (err) => {
        console.error('Error al actualizar la categoría:', err);
        alert('Ocurrió un error al intentar actualizar la categoría.');
      }
    });
  }


  adjuntarCategoria(): void {
    if (this.nuevaCategoria.trim()) {
      // this.categorias.push(this.nuevaCategoria.trim());

      const nuevaCategoria:Categoria = {
        nombre: (document.getElementById('nuevaCategoria') as HTMLInputElement).value
      };

      this.categoriaService.addCategoria(nuevaCategoria).subscribe(
        (response) => {
          alert('Categoria agregada correctamente');
          this.cerrarAgregarCategoriaModal(); // Cierra el modal tras agregar
        },
        (error) => {
          console.error('Error al agregar la categoria', error);
        }
      );
    } else {
      alert('El nombre de la categoría no puede estar vacío.');
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
    this.isEditing = true;
    const selectedCategory = this.categorias.find(c => c.nombre === this.categoriaSeleccionada);
    this.categoriaId = selectedCategory ? selectedCategory.id : 0;  // Asigna el id basado en el nombre
  }

  // Guardar la edición y actualizar la lista
  guardarEdicion() {
    const categoriaEditada = this.categorias.find(categoria => categoria.nombre === this.categoriaSeleccionada);
    if (categoriaEditada) {
      categoriaEditada.nombre = this.categoriaSeleccionada;
      this.isEditing = false; // Desactivar la edición
    }
  }

}
