// import {Component, EventEmitter, Input, Output} from '@angular/core';
// import {FormsModule} from "@angular/forms";
// import {NgForOf, NgIf} from "@angular/common";
// import {RouterLink} from "@angular/router";
//
// @Component({
//   selector: 'app-form-producto',
//   standalone: true,
//   imports: [
//     FormsModule,
//     NgForOf,
//     NgIf,
//     RouterLink
//   ],
//   templateUrl: './form-producto.component.html',
//   styleUrl: './form-producto.component.css'
// })
// export class FormProductoComponent {
//   @Input() maxFiles: number = 10; // Máximo número de archivos permitidos
//   @Output() imagesChanged = new EventEmitter<File[]>(); // Emite los archivos seleccionados
//   @Output() error = new EventEmitter<string>(); // Emite mensajes de error
//
//   imageUrls: string[] = []; // URLs de vista previa
//   selectedImages: File[] = []; // Archivos seleccionados
//   isDragging = false; // Controla el estilo de arrastre
//
//   // Maneja la selección de imágenes desde el input
//   onImageSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input?.files) {
//       const files = Array.from(input.files);
//
//       if (this.selectedImages.length + files.length > this.maxFiles) {
//         this.error.emit(`Solo puedes subir hasta ${this.maxFiles} archivos.`);
//         return;
//       }
//
//       files.forEach((file) => this.handleImage(file));
//     }
//   }
//
//   // Maneja imágenes arrastradas y soltadas
//   onDragOver(event: DragEvent): void {
//     event.preventDefault();
//     this.isDragging = true;
//   }
//
//   onDragLeave(event: DragEvent): void {
//     event.preventDefault();
//     this.isDragging = false;
//   }
//
//   onDrop(event: DragEvent): void {
//     event.preventDefault();
//     this.isDragging = false;
//
//     if (event.dataTransfer && event.dataTransfer.files.length > 0) {
//       const files = Array.from(event.dataTransfer.files);
//
//       if (this.selectedImages.length + files.length > this.maxFiles) {
//         this.error.emit(`Solo puedes subir hasta ${this.maxFiles} archivos.`);
//         return;
//       }
//
//       files.forEach((file) => this.handleImage(file));
//     }
//   }
//
//   // Procesa una imagen para mostrar la vista previa
//   private handleImage(file: File): void {
//     const reader = new FileReader();
//
//     reader.onload = () => {
//       this.imageUrls.push(reader.result as string);
//       this.selectedImages.push(file);
//       this.imagesChanged.emit(this.selectedImages); // Notifica cambios al padre
//     };
//
//     reader.readAsDataURL(file);
//   }
//
//   // Elimina una imagen seleccionada
//   removeImage(index: number): void {
//     this.imageUrls.splice(index, 1);
//     this.selectedImages.splice(index, 1);
//     this.imagesChanged.emit(this.selectedImages); // Notifica cambios al padre
//   }
//
//   resetUploader(): void {
//     this.imageUrls = [];
//     this.selectedImages = [];
//     console.log('Uploader reseteado');
//   }
//
// }




import { Component, Input, Output, EventEmitter, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Producto} from "../../../../models/producto.models";
import {Categoria} from "../../../../models/categoria.models";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent {
  @Input() producto: Producto = {
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
  @Input() categorias: Categoria[] = [];
  @Output() formSubmit = new EventEmitter<Producto>();

  selectedCategory: number | null = null;
  nameError = '';
  categoryError = '';
  quantityError = '';
  descriptionError = '';
  precioError = '';
  imageError = '';

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
    this.imageError = this.producto.media_relacionado.length > 0 ? '' : 'Se debe seleccionar una imagen';
  }

  onSave(): void {
    this.validateName();
    this.validateCategory();
    this.validateQuantity();
    this.validateDescription();
    this.validatePrecio();
    this.validateImage();

    if (this.isFormValid()) {
      this.formSubmit.emit(this.producto);
    } else {
      console.log("Formulario no válido.");
    }
  }

  isFormValid(): boolean {
    return !this.nameError && !this.categoryError && !this.quantityError && !this.descriptionError && !this.precioError && !this.imageError;
  }
}
