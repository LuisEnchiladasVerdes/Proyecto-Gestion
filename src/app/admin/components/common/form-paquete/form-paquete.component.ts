import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Producto} from "../../../../models/producto.models";
import {Categoria} from "../../../../models/categoria.models";
import {CategoriaService} from "../../../../services/categoria.service";
import {ProductoService} from "../../../../services/producto.service";
import {AlertService} from "../../../../services/alert.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-form-paquete',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink
  ],
  templateUrl: './form-paquete.component.html',
  styleUrl: './form-paquete.component.css'
})
export class FormPaqueteComponent implements OnInit {
  @Input() nombrePaquete = '';
  @Input() descripcionPaquete = '';
  @Input() rows: Array<{ cantidad: number; categoria: string; producto: number | null; descuento?: number; items: Producto[] }> = [];
  @Input() editMode: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  categorias: Categoria[] = [];

  private originalState: any;

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    if (this.rows.length === 0) {
      this.agregarFila();
    }
    this.originalState = this.cloneCurrentState();
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: () => this.alertService.error('Error al cargar las categorías.')
    });
  }

  filterItemsByCategory(index: number): void {
    const categoriaId = parseInt(this.rows[index].categoria, 10);

    if (isNaN(categoriaId)) {
      this.rows[index].items = [];
      return;
    }

    this.productoService.getProductosPorCategoria(categoriaId).subscribe({
      next: (productos) => (this.rows[index].items = productos),
      error: () => this.alertService.error('Error al cargar los productos.')
    });
  }

  agregarFila(): void {
    this.rows.push({ cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] });
  }

  eliminarFila(index: number): void {
    this.rows.splice(index, 1);
  }

  submitForm(): void {
    // const detalles = this.rows.map((row) => {
    //   const detalle: any = {
    //     producto: row.producto,
    //     cantidad: row.cantidad,
    //   };
    //   if (row.descuento) {
    //     detalle.precio_con_descuento = row.descuento;
    //   }
    //   return detalle;
    // });
    //
    // const paquete = {
    //   nombre: this.nombrePaquete,
    //   descripcion: this.descripcionPaquete,
    //   detalles
    // };
    //
    // this.formSubmit.emit(paquete);

    if (this.editMode && !this.hasChanges()) {
      alert('No se detectaron cambios en el paquete.');
      return;
    }

    const detalles = this.rows.map((row) => ({
      producto: row.producto,
      cantidad: row.cantidad,
      precio_con_descuento: row.descuento || undefined,
    }));

    const paquete = {
      nombre: this.nombrePaquete,
      descripcion: this.descripcionPaquete,
      detalles,
    };

    console.log('Formulario enviado:', paquete);

    this.formSubmit.emit(paquete);

    // Limpiar los campos solo cuando se está creando el paquete
    if (!this.editMode) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.nombrePaquete = '';
    this.descripcionPaquete = '';
    this.rows = [{ cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] }];
  }

  cloneCurrentState(): any {
    return {
      nombre: this.nombrePaquete,
      descripcion: this.descripcionPaquete,
      detalles: [...this.rows],
    };
  }

  hasChanges(): boolean {
    const currentState = this.cloneCurrentState();
    return JSON.stringify(currentState) !== JSON.stringify(this.originalState);
  }
}
