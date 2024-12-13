import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaquetesService } from '../../../../../../../services/paquetes.service';
import { AlertService } from '../../../../../../../services/alert.service';
import {FormPaqueteComponent} from "../../../../../../components/common/form-paquete/form-paquete.component";
import {Categoria} from "../../../../../../../models/categoria.models";
import {Producto} from "../../../../../../../models/producto.models";

@Component({
  selector: 'app-editar',
  standalone: true,
  templateUrl: './editar.component.html',
  imports: [
    FormPaqueteComponent
  ],
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  categorias: Categoria[] = [];
  isEditMode = true;

  paqueteId!: number;

  formData = {
    nombrePaquete: '',
    descripcionPaquete: '',
    categoria: '',
    nombre: '',
  };

  rows: Array<{
    cantidad: number;
    categoria: string;
    producto: number;
    descuento?: number | null;
    items: Producto[];
    // detalles_producto: any;
  }> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private paqueteService: PaquetesService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paqueteId = this.activatedRoute.snapshot.params['id'];
    this.loadPaquete();
  }

  loadPaquete(): void {
    this.paqueteService.getPaqueteById(this.paqueteId).subscribe({
      next: (paquete) => {
        // Cargar datos del paquete
        this.formData.nombrePaquete = paquete.nombre;
        this.formData.descripcionPaquete = paquete.descripcion;


        // Configurar las filas de productos en el formulario
        this.rows = paquete.detalles.map((detalle) => ({
          cantidad: detalle.cantidad,
          // categoria: detalle.detalles_producto?.categoria.id!.toString() || '',
          categoria: detalle.detalles_producto?.categoria.nombre!,
          producto: detalle.producto,
          descuento: detalle.precio_con_descuento || null,
          items: [], // Los ítems se cargarán en el componente de formulario
          detalles_producto: detalle.detalles_producto!,
        }));


      },
      error: () => this.alertService.error('Error al cargar el paquete.'),
    });
  }

  onSavePaquete(event: { nombrePaquete: string; descripcionPaquete: string; rows: any[] }): void {
    const { nombrePaquete, descripcionPaquete, rows } = event;

    const detalles = rows.map((row) => {
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
      nombre: nombrePaquete,
      descripcion: descripcionPaquete,
      detalles,
    };

    this.paqueteService.updatePaquete(paquete, this.paqueteId).subscribe({
      next: () => {
        this.alertService.success('Paquete actualizado exitosamente.');
        this.router.navigate(['/admin/inventario/paquetes/general']);
      },
      error: () => this.alertService.error('Error al actualizar el paquete.'),
    });
  }

  cancelPaquete(): void {
    this.router.navigate(['/admin/inventario/paquetes/general']);
  }

}
