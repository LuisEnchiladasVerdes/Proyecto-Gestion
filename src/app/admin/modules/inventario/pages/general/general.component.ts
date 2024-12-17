import {Component, OnInit} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CategoriaService} from "../../../../../services/categoria.service";
import { Categoria } from '../../../../../models/categoria.models';
import {ProductoService} from "../../../../../services/producto.service";
import {Producto} from "../../../../../models/producto.models";
import { AuthService } from '../../../../../services/auth.service';
import {AlertService} from "../../../../../services/alert.service";
import {PdfService} from "../../../../../services/pdf.service";
import {ExcelService} from "../../../../../services/excel.service";

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
  productosParaImprimir: Producto[] = [];

  // ATRIBUTO PARA IMAGENES
  mediaBaseUrl: string = '';

  // CARRUSEL DE IMÁGENES
  currentImageIndex: { [key: number]: number } = {}; // Índice actual de imagen para cada producto

  // CONSTRUCTOS
  constructor(private productoService : ProductoService, private categoriaService : CategoriaService, private router: Router,
    private authService: AuthService,   private alertService: AlertService, private pdfService: PdfService, private excelService: ExcelService
  ) { }

  // CARGA AL INICIAR LOS PRODUCTOS Y LAS CATEGORIAS
  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategoria();

    // this.imprimirProd();

    this.mediaBaseUrl = this.productoService.getMediaBaseUrl(); // Obtiene la base URL del servicio
      // Inicia el carrusel de imágenes
      this.startImageCarousel();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => {
        this.productos = productos;

        this.productosParaImprimir = productos;
      },
      error: (err) => {
        if (err.message.includes('401')) {
          this.alertService.modalConIconoError('No autorizado. Inicia sesión nuevamente.');
          this.router.navigate(['/admin/login']);
        } else {
          this.alertService.modalConIconoError('Error al cargar los productos.');
        }
      },
    });
  }


  obtenerCategoria(){
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        // this.toastr.error('Error al cargar las categorias.', 'Error',{timeOut: 3000});
        this.alertService.modalConIconoError('Error al cargar las categorias.');
      }
    );
  }

  // LÓGICA DEL CARRUSEL
  startImageCarousel(): void {
    setInterval(() => {
      this.productos.forEach((producto) => {
        // Validar que el producto tenga un ID y que media_relacionado no esté vacío
        if (producto.id && producto.media_relacionado && producto.media_relacionado.length > 1) {
          if (!(producto.id in this.currentImageIndex)) {
            this.currentImageIndex[producto.id] = 0;
          }
          this.currentImageIndex[producto.id] =
            (this.currentImageIndex[producto.id] + 1) % producto.media_relacionado.length;
        }
      });
    }, 3000); // Cambiar cada 3 segundos
  }


  // CRUD CATEDORIAS
  agregarCategoria(): void {
    if (this.nuevaCategoria.trim()) {
      this.categoriaService.addCategoria({ nombre: this.nuevaCategoria }).subscribe(
        (categoria: Categoria) => {
          this.categorias.push(categoria); // Añadir la nueva categoría al arreglo
          this.cerrarAgregarCategoriaModal(); // Cerrar el modal
          // this.toastr.success('Categoria agregada correctamente.', 'Exito',{timeOut: 3000});
          this.alertService.success('Categoria agregada correctamente.');
        },
        (error) => {
          console.error('Error al agregar la categoría', error);
          // alert('Error al agregar la categoria')
          // this.toastr.error('Error al agregar la categoria.', 'Error',{timeOut: 3000});
          this.alertService.modalConIconoError('Nombre de la categoria en uso.');
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
          // this.toastr.success('Categoria editada correctamente.', 'Exito',{timeOut: 3000});
          this.alertService.success('Categoria editada correctamente.');
        },
        (error) => {
          console.error('Error al editar la categoría', error);
          // this.toastr.error('Error al editar la categoria.', 'Error',{timeOut: 3000});
          this.alertService.modalConIconoError('Error al editar la categoria.');
        }
      );
    }
  }

  eliminarCategoria(categoriaId: number) {
    if (categoriaId > 0) {
      this.categoriaService.deleteCategorias(categoriaId).subscribe(() => {
        this.categorias = this.categorias.filter(c => c.id !== categoriaId);  // Elimina la categoría del array
        // this.toastr.success('Categoria eliminada correctamente.', 'Exito',{timeOut: 3000});
        this.alertService.success('Categoria eliminada correctamente.');
      }, (error) => {
        console.error('Error al eliminar la categoría:', error);
        // this.toastr.error('Error al eliminar la categoria.', 'Error',{timeOut: 3000});
        this.alertService.modalConIconoError('Error al eliminar la categoria.');
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
      // this.toastr.warning('No se han detectado cambios en el nombre de la categoría.', 'Advertencia', { timeOut: 3000 });
      this.alertService.warning('No se han detectado cambios en el nombre de la categoria.');
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
        // this.toastr.success('Categoría editada correctamente.', 'Éxito', { timeOut: 3000 });
        this.alertService.success('Categoria editada correctamente.');
      },
      (error) => {
        console.error('Error al editar la categoría', error);
        // this.toastr.error('Error al editar la categoría.', 'Error', { timeOut: 3000 });
        this.alertService.modalConIconoError('Error al editar la categoria.');
      }
    );
  }

  eliminarProducto(id: number | undefined): void {
    if (!id) {
      // this.toastr.error('El ID del producto no es válido.', 'Error');
      this.alertService.warning('El ID del producto no es valido.');
      return;
    }

    this.alertService.showConfirmAlert(
      'Este producto sera eliminado de manera permanente'
    ).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteItem(id).subscribe(
          () => {
            this.productos = this.productos.filter((producto) => producto.id !== id);
            // this.toastr.success('Producto eliminado correctamente.', 'Éxito');
            this.alertService.success('Producto eliminado correctamente.');
            this.obtenerProductos();
          },
          (error) => {
            // this.toastr.error('Ocurrió un error al eliminar el producto.', 'Error', { timeOut: 3000 });
            this.alertService.modalConIconoError('currió un error al eliminar el producto');
          }
        );
      }
    });
  }


  filterProductosPorCategoria(): void {
    if (!this.categoriaSeleccionada) {
      // Si no hay categoría seleccionada (opción de "todas"), carga todos los productos
      this.productoService.getProductos().subscribe(
        (productos: Producto[]) => {
          this.productos = productos;
        },
        (error) => {
          // this.toastr.error('Error al cargar todos los productos.', 'Error',{timeOut: 3000});
          this.alertService.error('Error al cargar todos los productos.');
        }
      );
    } else {
      const categoriaId = parseInt(this.categoriaSeleccionada, 10);
      this.productoService.getProductosPorCategoria(categoriaId).subscribe(
        (productos: Producto[]) => {
          this.productos = productos;
        },
        (error) => {
          // this.toastr.error('Error al filtrar productos por categoria.', 'Error',{timeOut: 3000});
          this.alertService.error('Error al filtrar productos por categoria.');
        }
      );
    }
  }

  imprimirPDF(): void {
    const columnas = ['nombre', 'categoria', 'codigo', 'stock', 'precio_actual'];
    const blob = this.pdfService.generarPDF(this.productosParaImprimir, columnas);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productos.pdf';
    link.click();
  }

  exportarExcel(): void {
    const columnas = ['nombre', 'categoria', 'codigo', 'stock', 'precio_actual'];
    this.excelService.exportToExcel(this.productosParaImprimir, columnas);
  }

}
