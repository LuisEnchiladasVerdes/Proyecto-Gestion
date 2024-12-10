import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from "../../../../../../../services/categoria.service";
import { ProductoService } from "../../../../../../../services/producto.service";
import { PaquetesService } from "../../../../../../../services/paquetes.service";
import { AlertService } from "../../../../../../../services/alert.service";
import { Categoria } from "../../../../../../../models/categoria.models";
import { Producto } from "../../../../../../../models/producto.models";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-agregar',
  standalone: true,
  templateUrl: './agregar.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit {
  nombrePaquete = '';
  descripcionPaquete = '';
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  rows: Array<{ cantidad: number; categoria: string; producto: number | null; descuento?: number; items: Producto[] }> = [
    { cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] }
  ];

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private paqueteService: PaquetesService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
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

  onSaveItem(event: Event): void {
    event.preventDefault(); // Evita la recarga de la página
    if (!this.nombrePaquete || !this.descripcionPaquete) {
      this.alertService.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (!this.nombrePaquete || !this.descripcionPaquete) {
      this.alertService.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const detalles = this.rows.map((row) => {
      const detalle: any = {
        producto: row.producto,
        cantidad: row.cantidad,
      };
      if (row.descuento) {
        detalle.precio_con_descuento = row.descuento;
      }
      return detalle;
    });

    const paquete = {
      nombre: this.nombrePaquete,
      descripcion: this.descripcionPaquete,
      detalles
    };

    this.paqueteService.addPaquete(paquete).subscribe({
      next: () => {
        this.alertService.success('Paquete agregado exitosamente.');
        this.router.navigate(['/admin/inventario/paquetes/general']);
      },
      error: () => this.alertService.error('Error al guardar el paquete.')
    });
  }
}
