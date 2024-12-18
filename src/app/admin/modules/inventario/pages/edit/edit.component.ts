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
    codigo: 0,
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

  imagenesModificadas = false; // Nueva propiedad para rastrear cambios en imágenes

  nameError = '';
  categoryError = '';
  quantityError = '';
  descriptionError = '';
  precioError = '';
  imageError = '';

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
        this.alertService.modalConIconoError('Error al cargar las categorias.');
      }
    );
  }

  guardarCambios(): void {
    if (!this.verificarCambios()) {
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
            this.alertService.error('Error al guardar los cambios.');
          }
        );
      } else {
        this.alertService.error('ID del producto no valido.');
      }
    } else {
      // this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error', { timeOut: 3000 });
      this.alertService.modalConIconoError('Por favor complete todos los campos correctamente.');
    }
  }

  // validarFormulario(): boolean {
  //   let valid = true;
  //   if (!this.producto.nombre || !this.producto.descripcion) valid = false;
  //   if (this.producto.stock <= 0) valid = false;
  //   if (this.producto.precio_actual <= 0) valid = false;
  //   return valid;
  // }

  validarFormulario(): boolean {
    this.validateName();
    this.validateQuantity();
    this.validateDescription();
    this.validatePrecio();

    const valid =
      !this.nameError &&
      !this.quantityError &&
      !this.descriptionError &&
      !this.precioError;

    return valid;
  }


  verificarCambios(): boolean {
    if (!this.productoOriginal) {
      console.log('No hay producto original. Se asumen cambios.');
      return true; // Si no hay datos originales, asume que hay cambios
    }

    const camposCambiados =
      this.producto.nombre !== this.productoOriginal.nombre ||
      this.producto.descripcion !== this.productoOriginal.descripcion ||
      this.producto.stock !== this.productoOriginal.stock ||
      this.producto.precio_actual !== this.productoOriginal.precio_actual ||
      this.producto.categoria_id !== this.productoOriginal.categoria?.id;

    const nuevasImagenesAgregadas = !!this.producto.media && this.producto.media.length > 0;

    const resultado = camposCambiados || this.imagenesModificadas || nuevasImagenesAgregadas;

    console.log('Campos cambiados:', camposCambiados);
    console.log('Nuevas imágenes agregadas:', nuevasImagenesAgregadas);
    console.log('Imágenes modificadas:', this.imagenesModificadas);
    console.log('Resultado final de verificarCambios:', resultado);

    return resultado;
  }


  onCategoriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.producto.categoria_id = Number(selectElement.value);
  }

  eliminarImagen(index: number): void {
    this.alertService.showConfirmAlert(
      '¿Estás seguro de que deseas eliminar esta imagen?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.producto.media_relacionado.splice(index, 1); // Elimina la imagen del arreglo
        this.imagenesModificadas = true; // Marca que las imágenes han sido modificadas
        console.log('Imagen eliminada. Imágenes modificadas:', this.imagenesModificadas);
      }
    });
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

  validateName(): void {
    this.nameError = this.producto.nombre.trim()
      ? /^[^0-9]+$/.test(this.producto.nombre)
        ? ''
        : 'El nombre no debe contener números'
      : 'El nombre es obligatorio';
  }

  validateQuantity(): void {
    this.quantityError = this.producto.stock > 0
      ? ''
      : 'La cantidad debe ser mayor que 0';
  }

  validateDescription(): void {
    this.descriptionError = this.producto.descripcion.trim()
      ? ''
      : 'La descripción no debe estar vacía';
  }

  validatePrecio(): void {
    this.precioError = this.producto.precio_actual > 0
      ? ''
      : 'El precio debe ser mayor que 0.';
  }

  permitirSoloNumeros(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // Permitir solo números (códigos de 0 a 9) y teclas especiales como backspace
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  permitirSoloLetras(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    const char = String.fromCharCode(charCode);
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Permitir solo letras, la ñ, espacios y teclas especiales
    if (!regex.test(char) && charCode > 32 && charCode !== 0) {
      event.preventDefault();
    }
  }
}
