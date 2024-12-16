import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {PaquetesService} from "../../../../../../../services/paquetes.service";
import {AlertService} from "../../../../../../../services/alert.service";
import {Categoria} from "../../../../../../../models/categoria.models";
import {FormPaqueteComponent} from "../../../../../../components/common/form-paquete/form-paquete.component";
import {CategoriaService} from "../../../../../../../services/categoria.service";

@Component({
  selector: 'app-agregar-paquete',
  templateUrl: './agregar.component.html',
  standalone: true,
  imports: [
    FormPaqueteComponent
  ],
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent {
  @ViewChild(FormPaqueteComponent) formPaquete!: FormPaqueteComponent;

  formData: {
    nombrePaquete: string;
    descripcionPaquete: string;
    descuentoGeneral: number | null;
  } = {
    nombrePaquete: '',
    descripcionPaquete: '',
    descuentoGeneral: null
  };

  rows: Array<{
    cantidad: number;
    categoria: string;
    producto_id: number | null;
    items: any[];
  }> = []; // Filas de productos inicializadas.

  categorias: any[] = []; // Lista de categorías para el formulario.
  mediaFiles: File[] = []; // Archivos multimedia seleccionados.

  constructor(
    private paqueteService: PaquetesService,
    private alertService: AlertService,
    private router: Router,
    private categoriaService: CategoriaService
  ) {
    this.agregarFila();
    this.cargarCategorias();
  }

  // Cargar las categorías desde el servicio
  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => (this.categorias = data),
      () => this.alertService.modalConIconoError('Error al cargar las categorías.')
    );
  }

  // Añadir nueva fila
  agregarFila(): void {
    this.rows.push({
      cantidad: 1,
      categoria: '',
      producto_id: null,
      items: []
    });
  }

  // Eliminar fila específica
  eliminarFila(index: number): void {
    this.rows.splice(index, 1);
  }

  // Actualizar archivos multimedia seleccionados desde form-paquete
  onImagesChanged(images: File[]): void {
    this.mediaFiles = images;
    console.log('Imágenes recibidas:', this.mediaFiles);
  }

  // Enviar datos al backend
  onSavePaquete(event: any): void {
    if (!event.rows || !Array.isArray(event.rows) || event.rows.length === 0) {
      this.alertService.error('Debes agregar al menos un producto.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', event.nombrePaquete);
    formData.append('descripcion', event.descripcionPaquete);

    if (event.descuentoGeneral !== null) {
      formData.append('descuento_general', event.descuentoGeneral.toString());
    }

    const detalles = event.rows.map((row: any) => ({
      producto_id: row.producto_id,
      cantidad: row.cantidad
    }));
    formData.append('detalles', JSON.stringify(detalles));

    // Agregar imágenes seleccionadas
    if (this.mediaFiles.length > 0) {
      this.mediaFiles.forEach((file) => formData.append('media', file));
    }

    // Enviar la solicitud al backend
    this.paqueteService.addPaquete(formData).subscribe({
      next: () => {
        this.alertService.success('Paquete creado exitosamente.');
        this.limpiarFormulario();
      },
      error: () => this.alertService.error('Error al crear el paquete.')
    });
  }

  limpiarFormulario(): void {
    this.formData = {
      nombrePaquete: '',
      descripcionPaquete: '',
      descuentoGeneral: null
    };

    this.rows = [{ cantidad: 1, categoria: '', producto_id: null, items: [] }];
    this.mediaFiles = [];

    // this.resetImageUploader();

    this.formPaquete.resetImages();
  }

  // Cancelar acción
  cancelPaquete(): void {
    this.router.navigate(['/admin/inventario/paquetes/general']);
  }
}
