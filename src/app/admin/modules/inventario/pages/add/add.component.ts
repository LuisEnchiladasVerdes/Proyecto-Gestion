import { Component, signal, ViewChild } from '@angular/core';
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Categoria } from '../../../../../models/categoria.models';
import { CategoriaService } from "../../../../../services/categoria.service";
import { ProductoService } from "../../../../../services/producto.service";
import {Producto} from "../../../../../models/producto.models";
import {AlertService} from "../../../../../services/alert.service";
import {
  ImageUploaderComponentComponent
} from "../../../../components/common/image-uploader-component/image-uploader-component.component";

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, ImageUploaderComponentComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  @ViewChild('uploader') uploader!: ImageUploaderComponentComponent;

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
  selectedCategory: number | null = null;

  nameError = '';
  categoryError = '';
  quantityError = '';
  descriptionError = '';
  precioError = '';
  imageError = '';

  selectedImages: File[] = []; // Array de archivos seleccionados
  imageUrls: string[] = [];    // Array de URLs para la vista previa


  constructor(
    private categoriasService: CategoriaService,
    private productoService: ProductoService,
    private alertService: AlertService
  ) {}

  onImagesChanged(images: File[]): void {
    this.selectedImages = images;
  }

  onImageError(message: string): void {
    console.error(message);
    this.alertService.warning(message);
  }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (data: Categoria[]) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      const files = Array.from(input.files); // Convierte FileList a array
      files.forEach((file) => this.handleImage(file)); // Procesa cada archivo
    }
  }

  validateName(): void {
    this.nameError = this.producto.nombre.trim()
      ? /^[^0-9]+$/.test(this.producto.nombre)
        ? ''
        : 'El nombre no debe contener números'
      : 'El nombre es obligatorio';
  }

  validateCategory(): void {
    this.categoryError = this.selectedCategory
      ? ''
      : 'Por favor selecciona una categoría';
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
    this.precioError = this.producto.precio > 0
      ? ''
      : 'El precio debe ser mayor que 0.';
  }

  validateImage(): void {
    this.imageError = this.selectedImages ? '' : 'Se debe seleccionar una imagen';
  }

  onSaveItem(event: Event): void {
    event.preventDefault();

    this.validateName();
    this.validateCategory();
    this.validateQuantity();
    this.validateDescription();
    this.validateImage();

    this.agregarProducto();
  }

  agregarProducto(): void {
    if (this.validarFormulario()) {
      const formData = new FormData();

      // Asignar categoria_id desde selectedCategory
      this.producto.categoria_id = this.selectedCategory!;

      // Agregar campos al FormData
      formData.append('nombre', this.producto.nombre);
      formData.append('descripcion', this.producto.descripcion);
      formData.append('stock', this.producto.stock.toString());
      formData.append('precio', this.producto.precio.toString());
      formData.append('categoria_id', this.producto.categoria_id.toString());

      // Agregar múltiples imágenes
      this.selectedImages.forEach((image, index) => {
        formData.append(`media[${index}]`, image); // Usar un nombre único para cada archivo
      });

      // Enviar datos al servicio
      this.productoService.addProducto(formData).subscribe({
        next: (response) => {
          this.alertService.success('Producto creado exitosamente.');

          // Limpia el formulario y el uploader DESPUÉS de guardar exitosamente
          this.resetForm();
          this.uploader.resetUploader();
        },
        error: (err) => {
          // Manejo de errores
          console.error('Error al crear el producto', err);
          this.alertService.error('Error al crear el producto');
        }
      });
    } else {
      this.alertService.warning('Por favor , complete todos los campos.')
    }
  }


  validarFormulario(): boolean {
    console.log('Validando formulario:');
    console.log('Nombre:', this.producto.nombre);
    console.log('Descripción:', this.producto.descripcion);
    console.log('Stock:', this.producto.stock);
    console.log('Precio:', this.producto.precio);
    console.log('Categoría:', this.selectedCategory);
    console.log('Imagen seleccionada:', this.selectedImages);

    let valid = true;

    if (!this.producto.nombre.trim()) {
      this.nameError = 'El nombre es obligatorio.';
      valid = false;
    } else {
      this.nameError = '';
    }

    if (!this.producto.descripcion.trim()) {
      this.descriptionError = 'La descripción es obligatoria.';
      valid = false;
    } else {
      this.descriptionError = '';
    }

    if (this.producto.stock <= 0) {
      this.quantityError = 'El stock debe ser mayor que 10.';
      valid = false;
    } else {
      this.quantityError = '';
    }

    if (this.producto.precio <= 10) {
      this.precioError = 'El precio debe ser mayor que 10.';
      valid = false;
    } else {
      this.precioError = '';
    }

    if (!this.selectedCategory) {
      this.categoryError = 'Seleccionar una categoría.';
      valid = false;
    } else {
      this.categoryError = '';
    }

    if (!this.selectedImages) {
      this.imageError = 'Se debe seleccionar al menos una imagen.';
      valid = false;
    } else {
      this.imageError = '';
    }

    console.log('Formulario válido:', valid);
    return valid;
  }

  resetForm(): void {
    this.producto = {
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
    this.selectedCategory = null;
    this.imageUrls = []; // Limpia las URLs
    this.selectedImages = []; // Limpia los archivos seleccionados
    this.nameError = '';
    this.categoryError = '';
    this.quantityError = '';
    this.descriptionError = '';
    this.precioError = '';
    this.imageError = '';

    console.log('Formulario reseteado');
  }


  isDragging = false; // Variable para gestionar el estilo del área de arrastre

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del navegador
    this.isDragging = true; // Activa el estado de arrastre
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault(); // Opcional, asegura que el evento no tenga efectos colaterales
    this.isDragging = false; // Desactiva el estado de arrastre
  }

  onDrop(event: DragEvent): void {
    event.preventDefault(); // Evita el comportamiento predeterminado
    this.isDragging = false; // Restablece el estado de arrastre

    // Procesa el archivo arrastrado
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleImage(file);
    }
  }

  handleImage(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrls.push(reader.result as string); // Agrega la URL base64
      this.selectedImages.push(file); // Guarda el archivo en selectedImages
    };

    reader.readAsDataURL(file); // Convierte la imagen a Base64
  }

  removeImage(index: number): void {
    this.imageUrls.splice(index, 1); // Elimina la URL de la vista previa
    this.selectedImages.splice(index, 1); // Elimina el archivo del array
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
