import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-image-uploader-component',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './image-uploader-component.component.html',
  styleUrl: './image-uploader-component.component.css'
})
export class ImageUploaderComponentComponent {
  @Input() maxFiles: number = 10; // Máximo número de archivos permitidos
  @Output() imagesChanged = new EventEmitter<File[]>(); // Emite los archivos seleccionados
  @Output() error = new EventEmitter<string>(); // Emite mensajes de error
  @Input() imageUrls: string[] = []; // URLs de imágenes precargadas

  // imageUrls: string[] = []; // URLs de vista previa
  selectedImages: File[] = []; // Archivos seleccionados
  isDragging = false; // Controla el estilo de arrastre

  // Maneja la selección de imágenes desde el input
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      const files = Array.from(input.files);

      if (this.selectedImages.length + files.length > this.maxFiles) {
        this.error.emit(`Solo puedes subir hasta ${this.maxFiles} archivos.`);
        return;
      }

      files.forEach((file) => this.handleImage(file));
    }
  }

  // Maneja imágenes arrastradas y soltadas
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);

      if (this.selectedImages.length + files.length > this.maxFiles) {
        this.error.emit(`Solo puedes subir hasta ${this.maxFiles} archivos.`);
        return;
      }

      files.forEach((file) => this.handleImage(file));
    }
  }

  // Procesa una imagen para mostrar la vista previa
  private handleImage(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrls.push(reader.result as string);
      this.selectedImages.push(file);
      this.imagesChanged.emit(this.selectedImages); // Notifica cambios al padre
    };

    reader.readAsDataURL(file);
  }

  // Elimina una imagen seleccionada
  removeImage(index: number): void {
    this.imageUrls.splice(index, 1);
    this.selectedImages.splice(index, 1);
    this.imagesChanged.emit(this.selectedImages); // Notifica cambios al padre
  }

  resetUploader(): void {
    this.imageUrls = [];
    this.selectedImages = [];
    this.imagesChanged.emit(this.selectedImages);
    console.log('Uploader reseteado');
  }
}
