import { Component, OnInit, signal } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from "../../../../../models/producto.models";
import { ProductoService } from "../../../../../services/producto.service";
import { Categoria } from "../../../../../models/categoria.models";
import { CategoriaService } from "../../../../../services/categoria.service";
import {AlertService} from "../../../../../services/alert.service";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    RouterLink,
    NgForOf
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  productoOriginal: Producto | null = null; // Para guardar el estado original del producto
  producto: Producto = {
    id: 0,
    nombre: '',
    categoria: { id: 0, nombre: '' },
    descripcion: '',
    stock: 0,
    precio_actual: 0,
    precio: 0,
    media_relacionado: []
  };

  categorias: Categoria[] = [];
  formValid = {
    nombre: true,
    categoria: true,
    stock: true,
    precio: true,
    descripcion: true
  };

  selectedImage: File | null = null; // Para almacenar el archivo seleccionado
  imageUrl = signal<string | null>(null);
  mediaBaseUrl: string = '';

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(id);
    }
    this.cargarCategorias();
    this.mediaBaseUrl = this.productoService.getMediaBaseUrl();
  }

  cargarProducto(id: string): void {
    this.productoService.getItemById(id).subscribe(
      (producto: Producto) => {
        this.producto = { ...producto };
        this.productoOriginal = { ...producto }; // Guardar copia exacta para comparar cambios
        this.producto.categoria_id = producto.categoria?.id || undefined;
      },
      (error) => {
        // this.toastr.error('Error al cargar el producto.', 'Error', { timeOut: 3000 });
        this.alertService.modalConIconoError('Error al cargar el producto.');
      }
    );
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (categorias: Categoria[]) => {
        this.categorias = categorias;
      },
      (error) => {
        // this.toastr.error('Error al cargar las categorías.', 'Error', { timeOut: 3000 });
        this.alertService.modalConIconoError('Error al cargar las categorias.');
      }
    );
  }

  guardarCambios(): void {
    if (!this.verificarCambios()) {
      // this.toastr.info('No hay cambios en el formulario.', 'Sin cambios', { timeOut: 3000 });
      this.alertService.warning('No hay cambios en el formulario.');
      return;
    }

    if (this.validarFormulario()) {
      const formData = new FormData();
      formData.append('nombre', this.producto.nombre);
      formData.append('descripcion', this.producto.descripcion);
      formData.append('stock', this.producto.stock.toString());
      formData.append('precio', this.producto.precio_actual.toString());

      if (this.producto.categoria_id) {
        formData.append('categoria_id', this.producto.categoria_id.toString());
      } else {
        alert('Por favor selecciona una categoría antes de guardar.');
        return;
      }

      if (this.selectedImage) {
        formData.append('media', this.selectedImage);
      }

      if (this.producto.id) {
        this.productoService.updateItem(formData, this.producto.id).subscribe(
          (response) => {
            // this.toastr.success('Producto actualizado correctamente.', 'Éxito', { timeOut: 3000 });
            this.alertService.success('Producto actualizado exitosamente.');
            this.router.navigate(['/admin/inventario/general']);
          },
          (error) => {
            // this.toastr.error('Error al guardar los cambios.', 'Error', { timeOut: 3000 });
            this.alertService.error('Error al guardar los cambios.');
          }
        );
      } else {
        // this.toastr.error('ID del producto no válido.', 'Error', { timeOut: 3000 });
        this.alertService.error('ID del producto no valido.');
      }
    } else {
      // this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error', { timeOut: 3000 });
      this.alertService.modalConIconoError('Por favor complete todos los campos correctamente.');
    }
  }

  validarFormulario(): boolean {
    let valid = true;
    if (!this.producto.nombre || !this.producto.descripcion) valid = false;
    if (this.producto.stock <= 0) valid = false;
    if (this.producto.precio_actual <= 0) valid = false;
    return valid;
  }

  verificarCambios(): boolean {
    if (!this.productoOriginal) {
      return true; // Si no hay datos originales, asume que hay cambios
    }

    return (
      this.producto.nombre !== this.productoOriginal.nombre ||
      this.producto.descripcion !== this.productoOriginal.descripcion ||
      this.producto.stock !== this.productoOriginal.stock ||
      this.producto.precio_actual !== this.productoOriginal.precio_actual ||
      this.producto.categoria_id !== this.productoOriginal.categoria?.id
    );
  }

  onCategoriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.producto.categoria_id = Number(selectElement.value);
  }

  eliminarImagen(index: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      this.producto.media_relacionado.splice(index, 1);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length === 1) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageString = reader.result as string;
        this.imageUrl.set(imageString);
        this.selectedImage = file;
      };

      reader.readAsDataURL(file);
    }
  }
}
