import {Component, OnInit} from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CategoriaService} from "../../../../../services/categoria.service";
import { Categoria } from '../../../../../models/categoria.models';
import {ProductoService} from "../../../../../services/producto.service";
import {Producto} from "../../../../../models/producto.models";
import {ToastrService} from "ngx-toastr";

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
  categoriaOriginal: string = ''; // Guardar el nombre original de la categoría

  // ATRIBUTO DE PRODUCTOS
  productos: Producto[] = []; // Definir un arreglo para los items

  // ATRIBUTO PARA IMAGENES
  mediaBaseUrl: string = '';

  // CONSTRUCTOS
  constructor(private productoService : ProductoService, private categoriaService : CategoriaService, private toastr: ToastrService) { }

  // CARGA AL INICIAR LOS PRODUCTOS Y LAS CATEGORIAS
  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategoria();

    this.mediaBaseUrl = this.productoService.getMediaBaseUrl(); // Obtiene la base URL del servicio
  }

  obtenerProductos(){
    this.productoService.getProductos().subscribe(   //CARGAR PRODUCTOS
      (productos: Producto[]) => {
        if (productos && productos.length > 0) {
          this.productos = productos;
        }
      },
      (error: any) => {
        this.toastr.error('Error al cargar los items.', 'Error',{timeOut: 3000});
      }
    );
  }

  obtenerCategoria(){
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        // console.error('Error al cargar las categorías', error);
        this.toastr.error('Error al cargar las categorias.', 'Error',{timeOut: 3000});
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
          this.toastr.success('Categoria agregada correctamente.', 'Exito',{timeOut: 3000});
        },
        (error) => {
          console.error('Error al agregar la categoría', error);
          // alert('Error al agregar la categoria')
          this.toastr.error('Error al agregar la categoria.', 'Error',{timeOut: 3000});
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
          this.toastr.success('Categoria editada correctamente.', 'Exito',{timeOut: 3000});
        },
        (error) => {
          console.error('Error al editar la categoría', error);
          this.toastr.error('Error al editar la categoria.', 'Error',{timeOut: 3000});
        }
      );
    }
  }

  eliminarCategoria(categoriaId: number) {
    if (categoriaId > 0) {
      this.categoriaService.deleteCategorias(categoriaId).subscribe(() => {
        this.categorias = this.categorias.filter(c => c.id !== categoriaId);  // Elimina la categoría del array
        this.toastr.success('Categoria eliminada correctamente.', 'Exito',{timeOut: 3000});
      }, (error) => {
        console.error('Error al eliminar la categoría:', error);
        this.toastr.error('Error al eliminar la categoria.', 'Error',{timeOut: 3000});
      });
    }
  }

  // MODALES
  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModalClickExterior(event: MouseEvent): void {
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  editarCategoria(): void {
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

  onCategoriaSeleccionada() {
    this.isEditing = true; // Activar modo de edición
    const selectedCategory = this.categorias.find(c => c.nombre === this.categoriaSeleccionada);
    this.categoriaId = selectedCategory ? selectedCategory.id : 0; // Asignar ID de la categoría seleccionada
    this.categoriaOriginal = this.categoriaSeleccionada; // Guardar el nombre original de la categoría
  }

  guardarEdicion() {
    if (this.categoriaSeleccionada.trim() === this.categoriaOriginal.trim()) {
      this.toastr.warning('No se han detectado cambios en el nombre de la categoría.', 'Advertencia', { timeOut: 3000 });
      return; // Detener el proceso de edición
    }

    // Si hubo cambios, proceder con la actualización de la categoría
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
        this.cerrarEditarCategoriaModal(); // Cierra el modal de edición
        this.toastr.success('Categoría editada correctamente.', 'Éxito', { timeOut: 3000 });
      },
      (error) => {
        console.error('Error al editar la categoría', error);
        this.toastr.error('Error al editar la categoría.', 'Error', { timeOut: 3000 });
      }
    );
  }


  eliminarProducto(id: number | undefined): void {
    if (!id) {
      alert('El ID del producto no es válido.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.deleteItem(id).subscribe(
        () => {
          this.productos = this.productos.filter((producto) => producto.id !== id);
          this.toastr.success('Producto eliminado correctamente.', 'Exito');
          this.obtenerProductos();
        },
        (error) => {
          this.toastr.error('Ocurrio un error al eliminar el producto.', 'Error',{timeOut: 3000});
        }
      );
    }
  }

  filterProductosPorCategoria(): void {
    if (!this.categoriaSeleccionada) {
      // Si no hay categoría seleccionada (opción de "todas"), carga todos los productos
      this.productoService.getProductos().subscribe(
        (productos: Producto[]) => {
          this.productos = productos;
        },
        (error) => {
          this.toastr.error('Error al cargar todos los productos.', 'Error',{timeOut: 3000});
        }
      );
    } else {
      const categoriaId = parseInt(this.categoriaSeleccionada, 10);
      this.productoService.getProductosPorCategoria(categoriaId).subscribe(
        (productos: Producto[]) => {
          this.productos = productos;
        },
        (error) => {
          this.toastr.error('Error al filtrar productos por categoria.', 'Error',{timeOut: 3000});
        }
      );
    }
  }


}
