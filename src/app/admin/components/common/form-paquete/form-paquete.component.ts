import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Categoria } from '../../../../models/categoria.models';
import { Producto } from '../../../../models/producto.models';
import { FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ProductoService} from "../../../../services/producto.service";

@Component({
  selector: 'app-form-paquete',
  templateUrl: './form-paquete.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./form-paquete.component.html']
})
export class FormPaqueteComponent implements OnInit {
  // @Input() isEditMode = false;
  // @Input() formData: { nombrePaquete: string; descripcionPaquete: string } = {
  //   nombrePaquete: '',
  //   descripcionPaquete: ''
  // };
  // @Input() rows: Array<{ cantidad: number; categoria: string; producto: number | null; descuento?: number; items: Producto[] }> = [];
  // @Input() categorias: Categoria[] = [];
  //
  // @Output() savePaquete = new EventEmitter<void>();
  // @Output() cancelPaquete = new EventEmitter<void>();
  //
  // constructor(private productoService: ProductoService, ) { }
  //
  // ngOnInit(): void {
  //   if (!this.rows.length) {
  //     this.agregarFila();
  //   }
  // }
  //
  // agregarFila(): void {
  //   this.rows.push({ cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] });
  // }
  //
  // eliminarFila(index: number): void {
  //   this.rows.splice(index, 1);
  // }
  //
  // filterItemsByCategory(index: number): void {
  //   const categoriaId = parseInt(this.rows[index].categoria, 10);
  //
  //   if (isNaN(categoriaId)) {
  //     this.rows[index].items = []; // Asegúrate de limpiar los productos si no hay categoría válida
  //     return;
  //   }
  //
  //   this.productoService.getProductosPorCategoria(categoriaId).subscribe({
  //     next: (productos) => {
  //       this.rows[index].items = productos; // Asigna los productos al array de la fila
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar los productos:', err);
  //       this.rows[index].items = []; // Limpia los productos si hay un error
  //     }
  //   });
  // }
  //
  //
  // onSubmit(): void {
  //   if (!this.formData.nombrePaquete || !this.formData.descripcionPaquete) {
  //     alert('Por favor, completa todos los campos obligatorios.');
  //     return;
  //   }
  //   this.savePaquete.emit();
  // }
  //
  // cancel(): void {
  //   this.cancelPaquete.emit();
  // }



  @Input() isEditMode = false;
  @Input() formData: { nombrePaquete: string; descripcionPaquete: string } = {
    nombrePaquete: '',
    descripcionPaquete: ''
  };
  @Input() rows: Array<{
    cantidad: number;
    categoria: string;
    producto: number | null | undefined;
    descuento?: number | null;
    items: Producto[];
  }> = [];
  @Input() categorias: Categoria[] = [];

  @Output() savePaquete = new EventEmitter<{ nombrePaquete: string; descripcionPaquete: string; rows: any[] }>();
  @Output() cancelPaquete = new EventEmitter<void>();

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    // Si no hay filas iniciales, agrega una por defecto
    if (!this.rows.length) {
      this.agregarFila();
    }
  }

  agregarFila(): void {
    this.rows.push({
      cantidad: 1,
      categoria: '',
      producto: null,
      descuento: 0,
      items: []
    });
  }

  eliminarFila(index: number): void {
    this.rows.splice(index, 1);
  }

  filterItemsByCategory(index: number): void {
    const categoriaId = parseInt(this.rows[index].categoria, 10);

    if (isNaN(categoriaId)) {
      this.rows[index].items = []; // Limpia productos si la categoría no es válida
      return;
    }

    this.productoService.getProductosPorCategoria(categoriaId).subscribe({
      next: (productos) => {
        this.rows[index].items = productos; // Carga productos para la categoría seleccionada
      },
      error: (err) => {
        console.error('Error al cargar los productos:', err);
        this.rows[index].items = []; // Limpia productos si hay un error
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.nombrePaquete || !this.formData.descripcionPaquete) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Emitir el evento con los datos esperados
    this.savePaquete.emit({
      nombrePaquete: this.formData.nombrePaquete,
      descripcionPaquete: this.formData.descripcionPaquete,
      rows: this.rows,
    });
  }


  cancel(): void {
    // Emitimos el evento de cancelar
    this.cancelPaquete.emit();
  }

}
