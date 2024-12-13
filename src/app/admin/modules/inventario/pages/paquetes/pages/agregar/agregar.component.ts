// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { PaquetesService } from "../../../../../../../services/paquetes.service";
// import { AlertService } from "../../../../../../../services/alert.service";
// import { Producto } from "../../../../../../../models/producto.models";
// import {FormsModule} from "@angular/forms";
// import {FormPaqueteComponent} from "../../../../../../components/common/form-paquete/form-paquete.component";
//
// @Component({
//   selector: 'app-agregar',
//   standalone: true,
//   templateUrl: './agregar.component.html',
//   imports: [
//     FormsModule,
//     FormPaqueteComponent
//   ],
//   styleUrl: './agregar.component.css'
// })
// export class AgregarComponent {
//   nombrePaquete = '';
//   descripcionPaquete = '';
//   rows: Array<{ cantidad: number; categoria: string; producto: number | null; descuento?: number; items: Producto[] }> = [
//     { cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] }
//   ];
//   editMode: boolean = false;
//
//   constructor(
//     private paqueteService: PaquetesService,
//     private alertService: AlertService,
//     private router: Router
//   ) {}
//
//   onSaveItem(paquete: any): void {
//     this.paqueteService.addPaquete(paquete).subscribe({
//       next: () => {
//         this.alertService.success('Paquete agregado exitosamente.');
//         this.resetForm();
//       },
//       error: () => this.alertService.error('Error al guardar el paquete.')
//     });
//   }
//
//
//   resetForm(): void {
//     this.nombrePaquete = '';
//     this.descripcionPaquete = '';
//     this.rows = [{ cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] }];
//   }
//
//
// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../../../../../services/categoria.service';
import { PaquetesService } from '../../../../../../../services/paquetes.service';
import { AlertService } from '../../../../../../../services/alert.service';
import { Categoria } from '../../../../../../../models/categoria.models';
import { Producto } from '../../../../../../../models/producto.models';
import {FormPaqueteComponent} from "../../../../../../components/common/form-paquete/form-paquete.component";

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  standalone: true,
  imports: [
    FormPaqueteComponent
  ],
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  formData = {
    nombrePaquete: '',
    descripcionPaquete: ''
  };
  rows: Array<{ cantidad: number; categoria: string; producto: number | null; descuento?: number; items: Producto[] }> = [];
  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
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

  onSavePaquete(): void {
    if (!this.formData.nombrePaquete || !this.formData.descripcionPaquete) {
      this.alertService.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const detalles = this.rows.map((row) => {
      const detalle: any = {
        producto: row.producto,
        cantidad: row.cantidad
      };
      if (row.descuento) {
        detalle.precio_con_descuento = row.descuento;
      }
      return detalle;
    });

    const paquete = {
      nombre: this.formData.nombrePaquete,
      descripcion: this.formData.descripcionPaquete,
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

  onCancel(): void {
    this.router.navigate(['/admin/inventario/paquetes/general']);
  }
}
