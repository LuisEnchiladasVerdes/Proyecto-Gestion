import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Categoria} from "../../../../../../../models/categoria.models";
import {PaquetesService} from "../../../../../../../services/paquetes.service";
import {CategoriaService} from "../../../../../../../services/categoria.service";
import {AlertService} from "../../../../../../../services/alert.service";
import {FormPaqueteComponent} from "../../../../../../components/common/form-paquete/form-paquete.component";
import { Paquetes} from "../../../../../../../models/paquetes.models";
import {ProductoService} from "../../../../../../../services/producto.service";

@Component({
  selector: 'app-editar-paquete',
  templateUrl: './editar.component.html',
  standalone: true,
  imports: [
    FormPaqueteComponent
  ],
  styleUrl: './editar.component.css'
})
export class EditarComponent  implements OnInit {
  paqueteId!: number;
  formData = {
    nombrePaquete: '',
    descripcionPaquete: '',
    descuentoGeneral: 0,
  };
  rows: any[] = []; // Detalles de productos del paquete
  categorias: any[] = []; // Lista de categorías disponibles
  productosEliminados: number[] = []; // Guarda los IDs de productos eliminados
  selectedImages: File[] = []; // Guarda las nuevas imágenes seleccionadas
  mediaUrls: string[] = []; // Imágenes existentes del paquete

  existingImages: string[] = []; // Almacena las URLs de imágenes existentes
  mediaBaseUrl: string = '';
  imagenesModificadas: boolean = false;

  constructor(
    private paqueteService: PaquetesService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private categoriaService : CategoriaService,
    private productosService : ProductoService,
  ) {}

  ngOnInit(): void {
    this.paqueteId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPaquete();
    this.loadCategorias();

    this.mediaBaseUrl = this.paqueteService.getMediaBaseUrl();
  }

  // Carga los datos del paquete a editar
  loadPaquete(): void {
    this.paqueteService.getPaqueteById(this.paqueteId).subscribe({
      next: (paquete: Paquetes) => {
        this.formData = {
          nombrePaquete: paquete.nombre,
          descripcionPaquete: paquete.descripcion,
          // descuentoGeneral: typeof paquete.descuento_general === 'number' ? paquete.descuento_general : null,
          descuentoGeneral: typeof paquete.descuento_general === 'number'
            ? paquete.descuento_general
            : 0, // Si es null, asigna 0 como valor predeterminado
        };

        this.rows = paquete.detalles_relacionados!.map((detalle) => {
          return {
            cantidad: detalle.cantidad || 1,
            categoria: detalle.producto.categoria?.id!.toString() || '',
            producto_id: detalle.producto.id, // Asignamos el id del producto para el select
            producto_nombre: detalle.producto.nombre, // Para mostrar el nombre
            items: [], // Lista de productos filtrados se llenará dinámicamente
          };
        });

        // this.existingImages = paquete.media_urls || [];
        this.existingImages = paquete.media_urls!.map((url) => `${this.mediaBaseUrl}${url}`);


        console.log('Rows cargados:', this.rows);
        this.cargarProductosIniciales();
      },
      error: () => this.alertService.error('Error al cargar el paquete.'),
    });
  }

  cargarProductosIniciales(): void {
    this.rows.forEach((row, index) => {
      this.productosService.getProductosPorCategoria(Number(row.categoria)).subscribe({
        next: (productos) => {
          row.items = productos;
        },
        error: () => this.alertService.error(`Error al cargar productos para la categoría ${row.categoria}`),
      });
    });
  }

  // Carga las categorías (para el formulario)
  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        this.alertService.modalConIconoError('Error al cargar las categorias.');
      }
    );
  }

  // Elimina una fila localmente
  eliminarFila(index: number): void {
    const productoEliminado = this.rows[index];
    if (productoEliminado.producto_id) {
      this.productosEliminados.push(productoEliminado.producto_id); // Marca para eliminar en el backend
    }
    this.rows.splice(index, 1); // Elimina la fila del array
  }

  // Guarda el paquete editado
  onSavePaquete(event: any): void {
    const paqueteActualizado = {
      nombre: event.nombrePaquete,
      descripcion: event.descripcionPaquete,
      descuento_general: event.descuentoGeneral,
      detalles: this.rows.map((row) => ({
        producto_id: row.producto_id,
        cantidad: row.cantidad,
      })),
      media: this.selectedImages,
    };

    const deleteRequests = this.productosEliminados.map((productoId) =>
      this.paqueteService.deleteProductoFromPaquete(this.paqueteId, productoId).toPromise()
    );

    Promise.all(deleteRequests)
      .then(() => {
        const formData = new FormData();
        formData.append('nombre', paqueteActualizado.nombre);
        formData.append('descripcion', paqueteActualizado.descripcion);
        formData.append('descuento_general', String(paqueteActualizado.descuento_general));
        formData.append('detalles', JSON.stringify(paqueteActualizado.detalles));

        if (paqueteActualizado.media) {
          paqueteActualizado.media.forEach((file) => formData.append('media', file));
        }

        return this.paqueteService.updatePaquete(formData, this.paqueteId).toPromise();
      })
      .then(() => {
        this.alertService.success('Paquete actualizado correctamente.');
        this.router.navigate(['/admin/inventario/paquetes/general']);
      })
      .catch((error) => {
        console.error('Error al actualizar el paquete:', error);
        this.alertService.error('Error al actualizar el paquete.');
      });
  }

  // Cancelar edición y regresar a la vista general
  cancel(): void {
    this.router.navigate(['/admin/inventario/paquetes/general']);
  }

  onImagesChanged(images: File[]): void {
    this.selectedImages = images; // Guardar las nuevas imágenes seleccionadas
    this.imagenesModificadas = true; // Indicar que las imágenes han cambiado
  }

}
