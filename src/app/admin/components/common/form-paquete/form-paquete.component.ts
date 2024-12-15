import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Categoria } from '../../../../models/categoria.models';
import { Producto } from '../../../../models/producto.models';
import { FormsModule} from "@angular/forms";
import { NgForOf } from "@angular/common";
import { ProductoService } from "../../../../services/producto.service";
import { paquetePost} from "../../../../models/paquetes.models";

@Component({
  selector: 'app-form-paquete',
  templateUrl: './form-paquete.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./form-paquete.component.css']
})
export class FormPaqueteComponent implements OnInit {
  // @Input() isEditMode = false;
  // @Input() formData: { nombrePaquete: string; descripcionPaquete: string; descuentoGeneral: number | null } = {
  //   nombrePaquete: '',
  //   descripcionPaquete: '',
  //   descuentoGeneral: null
  // };
  // @Input() rows: Array<{
  //   cantidad: number;
  //   categoria: string;
  //   producto: number | null;
  //   descuento?: number | null;
  //   items: Producto[];
  // }> = [];
  // @Input() categorias: Categoria[] = [];
  //
  // @Output() savePaquete = new EventEmitter<any>();
  // @Output() cancelPaquete = new EventEmitter<void>();
  //
  // constructor(private productoService: ProductoService) {}
  //
  // ngOnInit(): void {
  //   // Agrega una fila inicial si no existen filas
  //   if (!this.rows.length) {
  //     this.agregarFila();
  //   }
  // }
  //
  // agregarFila(): void {
  //   this.rows.push({ cantidad: 1, categoria: '', producto: null, descuento: null, items: [] });
  // }
  //
  // eliminarFila(index: number): void {
  //   this.rows.splice(index, 1);
  // }
  //
  // // Filtra productos al seleccionar una categoría
  // filterItemsByCategory(index: number): void {
  //   const categoriaId = parseInt(this.rows[index].categoria, 10);
  //
  //   if (!categoriaId) {
  //     this.rows[index].items = []; // Si no hay categoría válida, limpia los productos
  //     return;
  //   }
  //
  //   this.productoService.getProductosPorCategoria(categoriaId).subscribe({
  //     next: (productos) => (this.rows[index].items = productos),
  //     error: () => {
  //       console.error('Error al cargar los productos por categoría');
  //       this.rows[index].items = [];
  //     }
  //   });
  // }
  //
  // onSubmit(): void {
  //   const formOutput = {
  //     nombrePaquete: this.formData.nombrePaquete,
  //     descripcionPaquete: this.formData.descripcionPaquete,
  //     descuentoGeneral: this.formData.descuentoGeneral ?? null,
  //     rows: this.rows
  //   };
  //
  //   this.savePaquete.emit(formOutput);
  // }
  //
  // cancel(): void {
  //   this.cancelPaquete.emit();
  // }

  @Input() isEditMode = false;
  @Input() formData = {
    nombrePaquete: '',
    descripcionPaquete: '',
    descuentoGeneral: null as number | null,
  };

  @Input() rows: Array<{ cantidad: number; categoria: string; producto_id: number | null; items: Producto[] }> = [];
  @Input() categorias: Categoria[] = [];

  @Output() savePaquete = new EventEmitter<any>();
  @Output() cancelPaquete = new EventEmitter<void>();

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    if (!this.rows.length) this.agregarFila();
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
}
