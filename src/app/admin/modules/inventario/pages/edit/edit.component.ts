import {Component, OnInit, signal} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {Producto} from "../../../../../models/producto.models";
import {ProductoService} from "../../../../../services/producto.service";
import {Categoria} from "../../../../../models/categoria.models";
import {CategoriaService} from "../../../../../services/categoria.service";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    RouterLink,
    NgForOf
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  producto: Producto = {
    id: 0,
    nombre: '',
    categoria: { id: 0, nombre: '' }, // Inicialización de categoria como un objeto vacío
    descripcion: '',
    stock: 0,
    precio_actual : 0,
    precio: 0,
    media_relacionado: []
  };

  categorias: Categoria[] = []; // Lista de categorías disponibles

  formValid = {
    nombre: true,
    categoria: true,
    stock: true,
    precio: true,
    descripcion: true
  };

  selectedImage: File | null = null; // Para almacenar el archivo seleccionado
  imageUrl = signal<string | null>(null);

  // ATRIBUTO PARA IMAGENES
  mediaBaseUrl: string = '';

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length === 1) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageString = reader.result as string;
        this.imageUrl.set(imageString); // Actualiza la vista previa
        // console.log(imageString); // Imprime la cadena en la consola
        this.selectedImage = file;
        console.log(this.imageUrl)
      };

      reader.readAsDataURL(file); // Lee el archivo como Base64
    }
  }

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService : CategoriaService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(id);
    }
    this.cargarCategorias(); // Cargar las categorías al inicio
    this.mediaBaseUrl = this.productoService.getMediaBaseUrl();
  }

  cargarProducto(id: string): void {
    this.productoService.getItemById(id).subscribe(
      (producto: Producto) => {
        this.producto = producto;
        this.producto.categoria_id = producto.categoria?.id || undefined;
      },
      (error) => {
        console.error('Error al cargar el producto:', error);
        alert('Error al cargar el producto.');
      }
    );
  }


  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (categorias: Categoria[]) => {
        this.categorias = categorias;
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
        alert('Error al cargar las categorías.');
      }
    );
  }


  guardarCambios(): void {
    console.log('Producto antes de guardar:', this.producto);

    if (this.validarFormulario()) {
      const formData = new FormData();

      formData.append('nombre', this.producto.nombre);
      formData.append('descripcion', this.producto.descripcion);
      formData.append('stock', this.producto.stock.toString());
      formData.append('precio', this.producto.precio_actual.toString());

      if (this.producto.categoria_id) {
        formData.append('categoria_id', this.producto.categoria_id.toString());
      } else {
        alert('Por favor selecciona una categoría antes de guardar.');
        return;
      }

      if (this.selectedImage) {
        formData.append('media', this.selectedImage); // Agregar el archivo al FormData
      }

      if (this.producto.id) {
        this.productoService.updateItem(formData, this.producto.id).subscribe(
          (response) => {
            alert('Producto actualizado correctamente.');
            this.router.navigate(['/admin/inventario/general']);
          },
          (error) => {
            console.error('Error al guardar los cambios:', error);
            alert('Hubo un error al guardar los cambios.');
          }
        );
      } else {
        alert('ID de producto no válido.');
      }
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }


  validarFormulario(): boolean {
    let valid = true;
    // Verificar que los campos editables sean correctos
    if (!this.producto.nombre || !this.producto.descripcion) {
      valid = false;
    }
    if (this.producto.stock <= 0) {
      valid = false;
    }
    if (this.producto.precio_actual <= 0) {
      valid = false;
    }
    return valid;
  }

  onCategoriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.producto.categoria_id = Number(selectElement.value);
  }

  eliminarImagen(index: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      this.producto.media_relacionado.splice(index, 1); // Eliminar la imagen de la lista
    }
  }



}
