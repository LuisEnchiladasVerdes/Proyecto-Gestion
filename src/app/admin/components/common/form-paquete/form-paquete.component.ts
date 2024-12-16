import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import { Categoria } from '../../../../models/categoria.models';
import { Producto } from '../../../../models/producto.models';
import { FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { ProductoService } from "../../../../services/producto.service";
import { paquetePost} from "../../../../models/paquetes.models";
import {ImageUploaderComponentComponent} from "../image-uploader-component/image-uploader-component.component";

@Component({
  selector: 'app-form-paquete',
  templateUrl: './form-paquete.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ImageUploaderComponentComponent,
    NgClass,
    NgIf
  ],
  styleUrls: ['./form-paquete.component.css']
})
export class FormPaqueteComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() formData = {
    nombrePaquete: '',
    descripcionPaquete: '',
    descuentoGeneral: null as number | null,
  };

  @Input() rows: Array<{ cantidad: number; categoria: string; producto_id: number | null; items: Producto[] }> = [];
  @Input() categorias: Categoria[] = [];

  @Input() existingImages: string[] = [];

  @Output() savePaquete = new EventEmitter<any>();
  @Output() cancelPaquete = new EventEmitter<void>();

  @Output() imagesChanged = new EventEmitter<File[]>(); // Crear el @Output()

  @ViewChild(ImageUploaderComponentComponent)
  imageUploaderComponent!: ImageUploaderComponentComponent;

  selectedImages: File[] = []; // Archivos seleccionados


  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    if (!this.rows.length) this.agregarFila();

    if (this.imageUploaderComponent) {
      this.imageUploaderComponent.imageUrls = [...this.existingImages];
    }
  }

  agregarFila(): void {
    this.rows.push({ cantidad: 1, categoria: '', producto_id: null, items: [] });
  }

  eliminarFila(index: number): void {
    this.rows.splice(index, 1);
  }

  filterItemsByCategory(index: number): void {
    const categoriaId = parseInt(this.rows[index].categoria, 10);
    if (!isNaN(categoriaId)) {
      this.productoService.getProductosPorCategoria(categoriaId).subscribe({
        next: (productos) => (this.rows[index].items = productos),
        error: () => (this.rows[index].items = []),
      });
    }
  }

  onSubmit(): void {
    const detalles: paquetePost[] = this.rows.map((row) => ({
      producto: row.producto_id!,
      cantidad: row.cantidad,
    }));

    const paquete = {
      nombrePaquete: this.formData.nombrePaquete,
      descripcionPaquete: this.formData.descripcionPaquete,
      descuentoGeneral: this.formData.descuentoGeneral,
      detalles,
      rows: this.rows // Asegúrate de emitir 'rows'
    };

    this.savePaquete.emit(paquete);
  }

  cancel(): void {
    this.cancelPaquete.emit();
  }

  onImagesChanged(images: File[]): void {
    this.imagesChanged.emit(images);
    this.selectedImages = images; // Actualiza las imágenes seleccionadas
    console.log('Imágenes seleccionadas:', this.selectedImages);
  }

  onImageError(message: string): void {
    console.error('Error de subida:', message);
  }

  resetImages(): void {
    if (this.imageUploaderComponent) {
      this.imageUploaderComponent.resetUploader();
    }
  }
}
