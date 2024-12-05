import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgFor, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {CategoriaService} from "../../../../../../../services/categoria.service";
import {ProductoService} from "../../../../../../../services/producto.service";
import {AlertService} from "../../../../../../../services/alert.service";
import {Categoria} from "../../../../../../../models/categoria.models";
import {Producto} from "../../../../../../../models/producto.models";

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit {
  nameError = '';
  quantityError = '';
  descriptionError = '';
  imageError = '';

  categoriaSeleccionada = '';
  categorias: Categoria[] = [];
  productos: Producto[] = [];

  constructor(
    private categoriasService: CategoriaService,
    private productoService: ProductoService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.obtenerProductos();
    this.rows.forEach(row => {
      row.categoria = 'todos'; // Esto asegura que todos los productos se carguen por defecto
    });

    // También puedes llamar a filterItemsByCategory para cargar los productos de inmediato
    this.filterItemsByCategory(0); // Llama al filtro para la primera fila
  }

  loadCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (data: Categoria[]) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => {
        this.productos = productos;
      },
      error: (err) => {
        if (err.message.includes('401')) {
          this.alertService.modalConIconoError('No autorizado. Inicia sesión nuevamente.');
          this.router.navigate(['/admin/login']);
        } else {
          this.alertService.modalConIconoError('Error al cargar los productos.');
        }
      },
    });
  }

  validateName() {
    const nameInput = (document.getElementById('name') as HTMLInputElement).value;
    this.nameError = /^[^0-9]+$/.test(nameInput) ? '' : 'El nombre no debe contener números';
  }

  validateDescription() {
    const descriptionInput = (document.getElementById('description') as HTMLTextAreaElement).value;
    this.descriptionError = descriptionInput ? '' : 'La descripción no debe estar vacía';
  }

  validateImage() {
    const imageInput = (document.getElementById('file-upload') as HTMLInputElement).files;
    this.imageError = imageInput && imageInput.length > 0 ? '' : 'Se debe seleccionar una imagen';
  }

  limpiarCampos() {
    // (document.getElementById('name') as HTMLInputElement).value = '';
    // (document.getElementById('quantity') as HTMLInputElement).value = '';
    // (document.getElementById('description') as HTMLTextAreaElement).value = '';
    // (document.getElementById('file-upload') as HTMLInputElement).value = '';
    //
    // this.nameError = '';
    // this.descriptionError = '';
    // this.imageError = '';
  }

  onSaveItem(event: Event) {
    event.preventDefault(); // Evita la recarga de la página

    this.validateName();
    this.validateDescription();
    this.validateImage();

    // Si no hay errores, muestra el mensaje de éxito                         && !this.imageError
    if (!this.nameError && !this.descriptionError) {
      alert('Item agregado');
      this.limpiarCampos();
    }
  }

  // rows: Array<{
  //   cantidad: number;
  //   categoria: string;
  //   item: string;
  //   nota: string;
  // }> = [
  //   { cantidad: 0, categoria: '', item: '', nota: '' },
  // ];

  rows: Array<{ cantidad: number; categoria: string; item: string[]; nota: string }> = [
    { cantidad: 0, categoria: '', item: [], nota: '' },
  ];


  // Agregar una nueva fila
  agregarFila() {
    this.rows.push({cantidad: 0, categoria: '', item: [], nota: ''});
  }

  // Eliminar una fila por índice
  eliminarFila(index: number) {
    this.rows.splice(index, 1);
  }

  filterItemsByCategory(index: number): void {
    const categoriaSeleccionada = this.rows[index].categoria;

    if (!categoriaSeleccionada || categoriaSeleccionada === 'todos') {
      // Si no hay categoría seleccionada o seleccionamos "todos", cargar todos los productos
      this.productoService.getProductos().subscribe({
        next: (productos: Producto[]) => {
          // Asumimos que todos los productos se deben mostrar
          this.rows[index].item = productos.map((producto) => producto.nombre);
        },
        error: () => {
          this.alertService.error('Error al cargar todos los productos.');
          this.rows[index].item = []; // Vaciar ítems en caso de error
        },
      });
    } else {
      const categoriaId = parseInt(categoriaSeleccionada, 10);

      // Llamada al servicio para obtener ítems filtrados por categoría
      this.productoService.getProductosPorCategoria(categoriaId).subscribe({
        next: (productos: Producto[]) => {
          // Actualizar los ítems en la fila correspondiente
          this.rows[index].item = productos.map((producto) => producto.nombre);
        },
        error: () => {
          this.alertService.error('Error al filtrar ítems por categoría.');
          this.rows[index].item = []; // Vaciar ítems en caso de error
        },
      });
    }
  }


}
